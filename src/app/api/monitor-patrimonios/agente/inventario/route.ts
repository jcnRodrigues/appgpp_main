import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type HostInventoryPayload = {
  hostname?: string;
  computerName?: string;
  domain?: string | null;
  usuario?: string | null;
  fabricante?: string | null;
  modelo?: string | null;
  serial?: string | null;
  sistemaOperacional?: string | null;
  versaoOS?: string | null;
  buildNumber?: string | null;
  ultimoBoot?: string | null;
  ipPrincipal?: string | null;
  adaptadores?: unknown[];
  collectedAt?: string;
};

function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '_');
}

function getInventoryDir() {
  return path.join(process.cwd(), 'data', 'host-inventory');
}

async function ensureInventoryDir() {
  await fs.mkdir(getInventoryDir(), { recursive: true });
}

function getInventoryFileName(hostname: string) {
  return `${normalizeName(hostname)}.json`;
}

async function readInventory(hostname: string) {
  const filePath = path.join(getInventoryDir(), getInventoryFileName(hostname));
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as HostInventoryPayload;
}

async function writeInventory(hostname: string, payload: HostInventoryPayload) {
  await ensureInventoryDir();
  const filePath = path.join(getInventoryDir(), getInventoryFileName(hostname));
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
  return filePath;
}

function isTokenValid(request: NextRequest) {
  const expected = String(process.env.HOST_INVENTORY_AGENT_TOKEN || '').trim();
  if (!expected) return true;
  const provided = request.headers.get('x-agent-token') || '';
  return provided === expected;
}

export async function POST(request: NextRequest) {
  try {
    if (!isTokenValid(request)) {
      return NextResponse.json({ error: 'Token invalido' }, { status: 403 });
    }

    const payload = (await request.json()) as HostInventoryPayload;
    const hostname = String(payload.hostname || payload.computerName || '').trim();
    if (!hostname) {
      return NextResponse.json({ error: 'Hostname obrigatorio' }, { status: 400 });
    }

    const filePath = await writeInventory(hostname, {
      ...payload,
      hostname,
      collectedAt: payload.collectedAt || new Date().toISOString()
    });

    return NextResponse.json({
      ok: true,
      filePath
    });
  } catch (error) {
    console.error('Erro ao salvar inventario do host:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erro ao salvar inventario' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const hostname = new URL(request.url).searchParams.get('hostname') || '';
    if (!hostname.trim()) {
      return NextResponse.json({ error: 'Hostname obrigatorio' }, { status: 400 });
    }

    const payload = await readInventory(hostname);
    return NextResponse.json({ data: payload });
  } catch {
    return NextResponse.json({ data: null });
  }
}
