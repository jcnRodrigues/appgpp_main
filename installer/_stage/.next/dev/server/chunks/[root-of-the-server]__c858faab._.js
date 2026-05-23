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
"[project]/src/app/api/monitor-patrimonios/devices/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
        const devicesResponse = await fetch(`https://api.ui.com/v1/devices?${params.toString()}`, {
            cache: 'no-store',
            next: {
                revalidate: 0
            },
            headers: {
                Accept: 'application/json',
                'X-API-Key': effectiveApiKey
            }
        });
        if (!devicesResponse.ok) {
            throw new Error(`Falha ao buscar devices: ${devicesResponse.status}`);
        }
        const devicesPayload = await devicesResponse.json();
        const list = normalizeList(devicesPayload);
        for (const item of list){
            const hostId = String(item?.hostId || '');
            if (!hostId) continue;
            const existing = groupsByHostId.get(hostId) || {
                hostId,
                hostName: String(item?.hostName || 'Site sem nome'),
                devices: [],
                updatedAt: item?.updatedAt ? String(item.updatedAt) : undefined
            };
            if (Array.isArray(item?.devices)) {
                existing.devices.push(...item.devices);
            } else if (item && typeof item === 'object') {
                existing.devices.push(item);
            }
            if (!existing.hostName || existing.hostName === 'Site sem nome') {
                existing.hostName = String(item?.hostName || existing.hostName || 'Site sem nome');
            }
            if (item?.updatedAt) {
                existing.updatedAt = String(item.updatedAt);
            }
            groupsByHostId.set(hostId, existing);
        }
        nextToken = getNextToken(devicesPayload);
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
        const devicesOrdenados = groups.flatMap((group)=>(Array.isArray(group.devices) ? group.devices : []).map((device, idx)=>({
                    id: String(device.id || device.deviceId || device.mac || `${group.hostId}-${idx}`),
                    name: String(device.name || device.displayName || 'Device sem nome'),
                    type: String(device.type || device.deviceType || device.model || 'Unknown'),
                    mac: String(device.mac || device.macAddress || ''),
                    ip: String(device.ip || device.ipAddress || device.host || ''),
                    shortname: String(device.shortname || device.shortName || ''),
                    productLine: String(device.productLine || device.platform || ''),
                    status: device.status ? String(device.status) : device.online === true || device.isOnline === true || Number(device.state) === 1 ? 'Online' : 'Offline',
                    siteId: String(group.hostId || ''),
                    siteName: String(group.hostName || 'Site sem nome'),
                    model: String(device.model || device.deviceModel || ''),
                    firmware: String(device.version || device.firmwareVersion || ''),
                    firmwareStatus: String(device.firmwareStatus || ''),
                    updateAvailable: String(device.updateAvailable || ''),
                    isConsole: Boolean(device.isConsole),
                    isManaged: Boolean(device.isManaged),
                    startupTime: String(device.startupTime || ''),
                    adoptionTime: String(device.adoptionTime || ''),
                    note: String(device.note || ''),
                    lastUpdatedAt: String(group.updatedAt || '')
                }))).sort((a, b)=>new Date(b.lastUpdatedAt || b.startupTime || 0).getTime() - new Date(a.lastUpdatedAt || a.startupTime || 0).getTime());
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            devices: devicesOrdenados
        });
    } catch (error) {
        console.error('Erro ao consultar devices:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Erro ao consultar devices'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c858faab._.js.map