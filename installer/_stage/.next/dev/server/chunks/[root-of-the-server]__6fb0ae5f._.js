module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/src/lib/termoResponsabilidadePuppeteer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildHtml",
    ()=>buildHtml
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function formatarCpf(cpf) {
    if (!cpf || !cpf.trim()) return '_______________________';
    const n = cpf.replace(/\D/g, '');
    if (n.length === 11) {
        return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
    }
    return cpf;
}
function getParexLogoDataUri() {
    const logoCandidates = [
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'iconPX.png'),
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'Imagens', 'parex.png'),
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'Imagens', 'parex_logo.png')
    ];
    for (const logoPath of logoCandidates){
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].existsSync(logoPath)) {
            const ext = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].extname(logoPath).toLowerCase();
            const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
            const base64 = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].readFileSync(logoPath).toString('base64');
            return `data:${mime};base64,${base64}`;
        }
    }
    return null;
}
function buildHtml(dados) {
    const nomeMatricula = escapeHtml(`${dados.nomeFun} - ${dados.idMatFun}`);
    const cpfFormatado = escapeHtml(formatarCpf(dados.cpfFun));
    const tipoPatrimonioBase = dados.tipoPatrimonio?.trim() || dados.descricaoPat?.trim() || 'PATRIMONIO';
    const tipoPatrimonio = escapeHtml(tipoPatrimonioBase.split(/\s+/).filter(Boolean)[0] || tipoPatrimonioBase);
    const marcaBase = dados.marca?.trim() || dados.descricaoPat?.trim() || 'Conforme cadastro';
    const marcaPrimeiraPalavra = marcaBase.split(/\s+/).filter(Boolean)[0] || marcaBase;
    const marca = escapeHtml(marcaPrimeiraPalavra);
    const modelo = escapeHtml(dados.modelo?.trim() || dados.descricaoPat?.trim() || 'Conforme cadastro');
    const patrimonio = escapeHtml(dados.idPat);
    const localData = escapeHtml(dados.localData?.trim() || 'PARAUAPEBAS PA, _____ de ______________ de ______');
    const statusAlocacaoNormalizado = (dados.statusAlocacao || '').trim().toUpperCase();
    const condicaoPorStatusRaw = statusAlocacaoNormalizado.includes('DEVOL') ? 'Devolução' : statusAlocacaoNormalizado.includes('TRANSFER') ? 'Transferido' : statusAlocacaoNormalizado.includes('ATIVO') ? 'Recebimento' : 'Condicao da alocacao: o usuario declara ciencia do status atual do patrimonio e de suas responsabilidades conforme as normas internas.';
    const condicaoPorStatus = escapeHtml(condicaoPorStatusRaw);
    let textoProgramas = 'E proibida a instalacao de softwares sem a autorizacao da coordenacao da TI. Este equipamento esta licenciado com o sistema operacional Windows e o pacote Office (Word - Excel - Outlook - Power Point)';
    if (dados.outrosProgramas && dados.outrosProgramas.length > 0) {
        textoProgramas += ` e ${escapeHtml(dados.outrosProgramas.join(', '))}.`;
    } else {
        textoProgramas += ' e OBS se necessario incluir outros programas instalados que nao estao na lista.';
    }
    const logoDataUri = getParexLogoDataUri();
    const logoHtml = logoDataUri ? `<img src="${logoDataUri}" alt="Logo Parex" class="logo-img" />` : `<div class="logo-fallback"><div class="logo">PAREX</div><div class="sub">ENGENHARIA</div></div>`;
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Termo de Responsabilidade - PAT${patrimonio} - ${nomeMatricula}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      padding: 20mm;
      max-width: 210mm;
      margin: 0 auto;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      display: grid;
      grid-template-columns: 38mm 1fr 34mm;
      border: 1px solid #7d7d7d;
      margin-bottom: 18px;
      min-height: 26mm;
    }
    .logo-box {
      border-right: 1px solid #7d7d7d;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
    }
    .logo-img {
      width: 100%;
      max-width: 30mm;
      height: auto;
      object-fit: contain;
    }
    .logo-fallback { text-align: center; }
    .logo-fallback .logo { font-size: 15pt; font-weight: bold; line-height: 1; }
    .logo-fallback .sub { font-size: 8pt; margin-top: 2px; }
    .header-center {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 6px 8px;
    }
    .header-center .titulo1 { font-size: 10.5pt; font-weight: bold; letter-spacing: .3px; }
    .header-center .titulo2 { font-size: 8.5pt; margin-top: 3px; font-weight: 600; }
    .doc-box {
      border-left: 1px solid #7d7d7d;
      display: grid;
      grid-template-rows: repeat(4, 1fr);
      font-size: 8pt;
      text-align: center;
      font-weight: 600;
    }
    .doc-row {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .doc-row + .doc-row { border-top: 1px solid #7d7d7d; }
    .doc-title { text-align: center; margin: 14px 0 16px; }
    .doc-title h1 { font-size: 14pt; font-weight: bold; line-height: 1.5; }
    .body p { margin-bottom: 12px; text-align: justify; }
    .assinatura { margin-top: 24px; font-size: 10pt; line-height: 2; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-box">
      ${logoHtml}
    </div>
    <div class="header-center">
      <div class="titulo1">USO ${tipoPatrimonio} PAREX</div>
      <div class="titulo2">Gerenciamento de Recursos Humanos</div>
    </div>
    <div class="doc-box">
      <div class="doc-row">PMO</div>
      <div class="doc-row">FO-09-052</div>
      <div class="doc-row">REV.:00</div>
      <div class="doc-row">PAG: 1 de 1</div>
    </div>
  </div>

  <div class="doc-title">
    <h1>Termo de Responsabilidade - ${condicaoPorStatus}<br>Uso ${tipoPatrimonio} Parex - Funcionarios</h1>
  </div>

  <div class="body">
    <p>&emsp;&emsp;Por este instrumento a PAREX entrega a guarda ao Sr., ${nomeMatricula}, neste ato denominado USUARIO, inscrito no CPF no. ${cpfFormatado}, um computador ${tipoPatrimonio} marca ${marca}, modelo ${modelo}, contendo: 01 carregador de bateria, patrimoniado sob o Numero PAT ${patrimonio}, ficando o mesmo responsavel por qualquer dano, perda ou furto, e da mesma forma, pelo zelo e manutencao deste equipamento, sob pena de ressarcimento a PAREX se algum destes fatos ocorrer e for constatada negligencia por parte do USUARIO. O usuario permanece responsavel tambem pelo equipamento quando da transferencia do mesmo a outros funcionarios / terceiros sem a previa autorizacao da Coordenacao de TI Corporativa.</p>

    <p>&emsp;&emsp;O USUARIO reconhece que a utilizacao do equipamento se dara somente no horario comercial de trabalho, ou seja, de 07h30min (Sete horas e trinta minutos) as 17h30min (dezessete horas e trinta minutos), com intervalo de 01h00min (Uma hora), de 2a a 5a feiras e das 07h30min (Sete horas e trinta minutos) as 16h30min (dezesseis horas e trinta minutos), com intervalo de 01h00min (Uma hora) as 6a feiras e que o equipamento e para uso exclusivo no trabalho da empresa.</p>

    <p>&emsp;&emsp;${textoProgramas}</p>
    <br/>

    <div class="assinatura">
      <div>${localData}</div>
      <br/>
      <div style="margin-top: 20px;">_______________________________________</div>
      <div style="margin-top: 0px;">${nomeMatricula}</div>
      <div style="margin-top: 0px;">CPF - ${cpfFormatado}</div>
      <br/>
      <div style="margin-top: 14px;">_______________________________________</div>
      <div style="margin-top: 0px;">Responsavel setor TI</div>
    </div>
  </div>
</body>
</html>`;
}
}),
"[project]/src/lib/renderPdf.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "renderPdf",
    ()=>renderPdf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$termoResponsabilidadePuppeteer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/termoResponsabilidadePuppeteer.ts [app-route] (ecmascript)");
;
async function renderPdf(documentData) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$termoResponsabilidadePuppeteer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildHtml"])(documentData);
}
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/src/lib/generatePdf.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "generatePdf",
    ()=>generatePdf
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$puppeteer$29$__ = __turbopack_context__.i("[externals]/puppeteer [external] (puppeteer, esm_import, [project]/node_modules/puppeteer)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$puppeteer$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$puppeteer$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const styledWrapper = `
  <style>
    body {
      background-color: #fff;
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
    }
  </style>
`;
async function generatePdf(htmlContent, documentId, isDownload) {
    const styledHtmlContent = `${styledWrapper}${htmlContent}`;
    const browser = await __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$puppeteer$29$__["default"].launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    try {
        const page = await browser.newPage();
        await page.setContent(styledHtmlContent, {
            waitUntil: 'networkidle0',
            timeout: 10000
        });
        if (!isDownload) {
            const publicDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public');
            if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(publicDir)) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(publicDir, {
                    recursive: true
                });
            }
            const outputPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(publicDir, `termo-${documentId.replace(/[/\\?%*:|"]/g, '-')}.pdf`);
            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '10mm',
                    right: '10mm',
                    bottom: '10mm',
                    left: '10mm'
                }
            });
            return;
        }
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        });
        return Buffer.from(pdfBuffer);
    } finally{
        await browser.close();
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/lib/permissions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTION_TOKENS",
    ()=>ACTION_TOKENS,
    "FORMULARIOS_BASE",
    ()=>FORMULARIOS_BASE,
    "ROLE_ADMIN",
    ()=>ROLE_ADMIN,
    "buildAdminPermissions",
    ()=>buildAdminPermissions,
    "getProfileFromPermissions",
    ()=>getProfileFromPermissions,
    "hasActionPermission",
    ()=>hasActionPermission,
    "hasModuleAccess",
    ()=>hasModuleAccess,
    "isAdminPermissions",
    ()=>isAdminPermissions,
    "normalizePermissions",
    ()=>normalizePermissions
]);
const ROLE_ADMIN = 'ROLE_ADMIN';
const ACTION_TOKENS = {
    CREATE: 'PERM_CREATE',
    UPDATE: 'PERM_UPDATE',
    DELETE: 'PERM_DELETE',
    PRINT: 'PERM_PRINT'
};
const FORMULARIOS_BASE = [
    'DASHBOARD',
    'FUNCIONARIOS',
    'PATRIMONIO',
    'CENTRO_CUSTO',
    'MEDICAO_CCUSTO',
    'FUNCOES',
    'LICENCAS_SOFTWARE',
    'ALOCACOES',
    'ACESSO_USUARIOS',
    'IMPORTACAO_EXPORTACAO',
    'UNIFI_CONFIG'
];
function normalizePermissions(value) {
    return Array.isArray(value) ? value.map((item)=>String(item)) : [];
}
function isAdminPermissions(formularios) {
    return formularios.includes(ROLE_ADMIN);
}
function hasActionPermission(formulariosRaw, action) {
    const formularios = normalizePermissions(formulariosRaw);
    if (isAdminPermissions(formularios)) return true;
    if (action === 'DELETE' && formularios.includes('DELETE_ANY')) return true;
    const explicitToken = ACTION_TOKENS[action];
    if (formularios.includes(explicitToken)) return true;
    return false;
}
function hasModuleAccess(formulariosRaw, modulo) {
    const formularios = normalizePermissions(formulariosRaw);
    return isAdminPermissions(formularios) || formularios.includes(modulo);
}
function getProfileFromPermissions(formulariosRaw) {
    const formularios = normalizePermissions(formulariosRaw);
    return isAdminPermissions(formularios) ? 'ADMIN' : 'OPERACIONAL';
}
function buildAdminPermissions() {
    return [
        ROLE_ADMIN,
        ...FORMULARIOS_BASE,
        ...Object.values(ACTION_TOKENS),
        'DELETE_ANY'
    ];
}
}),
"[project]/src/lib/access.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAccessContext",
    ()=>getAccessContext,
    "getCentrosFiltro",
    ()=>getCentrosFiltro,
    "hasActionPermissionForRequest",
    ()=>hasActionPermissionForRequest,
    "hasDeleteAnyPermission",
    ()=>hasDeleteAnyPermission,
    "hasModuleAccessForRequest",
    ()=>hasModuleAccessForRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$jwt$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/jwt/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/permissions.ts [app-route] (ecmascript)");
