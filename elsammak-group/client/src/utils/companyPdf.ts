import { jsPDF } from 'jspdf';

export const PDF_COLORS = {
  primary: [0, 59, 92] as [number, number, number],
  gold: [197, 160, 89] as [number, number, number],
  text: [15, 23, 42] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  line: [226, 232, 240] as [number, number, number],
  surface: [248, 250, 252] as [number, number, number],
};

export const COMPANY_NAME_EN = 'Elsamak Group';
export const COMPANY_NAME_AR = 'مجموعة السماك';

const MARGIN = 18;
const HEADER_H = 28;
const FOOTER_H = 14;
const LOGO_PATH = '/company-logo.png';

let logoDataUrlCache: string | null = null;

async function loadLogoDataUrl(): Promise<string | null> {
  if (logoDataUrlCache) return logoDataUrlCache;
  try {
    const res = await fetch(LOGO_PATH);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        logoDataUrlCache = typeof reader.result === 'string' ? reader.result : null;
        resolve(logoDataUrlCache);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export type CompanyPdfDoc = jsPDF & {
  __companyPageDecorated?: Set<number>;
};

function decoratePage(doc: CompanyPdfDoc, pageNum: number, totalPages: number, logo: string | null) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setFillColor(...PDF_COLORS.primary);
  doc.rect(0, 0, w, HEADER_H, 'F');
  doc.setFillColor(...PDF_COLORS.gold);
  doc.rect(0, HEADER_H, w, 1.2, 'F');

  if (logo) {
    try {
      doc.addImage(logo, 'PNG', MARGIN, 5, 16, 16);
    } catch {
      /* optional asset */
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(COMPANY_NAME_EN, MARGIN + (logo ? 20 : 0), 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(COMPANY_NAME_AR, MARGIN + (logo ? 20 : 0), 18);

  doc.setFontSize(7);
  doc.text('Official Document', w - MARGIN, 11, { align: 'right' });
  doc.text('وثيقة رسمية', w - MARGIN, 17, { align: 'right' });

  const footerY = h - FOOTER_H;
  doc.setDrawColor(...PDF_COLORS.line);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, footerY, w - MARGIN, footerY);

  doc.setTextColor(...PDF_COLORS.muted);
  doc.setFontSize(8);
  doc.text(
    `${COMPANY_NAME_EN} · elsamakgroup0@gmail.com · 01276691302`,
    MARGIN,
    footerY + 6
  );
  doc.text(`Page ${pageNum} of ${totalPages}`, w - MARGIN, footerY + 6, { align: 'right' });
}

export async function createCompanyPdf(options?: {
  orientation?: 'portrait' | 'landscape';
  title?: string;
}): Promise<CompanyPdfDoc> {
  const doc = new jsPDF({
    orientation: options?.orientation ?? 'portrait',
    unit: 'mm',
    format: 'a4',
  }) as CompanyPdfDoc;

  doc.__companyPageDecorated = new Set();
  const logo = await loadLogoDataUrl();

  const applyAllDecorations = () => {
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p += 1) {
      doc.setPage(p);
      decoratePage(doc, p, total, logo);
    }
  };

  doc.setFont('helvetica', 'normal');

  const contentTop = HEADER_H + 10;
  const contentBottom = doc.internal.pageSize.getHeight() - FOOTER_H - 8;

  if (options?.title) {
    doc.setTextColor(...PDF_COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(options.title, MARGIN, contentTop);
    doc.setDrawColor(...PDF_COLORS.gold);
    doc.setLineWidth(0.8);
    doc.line(MARGIN, contentTop + 4, MARGIN + 50, contentTop + 4);
  }

  (doc as CompanyPdfDoc & { finalizeCompanyPdf: () => void }).finalizeCompanyPdf = applyAllDecorations;

  Object.defineProperty(doc, 'contentTop', { value: options?.title ? contentTop + 12 : contentTop });
  Object.defineProperty(doc, 'contentBottom', { value: contentBottom });
  Object.defineProperty(doc, 'margin', { value: MARGIN });

  return doc;
}

export function finalizeCompanyPdf(doc: CompanyPdfDoc): void {
  const fin = (doc as CompanyPdfDoc & { finalizeCompanyPdf?: () => void }).finalizeCompanyPdf;
  fin?.();
}

export function pdfEnsureSpace(
  doc: CompanyPdfDoc,
  y: number,
  needed: number,
  startY?: number
): number {
  const top = (doc as CompanyPdfDoc & { contentTop?: number }).contentTop ?? HEADER_H + 10;
  const bottom = (doc as CompanyPdfDoc & { contentBottom?: number }).contentBottom ?? 270;
  const margin = (doc as CompanyPdfDoc & { margin?: number }).margin ?? MARGIN;

  if (y + needed > bottom) {
    doc.addPage();
    return startY ?? top;
  }
  return y;
}

export function pdfSectionTitle(doc: CompanyPdfDoc, title: string, y: number): number {
  const margin = (doc as CompanyPdfDoc & { margin?: number }).margin ?? MARGIN;
  y = pdfEnsureSpace(doc, y, 14);
  doc.setFillColor(...PDF_COLORS.surface);
  const w = doc.internal.pageSize.getWidth() - margin * 2;
  doc.roundedRect(margin, y - 5, w, 10, 1.5, 1.5, 'F');
  doc.setTextColor(...PDF_COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(title, margin + 4, y + 2);
  doc.setFont('helvetica', 'normal');
  return y + 12;
}

export function pdfKeyValue(
  doc: CompanyPdfDoc,
  label: string,
  value: string,
  y: number
): number {
  const margin = (doc as CompanyPdfDoc & { margin?: number }).margin ?? MARGIN;
  y = pdfEnsureSpace(doc, y, 8);
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.muted);
  doc.text(label, margin, y);
  doc.setTextColor(...PDF_COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.text(value || '—', margin + 42, y);
  doc.setFont('helvetica', 'normal');
  return y + 6;
}

export function pdfBodyLine(doc: CompanyPdfDoc, text: string, y: number): number {
  const margin = (doc as CompanyPdfDoc & { margin?: number }).margin ?? MARGIN;
  const maxW = doc.internal.pageSize.getWidth() - margin * 2;
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.text);
  const lines = doc.splitTextToSize(text, maxW);
  for (const line of lines) {
    y = pdfEnsureSpace(doc, y, 6);
    doc.text(line, margin, y);
    y += 5;
  }
  return y;
}
