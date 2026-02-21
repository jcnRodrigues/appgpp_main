import { buildHtml } from './termoResponsabilidadePuppeteer';
import type { DadosTermoResponsabilidade } from './termoResponsabilidadePdf';

/**
 * Gera o HTML do termo de responsabilidade a partir dos dados.
 * Usado pelo backend antes de enviar o HTML ao Puppeteer (generatePdf).
 * Não usa React nem react-dom/server, compatível com Next.js App Router.
 */
export async function renderPdf(
    documentData: DadosTermoResponsabilidade
): Promise<string> {
    return buildHtml(documentData);
}
