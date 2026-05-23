import prisma from "./prisma";

async function main() {

    const tbUserPrisma = await prisma.tbUser.create({
        data: {
            idUser: "51995",
            nomeUser: "rodrigo.silva",
            emailUser: "rodrigo.silva@parex.com.br",
            senhaUser: "123456",
            
            },
    })

    console.log('Dados inseridos com sucesso')
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
} )