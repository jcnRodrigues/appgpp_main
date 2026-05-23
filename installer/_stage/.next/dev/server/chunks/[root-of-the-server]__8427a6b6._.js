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
"[project]/src/app/api/monitor-patrimonios/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(request) {
    const { apiType = 'local', host, username, password, apiKey, consoleId, siteId = 'default', type = 'devices', offset = 0, limit = 100, filter = '' } = await request.json();
    // Usar variável de ambiente como fallback para apiKey
    const effectiveApiKey = apiKey || process.env.UNIFI_API_KEY;
    try {
        if (apiType === 'cloud') {
            // Usar API da Ubiquiti Cloud
            if (!effectiveApiKey) {
                throw new Error('API Key é necessária para a API cloud');
            }
            if (type === 'devices') {
                // Para dispositivos na cloud API, usar o endpoint /v1/devices conforme exemplo
                const currentTime = new Date().toISOString().split('T')[0] + 'T' + new Date().toISOString().split('T')[1].split('.')[0] + 'Z';
                const devicesUrl = `https://api.ui.com/v1/devices?hostIds[]&time=${currentTime}&pageSize=${limit}&nextToken=`;
                const response = await fetch(devicesUrl, {
                    headers: {
                        'Accept': 'application/json',
                        'X-API-Key': effectiveApiKey
                    }
                });
                if (!response.ok) {
                    throw new Error('Falha ao buscar dispositivos na cloud');
                }
                const data = await response.json();
                if ("TURBOPACK compile-time truthy", 1) {
                    console.log('Resposta da API cloud dispositivos:', JSON.stringify(data, null, 2));
                }
                // Ajustar para a estrutura real da resposta
                let devices = [];
                if (Array.isArray(data)) {
                    devices = data;
                } else if (data.devices && Array.isArray(data.devices)) {
                    devices = data.devices;
                } else if (data.data && Array.isArray(data.data)) {
                    devices = data.data;
                } else {
                    console.warn('Estrutura de resposta inesperada da API cloud:', Object.keys(data || {}));
                    devices = [];
                }
                if (!Array.isArray(devices)) {
                    throw new Error('Resposta da API cloud não contém um array válido de devices');
                }
                const formattedDevices = devices.map((device)=>({
                        name: device.name || device.hostname || device.displayName || 'Desconhecido',
                        ip: device.ip || device.ip_address || device.ipAddress || 'N/A',
                        mac: device.mac || device.mac_address || 'N/A',
                        model: device.model || device.product || 'N/A',
                        version: device.version || device.firmware_version || 'N/A',
                        uptime: device.uptime ? `${Math.floor(device.uptime / 86400)}d ${Math.floor(device.uptime % 86400 / 3600)}h` : 'N/A',
                        cpu: device.cpu_utilization ? `${device.cpu_utilization}%` : 'N/A',
                        memory: device.memory_utilization ? `${device.memory_utilization}%` : 'N/A',
                        status: device.connected || device.online || device.state === 1 ? 'Conectado' : 'Desconectado'
                    }));
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    devices: formattedDevices
                });
            } else if (type === 'clients') {
                // Para clientes na cloud API, usar endpoint direto
                const clientsUrl = `https://api.ui.com/v1/clients?siteId=${siteId}&offset=${offset}&limit=${limit}`;
                const response = await fetch(clientsUrl, {
                    headers: {
                        'Accept': 'application/json',
                        'X-API-Key': effectiveApiKey
                    }
                });
                if (!response.ok) {
                    // Fallback: tentar endpoint alternativo se disponível
                    console.warn('Endpoint de clientes específico do site falhou, tentando endpoint geral');
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        clients: []
                    });
                }
                const data = await response.json();
                if ("TURBOPACK compile-time truthy", 1) {
                    console.log('Resposta da API cloud clientes:', JSON.stringify(data, null, 2));
                }
                // Ajustar para a estrutura da resposta
                let clients = [];
                if (Array.isArray(data)) {
                    clients = data;
                } else if (data.clients && Array.isArray(data.clients)) {
                    clients = data.clients;
                } else if (data.data && Array.isArray(data.data)) {
                    clients = data.data;
                } else {
                    clients = [];
                }
                const formattedClients = clients.map((client)=>({
                        name: client.name || client.hostname || 'Desconhecido',
                        hostname: client.hostname || 'N/A',
                        ip: client.ip || 'N/A',
                        mac: client.mac || 'N/A',
                        device: client.ap_name || client.device_name || 'N/A',
                        signal: client.signal ? `${client.signal}dBm` : 'N/A',
                        speed: client.tx_rate && client.rx_rate ? `${client.tx_rate}/${client.rx_rate} Mbps` : 'N/A',
                        uptime: client.uptime ? `${Math.floor(client.uptime / 3600)}h ${Math.floor(client.uptime % 3600 / 60)}m` : 'N/A',
                        status: client.connected || client.online ? 'Conectado' : 'Desconectado'
                    }));
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    clients: formattedClients
                });
            }
        } else {
            // API Local (Unifi Controller)
            if (!host || !username || !password) {
                throw new Error('Host, usuário e senha são necessários para a API local');
            }
            // Fazer login na API da Unifi
            const loginResponse = await fetch(`${host}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            if (!loginResponse.ok) {
                throw new Error('Falha no login');
            }
            const cookies = loginResponse.headers.get('set-cookie');
            if (type === 'devices') {
                // Buscar dispositivos
                const devicesResponse = await fetch(`${host}/api/s/default/stat/device`, {
                    headers: {
                        Cookie: cookies || ''
                    }
                });
                if (!devicesResponse.ok) {
                    throw new Error('Falha ao buscar dispositivos');
                }
                const devicesData = await devicesResponse.json();
                const devices = devicesData.data.map((device)=>({
                        name: device.name || 'Desconhecido',
                        ip: device.ip || 'N/A',
                        mac: device.mac || 'N/A',
                        model: device.model || device.type || 'N/A',
                        version: device.version || device.firmware || 'N/A',
                        uptime: device.uptime ? `${Math.floor(device.uptime / 86400)}d ${Math.floor(device.uptime % 86400 / 3600)}h` : 'N/A',
                        cpu: device.cpu ? `${device.cpu}%` : 'N/A',
                        memory: device.mem ? `${device.mem}%` : 'N/A',
                        status: device.state === 1 ? 'Conectado' : 'Desconectado'
                    }));
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    devices
                });
            } else if (type === 'clients') {
                // Buscar clientes conectados
                const clientsResponse = await fetch(`${host}/api/s/default/stat/sta`, {
                    headers: {
                        Cookie: cookies || ''
                    }
                });
                if (!clientsResponse.ok) {
                    throw new Error('Falha ao buscar clientes');
                }
                const clientsData = await clientsResponse.json();
                const clients = clientsData.data.map((client)=>({
                        name: client.name || client.hostname || 'Desconhecido',
                        hostname: client.hostname || 'N/A',
                        ip: client.ip || 'N/A',
                        mac: client.mac || 'N/A',
                        device: client.ap_mac || client.device_name || 'N/A',
                        signal: client.signal ? `${client.signal}dBm` : 'N/A',
                        speed: client.tx_rate && client.rx_rate ? `${client.tx_rate}/${client.rx_rate} Mbps` : 'N/A',
                        uptime: client.uptime ? `${Math.floor(client.uptime / 3600)}h ${Math.floor(client.uptime % 3600 / 60)}m` : 'N/A',
                        status: client.state === 1 ? 'Conectado' : 'Desconectado'
                    }));
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    clients
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Tipo inválido'
        }, {
            status: 400
        });
    } catch (error) {
        console.error(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Erro ao monitorar'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8427a6b6._.js.map