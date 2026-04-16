import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { apiKey, consoleId } = await request.json();

  if (!apiKey || !consoleId) {
    return NextResponse.json({ error: 'API Key e Console ID são necessários' }, { status: 400 });
  }

  try {
    // Consultar dispositivos disponíveis
    const response = await fetch('https://api.ui.com/v1/devices', {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      console.warn('Endpoint /v1/devices falhou', { status: response.status, statusText: response.statusText });
      return NextResponse.json({ error: 'Não foi possível consultar dispositivos disponíveis' }, { status: response.status });
    }

    const data = await response.json();

    // Filtrar dispositivos pelo consoleId (que é o siteId)
    let devices = [];
    if (data.data && Array.isArray(data.data)) {
      // Encontrar o host que corresponde ao consoleId
      const hostData = data.data.find((host: any) => host.hostId === consoleId);
      if (hostData && hostData.devices) {
        devices = hostData.devices;
      }
    }

    const formattedDevices = devices.map((device: any) => ({
      id: device.id || device.mac,
      name: device.name || 'Dispositivo sem nome',
      model: device.model || 'N/A',
      status: device.status || 'unknown',
      ip: device.ip || 'N/A',
      mac: device.mac || 'N/A',
    }));

    return NextResponse.json({ sites: formattedDevices });
  } catch (error) {
    console.error('Erro ao consultar sites:', error);
    return NextResponse.json({ error: (error as Error).message || 'Erro ao consultar sites' }, { status: 500 });
  }
}
