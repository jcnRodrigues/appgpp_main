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
"[project]/src/app/api/monitor-patrimonios/sites/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
function normalizeList(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.sites)) return payload.sites;
    if (Array.isArray(payload?.hosts)) return payload.hosts;
    if (Array.isArray(payload?.devices)) return payload.devices;
    return [];
}
function getNextToken(payload) {
    if (typeof payload?.nextToken === 'string') return payload.nextToken;
    if (typeof payload?.pagination?.nextToken === 'string') return payload.pagination.nextToken;
    return '';
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
            throw new Error(`Falha ao buscar devices para sites: ${response.status}`);
        }
        const payload = await response.json();
        const list = normalizeList(payload);
        for (const item of list){
            const hostId = String(item?.hostId || '');
            if (!hostId) continue;
            const existing = groupsByHostId.get(hostId) || {
                hostId,
                hostName: String(item?.hostName || 'Site sem nome'),
                devices: []
            };
            if (Array.isArray(item?.devices)) {
                existing.devices.push(...item.devices);
            } else if (item && typeof item === 'object') {
                existing.devices.push(item);
            }
            if (!existing.hostName || existing.hostName === 'Site sem nome') {
                existing.hostName = String(item?.hostName || existing.hostName || 'Site sem nome');
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
        const sites = groups.map((group)=>({
                id: String(group.hostId || ''),
                name: String(group.hostName || 'Site sem nome'),
                description: 'Site Manager Host',
                consoleId: String(group.hostId || ''),
                consoleName: String(group.hostName || ''),
                deviceCount: Array.isArray(group.devices) ? group.devices.length : 0
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            sites
        });
    } catch (error) {
        console.error('Erro ao consultar sites:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Erro ao consultar sites'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ab1f9a9e._.js.map