export type ActionPermission = 'CREATE' | 'UPDATE' | 'DELETE' | 'PRINT';

export const ROLE_ADMIN = 'ROLE_ADMIN';
export const ACTION_TOKENS: Record<ActionPermission, string> = {
  CREATE: 'PERM_CREATE',
  UPDATE: 'PERM_UPDATE',
  DELETE: 'PERM_DELETE',
  PRINT: 'PERM_PRINT'
};

export const MODULE_ACTIONS: Record<string, ActionPermission[]> = {
  PATRIMONIO: ['CREATE', 'UPDATE', 'DELETE', 'PRINT'],
  FUNCIONARIOS: ['CREATE', 'UPDATE', 'DELETE'],
  CENTRO_CUSTO: ['CREATE', 'UPDATE', 'DELETE'],
  FUNCOES: ['CREATE', 'UPDATE', 'DELETE'],
  LICENCAS_SOFTWARE: ['CREATE', 'UPDATE', 'DELETE'],
  ALOCACOES: ['CREATE', 'UPDATE', 'DELETE', 'PRINT'],
  ACESSO_USUARIOS: ['CREATE', 'UPDATE', 'DELETE'],
  IMPORTACAO_EXPORTACAO: ['PRINT'],
  ATIVOS_REDE: ['CREATE', 'UPDATE', 'DELETE', 'PRINT'],
  UNIFI_CONFIG: ['CREATE', 'UPDATE', 'DELETE', 'PRINT']
};

export const FORMULARIOS_BASE = [
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
  'ATIVOS_REDE',
  'UNIFI_CONFIG'
] as const;

export function normalizePermissions(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

export function isAdminPermissions(formularios: string[]): boolean {
  return formularios.includes(ROLE_ADMIN);
}

export function hasActionPermission(formulariosRaw: unknown, action: ActionPermission): boolean {
  const formularios = normalizePermissions(formulariosRaw);
  if (isAdminPermissions(formularios)) return true;
  if (action === 'DELETE' && formularios.includes('DELETE_ANY')) return true;
  const explicitToken = ACTION_TOKENS[action];
  if (formularios.includes(explicitToken)) return true;
  return false;
}

export function hasModuleAccess(formulariosRaw: unknown, modulo: string): boolean {
  const formularios = normalizePermissions(formulariosRaw);
  return isAdminPermissions(formularios) || formularios.includes(modulo);
}

export function hasModuleActionPermission(formulariosRaw: unknown, modulo: string, action: ActionPermission): boolean {
  return hasModuleAccess(formulariosRaw, modulo) && hasActionPermission(formulariosRaw, action);
}

export function getProfileFromPermissions(formulariosRaw: unknown): 'ADMIN' | 'OPERACIONAL' {
  const formularios = normalizePermissions(formulariosRaw);
  return isAdminPermissions(formularios) ? 'ADMIN' : 'OPERACIONAL';
}

export function buildAdminPermissions(): string[] {
  return [
    ROLE_ADMIN,
    ...FORMULARIOS_BASE,
    ...Object.values(ACTION_TOKENS),
    'DELETE_ANY'
  ];
}
