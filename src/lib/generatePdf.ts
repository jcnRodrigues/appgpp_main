import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const styledWrapper = `
  <style>
    body {
      background-color: #fff;
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
    }
  </style>
`;

/**
 * Gera PDF a partir do HTML usando Puppeteer.
 * @param htmlContent - HTML completo do documento (ex.: retorno de renderPdf).
 * @param documentId - Identificador do documento (usado no nome do arquivo se isDownload = false).
 * @param isDownload - Se true, retorna o buffer do PDF; se false, salva em public/ e retorna void.
 */
export async function generatePdf(
    htmlContent: string,
    documentId: string,
    isDownload: boolean
): Promise<Buffer | void> {
    const styledHtmlContent = `${styledWrapper}${htmlContent}`;

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();
        await page.setContent(styledHtmlContent, {
            waitUntil: 'networkidle0',
            timeout: 10000,
        });

        if (!isDownload) {
            const publicDir = path.join(process.cwd(), 'public');
            if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
            }
            const outputPath = path.join(
                publicDir,
                `termo-${documentId.replace(/[/\\?%*:|"]/g, '-')}.pdf`
            );
            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
            });
            return;
        }

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
        });
        return Buffer.from(pdfBuffer);
    } finally {
        await browser.close();
    }
}
