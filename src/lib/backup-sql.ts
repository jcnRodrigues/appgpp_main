import { execSync } from "node:child_process";
import path from "node:path";

export type BackupRow = Record<string, unknown>;
export type BackupData = Record<string, BackupRow[]>;

export type BackupTableDef = {
  key: string;
  tableName: string;
};

export const BACKUP_TABLES: BackupTableDef[] = [
  { key: "tbUser", tableName: "tbUser" },
  { key: "tbFuncionario", tableName: "tbFuncionario" },
  { key: "tbLicenca", tableName: "tbLicenca" },
  { key: "tbHasLicencaFuncionario", tableName: "has_" },
  { key: "tbStatusFun", tableName: "tbStatusFun" },
  { key: "tbFuncao", tableName: "tbFuncao" },
  { key: "tbPatrimonio", tableName: "tbPatrimonio" },
  { key: "tbTipoPat", tableName: "tbTipoPat" },
  { key: "tbStatusPat", tableName: "tbStatusPat" },
  { key: "tbEmpresa", tableName: "tbEmpresa" },
  { key: "tbStatusCCusto", tableName: "tbStatusCCusto" },
  { key: "tbCCusto", tableName: "tbCCusto" },
  { key: "tbBmMedicao", tableName: "tbBmMedicao" },
  { key: "tbInventarioProcesso", tableName: "tbInventarioProcesso" },
  { key: "tbTransferenciaCustoPatrimonio", tableName: "tbTransferenciaCustoPatrimonio" },
  { key: "tbTransferenciaProcesso", tableName: "tbTransferenciaProcesso" },
  { key: "tbCadastro", tableName: "tbCadastro" },
  { key: "tbTransferenciaAlocacao", tableName: "tbTransferenciaAlocacao" },
  { key: "tbDevolucao", tableName: "tbDevolucao" },
  { key: "tbDevolucaoProcesso", tableName: "tbDevolucaoProcesso" },
  { key: "tbAuditoriaDevolucaoPatrimonio", tableName: "tbAuditoriaDevolucaoPatrimonio" },
  { key: "tbPatrimonioHistorico", tableName: "tbPatrimonioHistorico" },
  { key: "tbAtivoRede", tableName: "tbAtivoRede" },
  { key: "tbTipoAtivoRede", tableName: "tbTipoAtivoRede" },
  { key: "tbStatusAtivoRede", tableName: "tbStatusAtivoRede" },
  { key: "tbTransferenciaAtivoRede", tableName: "tbTransferenciaAtivoRede" },
  { key: "tbDevolucaoAtivoRede", tableName: "tbDevolucaoAtivoRede" },
  { key: "Account", tableName: "Account" },
  { key: "Session", tableName: "Session" },
  { key: "User", tableName: "User" },
  { key: "VerificationToken", tableName: "VerificationTokens" },
  { key: "tbUnifiConfig", tableName: "tbUnifiConfig" }
];

const DEFAULT_ROWS_PER_INSERT = 200;
const JSON_COLUMNS = new Set([
  "formulariosUser",
  "centrosUser",
  "resumoJson",
  "resultadosJson",
  "naoInformadosJson",
  "itensJson",
  "detalhesJson"
]);

function escapeMysqlString(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\u0000/g, "\\0")
    .replace(/\u0008/g, "\\b")
    .replace(/\u0009/g, "\\t")
    .replace(/\u000a/g, "\\n")
    .replace(/\u000d/g, "\\r")
    .replace(/\u001a/g, "\\Z")
    .replace(/'/g, "''");
}

function isDateValue(value: unknown): value is Date {
  return value instanceof Date;
}

function isIsoDateString(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value);
}

function isJsonColumn(columnName: string) {
  return JSON_COLUMNS.has(columnName) || columnName.endsWith("Json");
}

function formatMysqlDate(value: Date) {
  const pad = (n: number, size = 2) => String(n).padStart(size, "0");
  return [
    value.getUTCFullYear(),
    "-",
    pad(value.getUTCMonth() + 1),
    "-",
    pad(value.getUTCDate()),
    " ",
    pad(value.getUTCHours()),
    ":",
    pad(value.getUTCMinutes()),
    ":",
    pad(value.getUTCSeconds()),
    ".",
    pad(value.getUTCMilliseconds(), 3)
  ].join("");
}

