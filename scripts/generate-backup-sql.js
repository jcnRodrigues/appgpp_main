#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs/promises");
const path = require("node:path");
const { execSync } = require("node:child_process");

const BACKUP_TABLES = [
  { key: "tbUser", tableName: "tbUser" },
  { key: "tbFuncionario", tableName: "tbFuncionario" },
  { key: "tbLicenca", tableName: "tbLicenca" },
  { key: "tbHasLicencaFuncionario", tableName: "has_" },
  { key: "tbStatusFun", tableName: "tbStatusFun" },
  { key: "tbFuncao", tableName: "tbFuncao" },
  { key: "tbPatrimonio", tableName: "tbPatrimonio" },
  { key: "tbTipoPat", tableName: "tbTipoPat" },
  { key: "tbStatusPat", tableName: "tbStatusPat" },
  { key: "tbEmpresa", tableName: "tbEmpresa" },
  { key: "tbStatusCCusto", tableName: "tbStatusCCusto" },
  { key: "tbCCusto", tableName: "tbCCusto" },
  { key: "tbBmMedicao", tableName: "tbBmMedicao" },
  { key: "tbInventarioProcesso", tableName: "tbInventarioProcesso" },
  { key: "tbTransferenciaCustoPatrimonio", tableName: "tbTransferenciaCustoPatrimonio" },
  { key: "tbTransferenciaProcesso", tableName: "tbTransferenciaProcesso" },
  { key: "tbCadastro", tableName: "tbCadastro" },
  { key: "tbTransferenciaAlocacao", tableName: "tbTransferenciaAlocacao" },
  { key: "tbDevolucao", tableName: "tbDevolucao" },
  { key: "tbDevolucaoProcesso", tableName: "tbDevolucaoProcesso" },
  { key: "tbAuditoriaDevolucaoPatrimonio", tableName: "tbAuditoriaDevolucaoPatrimonio" },
  { key: "tbPatrimonioHistorico", tableName: "tbPatrimonioHistorico" },
  { key: "tbAtivoRede", tableName: "tbAtivoRede" },
  { key: "tbTipoAtivoRede", tableName: "tbTipoAtivoRede" },
  { key: "tbStatusAtivoRede", tableName: "tbStatusAtivoRede" },
  { key: "tbTransferenciaAtivoRede", tableName: "tbTransferenciaAtivoRede" },
  { key: "tbDevolucaoAtivoRede", tableName: "tbDevolucaoAtivoRede" },
  { key: "Account", tableName: "Account" },
  { key: "Session", tableName: "Session" },
  { key: "User", tableName: "User" },
  { key: "VerificationToken", tableName: "VerificationTokens" },
  { key: "tbUnifiConfig", tableName: "tbUnifiConfig" }
];

const DEFAULT_ROWS_PER_INSERT = 200;
const JSON_COLUMNS = new Set([
  "formulariosUser",
  "centrosUser",
  "resumoJson",
  "resultadosJson",
  "naoInformadosJson",
  "itensJson",
  "detalhesJson"
]);

function escapeMysqlString(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\u0000/g, "\\0")
    .replace(/\u0008/g, "\\b")
    .replace(/\u0009/g, "\\t")
    .replace(/\u000a/g, "\\n")
    .replace(/\u000d/g, "\\r")
    .replace(/\u001a/g, "\\Z")
    .replace(/'/g, "''");
}

function isDateValue(value) {
  return value instanceof Date;
}

function isIsoDateString(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value);
}

function isJsonColumn(columnName) {
  return JSON_COLUMNS.has(columnName) || columnName.endsWith("Json");
}

function formatMysqlDate(value) {
  const pad = (n, size = 2) => String(n).padStart(size, "0");
  return [
    value.getUTCFullYear(),
    "-",
    pad(value.getUTCMonth() + 1),
    "-",
    pad(value.getUTCDate()),
    " ",
    pad(value.getUTCHours()),
    ":",
    pad(value.getUTCMinutes()),
    ":",
    pad(value.getUTCSeconds()),
    ".",
    pad(value.getUTCMilliseconds(), 3)
  ].join("");
}

function toJsonSqlLiteral(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }
  if (typeof value === "string" && value.trim() === "") {
    return "NULL";
  }
  const jsonValue = isDateValue(value) || isIsoDateString(value) ? formatMysqlDate(new Date(value)) : value;
  return `'${escapeMysqlString(JSON.stringify(jsonValue))}'`;
}

function toSqlLiteral(value, columnName) {
  if (columnName && isJsonColumn(columnName)) {
    return toJsonSqlLiteral(value);
  }
  if (value === null || value === undefined) return "NULL";
  if (isDateValue(value)) return `'${escapeMysqlString(formatMysqlDate(value))}'`;
  if (isIsoDateString(value)) return `'${escapeMysqlString(formatMysqlDate(new Date(value)))}'`;
  if (Buffer.isBuffer(value)) return `0x${value.toString("hex")}`;
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "bigint") return value.toString();
  return `'${escapeMysqlString(String(value))}'`;
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function generateSchemaSql() {
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  const quotedSchemaPath = `"${schemaPath.replace(/"/g, '\\"')}"`;
  const command = `npx prisma migrate diff --from-empty --to-schema-datamodel ${quotedSchemaPath} --script`;
  return execSync(command, {
    encoding: "utf8",
    shell: true,
    env: {
      ...process.env,
      CI: "1",
      PRISMA_HIDE_UPDATE_MESSAGE: "1"
    }
  });
}