;
;
async function getAccessContext(req) {
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$jwt$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getToken"])({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });
    if (!token) {
        return {
            centros: [],
            formularios: [],
            allowAll: false,
            authenticated: false
        };
    }
    const centros = Array.isArray(token.centros) ? token.centros : [];
    const formularios = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizePermissions"])(token.formularios);
    return {
        centros,
        formularios,
        allowAll: centros.includes("*"),
        authenticated: true
    };
}
async function getCentrosFiltro(req) {
    const { centros, allowAll, authenticated } = await getAccessContext(req);
    return {
        centros,
        allowAll,
        authenticated
    };
}
async function hasDeleteAnyPermission(req) {
    const { formularios, authenticated } = await getAccessContext(req);
    return authenticated && formularios.includes('DELETE_ANY');
}
async function hasActionPermissionForRequest(req, action) {
    const { formularios, authenticated } = await getAccessContext(req);
    return authenticated && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasActionPermission"])(formularios, action);
}
async function hasModuleAccessForRequest(req, moduleId) {
    const { formularios, authenticated } = await getAccessContext(req);
    return authenticated && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasModuleAccess"])(formularios, moduleId);
}
}),
"[project]/src/app/api/cadastro/termo-pdf/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$renderPdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/renderPdf.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generatePdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/generatePdf.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$access$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/access.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generatePdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generatePdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const dynamic = 'force-dynamic';
const maxDuration = 60;
async function POST(request) {
    const canAccess = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$access$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasModuleAccessForRequest"])(request, 'ALOCACOES');
    const canPrint = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$access$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasActionPermissionForRequest"])(request, 'PRINT');
    if (!canAccess || !canPrint) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        message: 'Sem permissao para gerar termo PDF'
    }, {
        status: 403
    });
    try {
        const body = await request.json();
        const { nomeFun, idMatFun, cpfFun, idPat, descricaoPat, statusAlocacao, tipoPatrimonio, marca, modelo, outrosProgramas, localData } = body;
        if (!nomeFun || !idMatFun || !idPat || descricaoPat === undefined) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Dados obrigatÃ³rios: nomeFun, idMatFun, idPat, descricaoPat'
            }, {
                status: 400
            });
        }
        const documentData = {
            nomeFun,
            idMatFun,
            cpfFun: cpfFun ?? null,
            idPat,
            descricaoPat: descricaoPat ?? '',
            ...statusAlocacao != null && {
                statusAlocacao
            },
            ...tipoPatrimonio != null && {
                tipoPatrimonio
            },
            ...marca != null && {
                marca
            },
            ...modelo != null && {
                modelo
            },
            ...outrosProgramas != null && {
                outrosProgramas
            },
            ...localData != null && {
                localData
            }
        };
        const documentId = `${idMatFun}-${idPat}`;
        const htmlContent = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$renderPdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderPdf"])(documentData);
        const pdfBuffer = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generatePdf$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generatePdf"])(htmlContent, documentId, true);
        if (!pdfBuffer) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Falha ao gerar o PDF'
            }, {
                status: 500
            });
        }
        const filename = `Termo-Responsabilidade-${documentId}.pdf`;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': String(pdfBuffer.length)
            }
        });
    } catch (error) {
        console.error('Erro ao gerar PDF do termo:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: error instanceof Error ? error.message : 'Erro ao gerar PDF'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6fb0ae5f._.js.map