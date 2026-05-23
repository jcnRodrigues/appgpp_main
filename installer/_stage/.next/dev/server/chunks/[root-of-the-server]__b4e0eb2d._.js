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
"[project]/src/app/api/monitor-patrimonios/consoles/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const dynamic = 'force-dynamic';
const revalidate = 0;
function normalizeText(value) {
    return String(value || '').trim();
}
function normalizeList(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.hosts)) return payload.hosts;
    if (Array.isArray(payload?.devices)) return payload.devices;
    return [];
}
function getNextToken(payload) {
    if (typeof payload?.nextToken === 'string') return payload.nextToken;
    if (typeof payload?.pagination?.nextToken === 'string') return payload.pagination.nextToken;
    return '';
}
function detectConsoleFamily(host) {
    const haystack = [
        host.model,
        host.type,
        host.consoleType,
        host.name,
        host.displayName,
        host.hostName,
        host.hostname,
        host.description
    ].map((item)=>normalizeText(item).toUpperCase()).join(' ');
    const patterns = [
        [
            /\bUCG\b|CLOUD GATEWAY/,
            'UCG'
        ],
        [
            /\bUDM\b|DREAM MACHINE/,
            'UDM'
        ],
        [
            /\bUXG\b/,
            'UXG'
        ],
        [
            /\bUSG\b/,
            'USG'
        ],
        [
            /\bUDR\b/,
            'UDR'
        ],
        [
            /\bUDW\b/,
            'UDW'
        ],
        [
            /\bUCK\b|CLOUD KEY/,
            'UCK'
        ]
    ];
    for (const [regex, family] of patterns){
        if (regex.test(haystack)) return family;
    }
    const rawType = normalizeText(host.type || host.consoleType || host.model || 'N/A').toUpperCase();
    return rawType || 'N/A';
}
async function fetchAllDeviceGroupsByApiKey(effectiveApiKey, pageSize = 100) {
    const groupsByHostId = new Map();
    let nextToken = '';
    let page = 0;
    const maxPages = 100;
    do {
        const params = new URLSearchParams({
            pageSize: String(pageSize),
            time: new Date().toISOString()
        });
        if (nextToken) {
            params.set('nextToken', nextToken);
        }
        const response = await fetch(`https://api.ui.com/v1/devices?${params.toString()}`, {
            cache: 'no-store',
            next: {
                revalidate: 0
            },
            headers: {
                Accept: 'application/json',
                'X-API-Key': effectiveApiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Falha ao buscar consoles em devices: ${response.status}`);
        }
        const payload = await response.json();
        const list = normalizeList(payload);
        for (const item of list){
            const hostId = String(item?.hostId || '');
            if (!hostId) continue;
            const existing = groupsByHostId.get(hostId) || {
                hostId,
                hostName: String(item?.hostName || ''),
                devices: []
            };
            if (Array.isArray(item?.devices)) {
                existing.devices.push(...item.devices);
            } else if (item && typeof item === 'object') {
                existing.devices.push(item);
            }
            if (!existing.hostName) {
                existing.hostName = String(item?.hostName || existing.hostName || '');
            }
            groupsByHostId.set(hostId, existing);
        }
        nextToken = getNextToken(payload);
        page += 1;
    }while (nextToken && page < maxPages)
    return Array.from(groupsByHostId.values());
}
async function POST(request) {
    const { apiKey } = await request.json();
    const effectiveApiKey = apiKey || process.env.UNIFI_API_KEY;
    if (!effectiveApiKey) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'API Key e necessaria'
        }, {
            status: 400
        });
    }
    try {
        const groups = await fetchAllDeviceGroupsByApiKey(effectiveApiKey, 100);
        const formattedConsoles = groups.map((group)=>{
            const consoleDevice = group.devices.find((device)=>device.isConsole === true) || group.devices[0] || {};
            const family = detectConsoleFamily(consoleDevice);
            const hostId = String(group.hostId || '');
            const hostName = String(group.hostName || '');
            const statusRaw = normalizeText(consoleDevice.status).toLowerCase();
            const onlineByField = consoleDevice.online === true || consoleDevice.isOnline === true;
            const status = statusRaw || (onlineByField ? 'online' : 'offline');
            return {
                id: hostId,
                hostId,
                hostName,
                name: String(consoleDevice.name || consoleDevice.displayName || hostName || 'Console sem nome'),
                type: family,
                status,
                organizationName: ''
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            consoles: formattedConsoles
        });
    } catch (error) {
        console.error('Erro ao consultar consoles:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Erro ao consultar consoles'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b4e0eb2d._.js.map