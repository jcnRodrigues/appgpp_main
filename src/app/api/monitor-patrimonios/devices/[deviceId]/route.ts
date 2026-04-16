import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { apiKey, consoleId, siteId, deviceId } = await request.json();

  // Usar variável de ambiente como fallback
  const effectiveApiKey = apiKey || process.env.UNIFI_API_KEY;

  if (!effectiveApiKey || !consoleId || !siteId || !deviceId) {
    return NextResponse.json({ error: 'API Key, Console ID, Site ID e Device ID são necessários' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.ui.com/v1/connector/consoles/${consoleId}/proxy/network/integration/v1/sites/${siteId}/devices/${deviceId}`, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': effectiveApiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar detalhes do dispositivo');
    }

    const data = await response.json();
    if (process.env.NODE_ENV === 'development') {
      console.log('Resposta da API cloud device details:', JSON.stringify(data, null, 2));
    }

    return NextResponse.json({ device: data });
  } catch (error) {
    console.error('Erro ao consultar detalhes do dispositivo:', error);
    return NextResponse.json({ error: (error as Error).message || 'Erro ao consultar detalhes do dispositivo' }, { status: 500 });
  }
}