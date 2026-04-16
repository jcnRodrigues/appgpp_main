import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { apiKey } = await request.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key é necessária' }, { status: 400 });
  }

  try {
    // Consultar sites disponíveis (não consoles)
    const response = await fetch('https://api.ui.com/v1/sites', {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      console.warn('Endpoint /v1/sites falhou', { status: response.status, statusText: response.statusText });
      return NextResponse.json({ error: 'Não foi possível consultar sites disponíveis' }, { status: response.status });
    }

    const data = await response.json();

    // Ajustar para a estrutura da resposta
    let sites = [];
    if (data.data && Array.isArray(data.data)) {
      sites = data.data;
    } else if (Array.isArray(data)) {
      sites = data;
    } else {
      console.warn('Estrutura de resposta de sites inesperada:', Object.keys(data || {}));
      sites = [];
    }

    const formattedConsoles = sites.map((site: any) => ({
      id: site.siteId || site.id,
      name: site.meta?.name || site.name || 'Site sem nome',
      type: site.meta?.desc || 'Site',
      status: site.statistics?.counts?.offlineDevice === 0 ? 'Online' : 'Offline',
    }));

    return NextResponse.json({ consoles: formattedConsoles });
  } catch (error) {
    console.error('Erro ao consultar consoles:', error);
    return NextResponse.json({ error: (error as Error).message || 'Erro ao consultar consoles' }, { status: 500 });
  }
}