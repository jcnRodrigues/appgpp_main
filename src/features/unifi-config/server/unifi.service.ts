import prisma from '../../../../prisma/prisma';
import crypto from 'crypto';
import { decryptUnifiSecret, encryptUnifiSecret } from '@/lib/unifi-secrets';

function mapConfigWithDecryptedSecrets<T extends { apiKey?: string | null; password?: string | null }>(config: T | null) {
  if (!config) return null;
  return {
    ...config,
    apiKey: decryptUnifiSecret(config.apiKey),
    password: decryptUnifiSecret(config.password),
  };
}

export async function getUnifiConfig() {
  try {
    const config = await prisma.tbUnifiConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
    return mapConfigWithDecryptedSecrets(config as any);
  } catch (error) {
    console.error('Erro ao buscar configuração Unifi:', error);
    return null;
  }
}

export async function saveUnifiConfig(data: {
  type: string;
  apiKey?: string;
  host?: string;
  publicUrl?: string;
  username?: string;
  password?: string;
}) {
  try {
    const safeData: Record<string, any> = {
      ...data,
      apiKey: typeof data.apiKey === 'string' ? encryptUnifiSecret(data.apiKey) : data.apiKey,
      password: typeof data.password === 'string' ? encryptUnifiSecret(data.password) : data.password,
    };

    const existingConfig = await prisma.tbUnifiConfig.findFirst({
      where: { isActive: true },
    });

    if (existingConfig) {
      // Atualizar configuração existente
      return await prisma.tbUnifiConfig.update({
        where: { id: existingConfig.id },
        data: {
          ...safeData,
          updatedAt: new Date(),
        } as any,
      });
    } else {
      // Criar nova configuração
      return await prisma.tbUnifiConfig.create({
        data: {
          ...safeData,
        } as any,
      });
    }
  } catch (error) {
    console.error('Erro ao salvar configuração Unifi:', error);
    throw error;
  }
}

export async function getSystemConfig() {
  try {
    const rows = await prisma.$queryRaw<Array<{
      id: string;
      publicUrl: string | null;
      identitySource: string | null;
      identitySourceNotes: string | null;
      type: string;
      apiKey: string | null;
      host: string | null;
      username: string | null;
      password: string | null;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>>`
      SELECT
        id,
        publicUrl,
        identitySource,
        identitySourceNotes,
        type,
        apiKey,
        host,
        username,
        password,
        isActive,
        createdAt,
        updatedAt
      FROM tbUnifiConfig
      WHERE isActive = 1
      ORDER BY updatedAt DESC
      LIMIT 1
    `;

    const config = rows[0] || null;
    return mapConfigWithDecryptedSecrets(config as any);
  } catch (error) {
    console.error('Erro ao buscar configuração do sistema:', error);
    return null;
  }
}

export async function saveSystemConfig(data: {
  publicUrl?: string;
  identitySource?: string;
  identitySourceNotes?: string;
}) {
  try {
    const existingConfig = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM tbUnifiConfig
      WHERE isActive = 1
      ORDER BY updatedAt DESC
      LIMIT 1
    `;

    const publicUrl = data.publicUrl ?? null;
    const identitySource = data.identitySource || 'UNIFI';
    const identitySourceNotes = data.identitySourceNotes ?? null;

    if (existingConfig[0]?.id) {
      await prisma.$executeRaw`
        UPDATE tbUnifiConfig
        SET publicUrl = ${publicUrl},
            identitySource = ${identitySource},
            identitySourceNotes = ${identitySourceNotes},
            updatedAt = NOW()
        WHERE id = ${existingConfig[0].id}
      `;

      const updated = await prisma.$queryRaw<Array<{
        id: string;
        publicUrl: string | null;
        identitySource: string | null;
        identitySourceNotes: string | null;
        type: string;
        apiKey: string | null;
        host: string | null;
        username: string | null;
        password: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      }>>`
        SELECT
          id,
          publicUrl,
          identitySource,
          identitySourceNotes,
          type,
          apiKey,
          host,
          username,
          password,
          isActive,
          createdAt,
          updatedAt
        FROM tbUnifiConfig
        WHERE id = ${existingConfig[0].id}
        LIMIT 1
      `;

      return mapConfigWithDecryptedSecrets(updated[0] as any);
    }

    const newId = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO tbUnifiConfig (
        id,
        type,
        publicUrl,
        identitySource,
        identitySourceNotes,
        isActive,
        createdAt,
        updatedAt
      ) VALUES (
        ${newId},
        ${'cloud'},
        ${publicUrl},
        ${identitySource},
        ${identitySourceNotes},
        ${true},
        ${new Date()},
        ${new Date()}
      )
    `;

    const created = await prisma.$queryRaw<Array<{
      id: string;
      publicUrl: string | null;
      identitySource: string | null;
      identitySourceNotes: string | null;
      type: string;
      apiKey: string | null;
      host: string | null;
      username: string | null;
      password: string | null;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>>`
      SELECT
        id,
        publicUrl,
        identitySource,
        identitySourceNotes,
        type,
        apiKey,
        host,
        username,
        password,
        isActive,
        createdAt,
        updatedAt
      FROM tbUnifiConfig
      WHERE id = ${newId}
      LIMIT 1
    `;

    return mapConfigWithDecryptedSecrets(created[0] as any);
  } catch (error) {
    console.error('Erro ao salvar configuração do sistema:', error);
    throw error;
  }
}

export async function deleteUnifiConfig() {
  try {
    return await prisma.tbUnifiConfig.deleteMany({
      where: { isActive: true },
    });
  } catch (error) {
    console.error('Erro ao deletar configuração Unifi:', error);
    throw error;
  }
}

export async function getAllUnifiConfigs() {
  try {
    const configs = await prisma.tbUnifiConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return configs.map((config: any) => mapConfigWithDecryptedSecrets(config as any));
  } catch (error) {
    console.error('Erro ao buscar configurações Unifi:', error);
    return [];
  }
}

export async function deactivateUnifiConfig(id: string) {
  try {
    return await prisma.tbUnifiConfig.update({
      where: { id },
      data: { isActive: false, updatedAt: new Date() },
    });
  } catch (error) {
    console.error('Erro ao desativar configuração Unifi:', error);
    throw error;
  }
}

export async function updateUnifiPublicUrl(publicUrl?: string) {
  try {
    const existingConfig = await prisma.tbUnifiConfig.findFirst({
      where: { isActive: true },
    });

    if (existingConfig) {
      return await prisma.tbUnifiConfig.update({
        where: { id: existingConfig.id },
        data: {
          publicUrl: publicUrl || null,
          updatedAt: new Date(),
        } as any,
      });
    }

    return await prisma.tbUnifiConfig.create({
      data: {
        type: 'cloud',
        publicUrl: publicUrl || null,
      } as any,
    });
  } catch (error) {
    console.error('Erro ao atualizar URL publica Unifi:', error);
    throw error;
  }
}

export async function activateUnifiConfig(id: string) {
  try {
    return await prisma.$transaction(async (tx: any) => {
      await tx.tbUnifiConfig.updateMany({
        where: { isActive: true },
        data: { isActive: false, updatedAt: new Date() },
      });

      return tx.tbUnifiConfig.update({
        where: { id },
        data: { isActive: true, updatedAt: new Date() },
      });
    });
  } catch (error) {
    console.error('Erro ao ativar configuração Unifi:', error);
    throw error;
  }
}