function getPhysicalTableName(key) {
  const entry = BACKUP_TABLES.find((item) => item.key === key);
  return entry ? entry.tableName : key;
}

function getOrderedTables(data) {
  const ordered = [];
  const seen = new Set();

  for (const def of BACKUP_TABLES) {
    if (Object.prototype.hasOwnProperty.call(data, def.key)) {
      ordered.push([def.key, data[def.key] || []]);
      seen.add(def.key);
    }
  }

  for (const [key, rows] of Object.entries(data)) {
    if (!seen.has(key)) {
      ordered.push([key, rows || []]);
    }
  }

  return ordered;
}

function generateMysqlBackupSql(data, generatedAt, schemaSql) {
  const ddl = schemaSql || generateSchemaSql();
  const lines = [];

  lines.push("-- APPGPP backup SQL");
  lines.push(`-- Generated at: ${generatedAt.toISOString()}`);
  lines.push("SET NAMES utf8mb4;");
  lines.push("SET FOREIGN_KEY_CHECKS=0;");
  lines.push("");
  lines.push("-- Recreate structure");
  lines.push(`DROP TABLE IF EXISTS ${BACKUP_TABLES.map((def) => `\`${def.tableName}\``).join(", ")};`);
  lines.push("");
  lines.push(ddl.trim());
  lines.push("");
  lines.push("-- Data");

  for (const [tableKey, rows] of getOrderedTables(data)) {
    const tableName = getPhysicalTableName(tableKey);
    if (!Array.isArray(rows) || rows.length === 0) {
      lines.push(`-- ${tableName}: 0 rows`);
      lines.push("");
      continue;
    }

    const columns = Object.keys(rows[0] || {});
    const columnSql = columns.map((column) => `\`${column}\``).join(", ");
    const rowChunks = chunkArray(rows, DEFAULT_ROWS_PER_INSERT);

    for (const chunk of rowChunks) {
      const valuesSql = chunk
        .map((row) => {
          const values = columns.map((column) => toSqlLiteral(row[column], column));
          return `(${values.join(", ")})`;
        })
        .join(",\n  ");

      lines.push(`INSERT INTO \`${tableName}\` (${columnSql}) VALUES`);
      lines.push(`  ${valuesSql};`);
      lines.push("");
    }
  }

  lines.push("SET FOREIGN_KEY_CHECKS=1;");
  lines.push("");

  return lines.join("\n");
}

function parseArgs(argv) {
  const args = { input: null, output: null };
  const positionals = [];

  for (let index = 2; index < argv.length; index++) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--input" || current === "-i") {
      args.input = next || null;
      index++;
      continue;
    }

    if (current === "--output" || current === "-o") {
      args.output = next || null;
      index++;
      continue;
    }

    if (!current.startsWith("-")) {
      positionals.push(current);
    }
  }

  if (!args.input && positionals.length > 0) {
    args.input = positionals[0];
  }
  if (!args.output && positionals.length > 1) {
    args.output = positionals[1];
  }

  return args;
}

async function findLatestBackupJson(backupsDir) {
  const entries = await fs.readdir(backupsDir, { withFileTypes: true });
  const folders = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith("backup_DB_")) {
      continue;
    }

    const backupJsonPath = path.join(backupsDir, entry.name, "backup-completo.json");
    try {
      const stat = await fs.stat(backupJsonPath);
      folders.push({ backupJsonPath, mtimeMs: stat.mtimeMs });
    } catch {
      // Ignore folders without a backup-completo.json file.
    }
  }

  folders.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return folders[0] || null;
}

async function main() {
  const args = parseArgs(process.argv);
  const projectRoot = process.cwd();
  const backupsDir = path.join(projectRoot, "backups");

  let inputPath = args.input;
  if (!inputPath) {
    const latest = await findLatestBackupJson(backupsDir);
    if (!latest) {
      throw new Error("Nenhum backup-completo.json encontrado em /backups.");
    }
    inputPath = latest.backupJsonPath;
  } else {
    inputPath = path.resolve(projectRoot, inputPath);
  }

  const raw = await fs.readFile(inputPath, "utf8");
  const parsed = JSON.parse(raw);
  const data = parsed?.data;

  if (!data || typeof data !== "object") {
    throw new Error("O arquivo informado nao possui a chave 'data'.");
  }

  const generatedAt = parsed?.generatedAt ? new Date(parsed.generatedAt) : new Date();
  const schemaSql = generateSchemaSql();
  const sql = generateMysqlBackupSql(data, generatedAt, schemaSql);

  const outputPath = args.output
    ? path.resolve(projectRoot, args.output)
    : path.join(path.dirname(inputPath), "backup-completo.sql");

  await fs.writeFile(outputPath, sql, "utf8");
  console.log(`SQL gerado com sucesso em: ${outputPath}`);
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