function toJsonSqlLiteral(value: unknown) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "string" && value.trim() === "") {
    return "NULL";
  }

  const jsonValue = isDateValue(value) || isIsoDateString(value) ? formatMysqlDate(new Date(String(value))) : value;
  return `'${escapeMysqlString(JSON.stringify(jsonValue))}'`;
}

function toSqlLiteral(value: unknown, columnName?: string): string {
  if (columnName && isJsonColumn(columnName)) {
    return toJsonSqlLiteral(value);
  }

  if (value === null || value === undefined) {
    return "NULL";
  }

  if (isDateValue(value)) {
    return `'${escapeMysqlString(formatMysqlDate(value))}'`;
  }

  if (isIsoDateString(value)) {
    return `'${escapeMysqlString(formatMysqlDate(new Date(String(value))))}'`;
  }

  if (Buffer.isBuffer(value)) {
    return `0x${value.toString("hex")}`;
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "NULL";
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  return `'${escapeMysqlString(String(value))}'`;
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export function generateSchemaSql() {
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  const quotedSchemaPath = `"${schemaPath.replace(/"/g, '\\"')}"`;
  const command = `npx prisma migrate diff --from-empty --to-schema-datamodel ${quotedSchemaPath} --script`;
  return execSync(command, {
    encoding: "utf8",
    env: {
      ...process.env,
      CI: "1",
      PRISMA_HIDE_UPDATE_MESSAGE: "1"
    }
  });
}

function getOrderedTables(data: BackupData) {
  const ordered: Array<[string, BackupRow[]]> = [];
  const seen = new Set<string>();

  for (const def of BACKUP_TABLES) {
    if (Object.prototype.hasOwnProperty.call(data, def.key)) {
      ordered.push([def.key, data[def.key] || []]);
      seen.add(def.key);
    }
  }

  for (const [key, rows] of Object.entries(data)) {
    if (!seen.has(key)) {
      ordered.push([key, rows || []]);
    }
  }

  return ordered;
}

function getPhysicalTableName(key: string) {
  return BACKUP_TABLES.find((entry) => entry.key === key)?.tableName ?? key;
}

export function generateMysqlBackupSql(data: BackupData, generatedAt: Date, schemaSql?: string) {
  const lines: string[] = [];
  const ddl = schemaSql ?? generateSchemaSql();

  lines.push("-- APPGPP backup SQL");
  lines.push(`-- Generated at: ${generatedAt.toISOString()}`);
  lines.push("SET NAMES utf8mb4;");
  lines.push("SET FOREIGN_KEY_CHECKS=0;");
  lines.push("");
  lines.push("-- Recreate structure");
  lines.push(`DROP TABLE IF EXISTS ${BACKUP_TABLES.map((def) => `\`${def.tableName}\``).join(", ")};`);
  lines.push("");
  lines.push(ddl.trim());
  lines.push("");
  lines.push("-- Data");

  for (const [tableKey, rows] of getOrderedTables(data)) {
    const tableName = getPhysicalTableName(tableKey);
    if (!rows.length) {
      lines.push(`-- ${tableName}: 0 rows`);
      lines.push("");
      continue;
    }

    const columns = Object.keys(rows[0] ?? {});
    const columnSql = columns.map((column) => `\`${column}\``).join(", ");
    const rowChunks = chunkArray(rows, DEFAULT_ROWS_PER_INSERT);

    for (const chunk of rowChunks) {
      const valuesSql = chunk
        .map((row) => {
          const values = columns.map((column) => toSqlLiteral(row[column], column));
          return `(${values.join(", ")})`;
        })
        .join(",\n  ");

      lines.push(`INSERT INTO \`${tableName}\` (${columnSql}) VALUES`);
      lines.push(`  ${valuesSql};`);
      lines.push("");
    }
  }

  lines.push("SET FOREIGN_KEY_CHECKS=1;");
  lines.push("");

  return lines.join("\n");
}

export function getBackupTableKeys() {
  return BACKUP_TABLES.map((entry) => entry.key);
}
