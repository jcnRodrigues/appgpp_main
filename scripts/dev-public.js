const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex <= 0) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (!key) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function persistEnvValue(filePath, key, value) {
  let content = '';
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
  }

  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const line = `${key}=${value}`;
  const regex = new RegExp(`^${escapedKey}=.*$`, 'm');

  if (regex.test(content)) {
    content = content.replace(regex, line);
  } else {
    if (content && !content.endsWith('\n')) {
      content += '\n';
    }
    content += `${line}\n`;
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

loadEnvFile(path.join(process.cwd(), '.env.local'));
loadEnvFile(path.join(process.cwd(), '.env'));

const port = process.env.PORT || '3000';
const domain = process.env.NGROK_DOMAIN || '';
const authToken = process.env.NGROK_AUTHTOKEN || '';
const targetHostOverride = process.env.NGROK_TARGET_HOST || '';

function isPrivateIpv4(ip) {
  if (!ip || typeof ip !== 'string') return false;
  return (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)
  );
}

function getActiveLocalIp() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const entries of Object.values(interfaces)) {
    if (!entries) continue;
    for (const addr of entries) {
      if (!addr || addr.internal || addr.family !== 'IPv4') continue;
      if (addr.address.startsWith('169.254.')) continue;
      candidates.push(addr.address);
    }
  }

  const privateIp = candidates.find(isPrivateIpv4);
  if (privateIp) return privateIp;
  return candidates[0] || '127.0.0.1';
}

function resolveNgrokCommand() {
  const customBin = process.env.NGROK_BIN;
  if (customBin) {
    return customBin;
  }

  const cwd = process.cwd();
  const localCandidates = process.platform === 'win32'
    ? [
        path.join(cwd, 'node_modules', 'ngrok', 'bin', 'ngrok.exe'),
        path.join(cwd, 'node_modules', '.bin', 'ngrok.cmd'),
      ]
    : [
        path.join(cwd, 'node_modules', 'ngrok', 'bin', 'ngrok'),
        path.join(cwd, 'node_modules', '.bin', 'ngrok'),
      ];

  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return 'ngrok';
}

function getNextProcessConfig() {
  const nextCli = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
  if (fs.existsSync(nextCli)) {
    return {
      command: process.execPath,
      args: [nextCli, 'dev', '--hostname', '0.0.0.0', '--port', String(port)],
    };
  }

  return {
    command: 'next',
    args: ['dev', '--hostname', '0.0.0.0', '--port', String(port)],
  };
}

const ngrokCmd = resolveNgrokCommand();
const ngrokCheck = spawnSync(ngrokCmd, ['version'], { stdio: 'ignore', env: process.env });
if (ngrokCheck.error || ngrokCheck.status !== 0) {
  console.error('ngrok nao encontrado. Rode `npm install` para instalar dependencias ou instale ngrok globalmente.');
  process.exit(1);
}

if (authToken) {
  const authResult = spawnSync(ngrokCmd, ['config', 'add-authtoken', authToken], {
    stdio: 'inherit',
    env: process.env,
  });

  if (authResult.status !== 0) {
    console.error('Falha ao configurar NGROK_AUTHTOKEN. Verifique se o token esta correto.');
    process.exit(authResult.status || 1);
  }
}

const nextProcess = getNextProcessConfig();
const targetHost = targetHostOverride || getActiveLocalIp();
const targetAddress = `${targetHost}:${port}`;
persistEnvValue(path.join(process.cwd(), '.env.local'), 'NGROK_TARGET_HOST', targetHost);

console.log(`Iniciando Next.js em http://localhost:${port} ...`);
const dev = spawn(nextProcess.command, nextProcess.args, { stdio: 'inherit', env: process.env });

const ngrokArgs = ['http'];
if (domain) {
  ngrokArgs.push(`--url=${domain}`);
}
ngrokArgs.push(targetAddress);

console.log(`Iniciando ngrok para ${targetAddress} ...`);
const ngrok = spawn(ngrokCmd, ngrokArgs, { stdio: 'inherit', env: process.env });

let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  if (signal) {
    console.log(`\\nRecebido ${signal}. Encerrando processos...`);
  }

  if (!dev.killed) {
    dev.kill('SIGINT');
  }
  if (!ngrok.killed) {
    ngrok.kill('SIGINT');
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('exit', () => shutdown());

dev.on('exit', (code) => {
  if (!shuttingDown) {
    console.error(`Servidor Next.js finalizado com codigo ${code ?? 0}. Encerrando ngrok...`);
    shutdown();
  }
});

ngrok.on('error', (err) => {
  console.error('Falha ao iniciar ngrok:', err.message);
  shutdown();
  process.exit(1);
});

ngrok.on('exit', (code) => {
  if (!shuttingDown) {
    console.log(`ngrok finalizado com codigo ${code ?? 0}. Encerrando servidor Next.js...`);
    shutdown();
  }

  setTimeout(() => {
    process.exit(code ?? 0);
  }, 100);
});
