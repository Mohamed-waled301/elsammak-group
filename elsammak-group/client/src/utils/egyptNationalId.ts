/**
 * Egyptian National ID (14 digits): century, YY, MM, DD, governorate (2), serial (3), gender (1), checksum (1).
 * Gender: 13th digit — odd = male, even = female.
 * Governorate: digits 8–9 (1-based positions 8–9).
 */

export const GOV_CODE_TO_NAME: Record<string, string> = {
  '01': 'Cairo',
  '02': 'Alexandria',
  '03': 'Port Said',
  '04': 'Suez',
  '11': 'Damietta',
  '12': 'Dakahlia',
  '13': 'Sharqia',
  '14': 'Qalyubia',
  '15': 'Kafr El Sheikh',
  '16': 'Gharbia',
  '17': 'Monufia',
  '18': 'Beheira',
  '19': 'Giza',
  '20': 'Ismailia',
  '21': 'Fayoum',
  '22': 'Beni Suef',
  '23': 'Minya',
  '24': 'Asyut',
  '25': 'Sohag',
  '26': 'Qena',
  '27': 'Aswan',
  '28': 'Luxor',
  '29': 'Red Sea',
  '31': 'New Valley',
  '32': 'Matrouh',
  '33': 'North Sinai',
  '34': 'South Sinai',
};

export type ParsedNationalId = {
  birthDateISO: string;
  gender: 'male' | 'female';
  governorateCode: string;
  governorateName: string;
  century: string;
  year: number;
  month: number;
  day: number;
};

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

export function validateEgyptianNationalId(
  nationalId: string
): { ok: true; parsed: ParsedNationalId } | { ok: false; error: string } {
  const id = String(nationalId || '').replace(/\s/g, '');
  if (!id) {
    return { ok: false, error: 'National ID is required.' };
  }
  if (!/^\d{14}$/.test(id)) {
    return { ok: false, error: 'National ID must be exactly 14 digits.' };
  }

  const centuryDigit = id[0];
  const yy = parseInt(id.slice(1, 3), 10);
  const mm = parseInt(id.slice(3, 5), 10);
  const dd = parseInt(id.slice(5, 7), 10);
  const govCode = id.slice(7, 9);

  let fullYear: number;
  if (centuryDigit === '2') {
    fullYear = 1900 + yy;
  } else if (centuryDigit === '3') {
    fullYear = 2000 + yy;
  } else {
    return {
      ok: false,
      error: 'Invalid National ID: birth century digit must be 2 (1900s) or 3 (2000s).',
    };
  }

  if (!isValidCalendarDate(fullYear, mm, dd)) {
    return { ok: false, error: 'Invalid National ID: birth date is not a valid calendar date.' };
  }

  const governorateName = GOV_CODE_TO_NAME[govCode];
  if (!governorateName) {
    return { ok: false, error: 'Invalid National ID: unknown governorate (birth place) code.' };
  }

  const genderDigit = parseInt(id[12], 10);
  const gender: 'male' | 'female' = genderDigit % 2 === 1 ? 'male' : 'female';
  const birthDateISO = `${fullYear}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;

  return {
    ok: true,
    parsed: {
      birthDateISO,
      gender,
      governorateCode: govCode,
      governorateName,
      century: centuryDigit,
      year: yy,
      month: mm,
      day: dd,
    },
  };
}
