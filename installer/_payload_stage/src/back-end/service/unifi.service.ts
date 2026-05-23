import prisma from '../../../prisma/prisma';

export async function getUnifiConfig() {
  try {
    const config = await prisma.tbUnifiConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
    return config;
  } catch (error) {
    console.error('Erro ao buscar configuração Unifi:', error);
    return null;
  }
}

export async function saveUnifiConfig(data: {
  type: string;
  apiKey?: string;
  host?: string;
  username?: string;
  password?: string;
}) {
  try {
    const existingConfig = await prisma.tbUnifiConfig.findFirst({
      where: { isActive: true },
    });

    if (existingConfig) {
      // Atualizar configuração existente
      return await prisma.tbUnifiConfig.update({
        where: { id: existingConfig.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } else {
      // Criar nova configuração
      return await prisma.tbUnifiConfig.create({
        data: {
          ...data,
        },
      });
    }
  } catch (error) {
    console.error('Erro ao salvar configuração Unifi:', error);
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
    return configs;
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

export async function activateUnifiConfig(id: string) {
  try {
    return await prisma.$transaction(async (tx) => {
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
