import { adminApiFetch } from './adminFetch';
import {
  createCompanyPdf,
  finalizeCompanyPdf,
  pdfBodyLine,
  pdfEnsureSpace,
  pdfKeyValue,
  pdfSectionTitle,
  type CompanyPdfDoc,
} from '../utils/companyPdf';
import { COURSE_LABELS } from '../config/trainingCourseLabels';

export type AdminClientDetailPayload = {
  user: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
    phone?: string;
    nationalId?: string;
    governorate?: string;
    city?: string;
    emailVerified?: boolean;
    role?: string;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
  trainings?: Array<Record<string, unknown>>;
  consultations?: Array<Record<string, unknown>>;
  qrCode?: string | null;
  qrValue?: string | null;
};

export async function fetchClientDetails(
  id: string
): Promise<{ success: boolean; data: AdminClientDetailPayload | null }> {
  const res = await adminApiFetch(`/clients/${encodeURIComponent(id)}`);
  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    data?: AdminClientDetailPayload;
    message?: string;
  };
  if (!res.ok || !json.data) {
    return { success: false, data: null };
  }
  return { success: true, data: json.data };
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function downloadClientJsonPayload(data: AdminClientDetailPayload, id: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  triggerBlobDownload(blob, `client_${id}.json`);
}

function courseLabel(courseId: string): string {
  const labels = COURSE_LABELS[courseId];
  return labels ? `${labels.en} / ${labels.ar}` : courseId;
}

function attendanceLabel(mode: string): string {
  if (mode === 'remote') return 'Remote (Online) / عن بُعد (أونلاين)';
  if (mode === 'physical') return 'In-person / حضوري';
  return mode || '—';
}

export async function buildClientPdfBlob(data: AdminClientDetailPayload): Promise<Blob> {
  const doc = await createCompanyPdf({ title: 'Client Record' });
  const top = (doc as CompanyPdfDoc & { contentTop?: number }).contentTop ?? 46;

  let y = top;
  const u = data.user;

  y = pdfSectionTitle(doc, 'Client Information', y);
  y = pdfKeyValue(doc, 'Name', u.name || '-', y);
  y = pdfKeyValue(doc, 'Email', u.email || '-', y);
  y = pdfKeyValue(doc, 'Phone', u.phone || '-', y);
  y = pdfKeyValue(doc, 'National ID', u.nationalId || '-', y);
  y = pdfKeyValue(doc, 'Governorate', u.governorate || '-', y);
  y = pdfKeyValue(doc, 'City', u.city || '-', y);
  y = pdfKeyValue(doc, 'Email verified', u.emailVerified ? 'Yes' : 'No', y);
  y = pdfKeyValue(
    doc,
    'Registered',
    u.createdAt ? new Date(u.createdAt).toLocaleString() : '-',
    y
  );

  y = pdfSectionTitle(doc, `Training Bookings (${data.trainings?.length ?? 0})`, y + 4);
  if (!data.trainings?.length) {
    y = pdfBodyLine(doc, 'No training bookings on record.', y);
  } else {
    for (const t of data.trainings.slice(0, 20)) {
      y = pdfEnsureSpace(doc, y, 20, top);
      const course = courseLabel(String(t.course ?? '-'));
      const mode = attendanceLabel(String(t.attendanceMode ?? ''));
      const when = String(t.bookingDate ?? '-');
      y = pdfBodyLine(doc, `• ${course}`, y);
      y = pdfBodyLine(doc, `  Attendance: ${mode}`, y);
      y = pdfBodyLine(doc, `  Preferred date: ${when}`, y);
      y += 2;
    }
  }

  y = pdfSectionTitle(doc, `Consultations (${data.consultations?.length ?? 0})`, y + 4);
  if (!data.consultations?.length) {
    y = pdfBodyLine(doc, 'No consultations on record.', y);
  } else {
    for (const c of data.consultations.slice(0, 15)) {
      y = pdfEnsureSpace(doc, y, 8, top);
      const svc = String(c.serviceType ?? '-');
      const when = c.createdAt ? new Date(String(c.createdAt)).toISOString().slice(0, 10) : '-';
      y = pdfBodyLine(doc, `• ${svc} — ${when}`, y);
    }
  }

  if (data.qrValue) {
    y = pdfSectionTitle(doc, 'QR Reference', y + 4);
    y = pdfBodyLine(doc, String(data.qrValue), y);
  }

  finalizeCompanyPdf(doc);
  return doc.output('blob');
}

export async function downloadClientPDF(id: string) {
  const res = await fetchClientDetails(id);
  if (!res.data) throw new Error('Client not found');
  return buildClientPdfBlob(res.data);
}

export async function downloadAllClientsCsv(): Promise<void> {
  const res = await adminApiFetch('/clients/export/csv');
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Export failed (${res.status})`);
  }
  const blob = await res.blob();
  const cd = res.headers.get('Content-Disposition');
  let filename = `clients_${new Date().toISOString().slice(0, 10)}.csv`;
  if (cd) {
    const m = /filename="?([^";]+)"?/i.exec(cd);
    if (m?.[1]) filename = m[1];
  }
  triggerBlobDownload(blob, filename);
}

type ListRow = {
  name: string;
  email: string;
  phone: string | null;
  createdAt: string | null;
  trainingsCount: number;
  consultationsCount: number;
};

export async function downloadClientsListPdf(rows: ListRow[], title: string): Promise<Blob> {
  const doc = await createCompanyPdf({ orientation: 'landscape', title });
  const top = (doc as CompanyPdfDoc & { contentTop?: number }).contentTop ?? 46;
  const margin = (doc as CompanyPdfDoc & { margin?: number }).margin ?? 18;

  let y = top + 4;
  const colX = [margin, margin + 52, margin + 110, margin + 148, margin + 178, margin + 208];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const headers = ['Name', 'Email', 'Phone', 'Registered', 'Trainings', 'Consultations'];
  headers.forEach((h, i) => doc.text(h, colX[i], y));
  y += 6;
  doc.setFont('helvetica', 'normal');

  for (const r of rows) {
    y = pdfEnsureSpace(doc, y, 6, top + 10);
    const reg = r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : '-';
    const cells = [
      (r.name || '-').slice(0, 24),
      (r.email || '-').slice(0, 28),
      (r.phone || '-').slice(0, 14),
      reg,
      String(r.trainingsCount),
      String(r.consultationsCount),
    ];
    cells.forEach((cell, i) => doc.text(cell, colX[i], y));
    y += 5;
  }

  if (!rows.length) {
    pdfBodyLine(doc, 'No clients match the current filter.', y);
  }

  finalizeCompanyPdf(doc);
  return doc.output('blob');
}

export async function updateAdminProfile(_payload: { name?: string; email?: string; password?: string }) {
  return { success: false, message: 'Admin profile settings are not available.' };
}
