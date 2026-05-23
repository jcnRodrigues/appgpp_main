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
"[project]/src/app/api/monitor-patrimonios/clients/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
    if (Array.isArray(payload?.clients)) return payload.clients;
    if (Array.isArray(payload?.devices)) return payload.devices;
    if (Array.isArray(payload?.hosts)) return payload.hosts;
    return [];
}
function getNextToken(payload) {
    if (typeof payload?.nextToken === 'string') return payload.nextToken;
    if (typeof payload?.pagination?.nextToken === 'string') return payload.pagination.nextToken;
    return '';
}
async function fetchAllHostGroupsByDevicesApi(effectiveApiKey, pageSize = 100) {
    const mapByHostId = new Map();
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
            throw new Error(`Falha ao buscar hosts por devices: ${response.status}`);
        }
        const payload = await response.json();
        const list = normalizeList(payload);
        for (const item of list){
            const hostId = String(item.hostId || '');
            if (!hostId) continue;
            const existing = mapByHostId.get(hostId);
            if (existing) {
                if (!existing.hostName || existing.hostName === 'Site sem nome') {
                    existing.hostName = String(item.hostName || existing.hostName || 'Site sem nome');
                    mapByHostId.set(hostId, existing);
                }
                continue;
            }
            mapByHostId.set(hostId, {
                hostId,
                hostName: String(item.hostName || 'Site sem nome')
            });
        }
        nextToken = getNextToken(payload);
        page += 1;
    }while (nextToken && page < maxPages)
    return Array.from(mapByHostId.values());
}
async function fetchConnectorPath(apiKey, consoleId, path) {
    const response = await fetch(`https://api.ui.com/v1/connector/consoles/${consoleId}/${path}`, {
        cache: 'no-store',
        next: {
            revalidate: 0
        },
        headers: {
            Accept: 'application/json',
            'X-API-Key': apiKey
        }
    });
    if (!response.ok) return null;
    const payload = await response.json().catch(()=>null);
    if (!payload) return null;
    const list = normalizeList(payload);
    return list.length > 0 ? list : null;
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
        const hosts = await fetchAllHostGroupsByDevicesApi(effectiveApiKey, 100);
        const sites = hosts.map((host)=>({
                id: String(host.hostId || ''),
                name: String(host.hostName || 'Site sem nome'),
                consoleId: String(host.hostId || '')
            }));
        const results = await Promise.all(sites.map(async (site)=>{
            if (!site.consoleId) return [];
            const candidatePaths = [
                `sites/${site.id}/network/default/client`,
                `sites/${site.id}/network/default/clients`,
                'network/default/client',
                'network/default/clients'
            ];
            let clients = null;
            for (const path of candidatePaths){
                try {
                    const list = await fetchConnectorPath(effectiveApiKey, site.consoleId, path);
                    if (list) {
                        clients = list;
                        break;
                    }
                } catch  {
                // tenta proximo path
                }
            }
            if (!clients) return [];
            return clients.map((client, idx)=>({
                    id: String(client.id || client.clientId || client._id || client.mac || `${site.id}-${idx}`),
                    name: String(client.name || client.hostname || client.displayName || 'Cliente sem nome'),
                    mac: String(client.mac || client.macAddress || ''),
                    ip: String(client.ip || client.ipAddress || ''),
                    status: client.status ? String(client.status) : client.online === true || Number(client.state) === 1 ? 'Online' : 'Offline',
                    siteId: site.id,
                    siteName: site.name
                }));
        }));
        const dedupe = new Map();
        for (const client of results.flat()){
            const key = `${client.id}::${client.mac}`;
            if (!dedupe.has(key)) dedupe.set(key, client);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            clients: Array.from(dedupe.values())
        });
    } catch (error) {
        console.error('Erro ao consultar clients:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            clients: []
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6153a631._.js.map