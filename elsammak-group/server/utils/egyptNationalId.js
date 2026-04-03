/**
 * Egyptian National ID (14 digits): century, YY, MM, DD, governorate code (2), serial (3), gender (1), checksum (1).
 * Gender: digit 13 (1-based) — odd = male, even = female.
 * Governorate: digits 8–9 (indices 7–8).
 */

/** Maps civil registry code → governorate key used in egyptRegions / egyptLocations (English). */
const GOV_CODE_TO_NAME = {
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

function isValidCalendarDate(year, month, day) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

/**
 * @param {string} nationalId - 14 digits
 * @returns {{ ok: true, parsed: object } | { ok: false, error: string }}
 */
function validateEgyptianNationalId(nationalId) {
  if (!nationalId || !/^\d{14}$/.test(nationalId)) {
    return { ok: false, error: 'National ID must be exactly 14 digits.' };
  }

  const centuryDigit = nationalId[0];
  const yy = parseInt(nationalId.slice(1, 3), 10);
  const mm = parseInt(nationalId.slice(3, 5), 10);
  const dd = parseInt(nationalId.slice(5, 7), 10);
  const govCode = nationalId.slice(7, 9);

  let fullYear;
  if (centuryDigit === '2') {
    fullYear = 1900 + yy;
  } else if (centuryDigit === '3') {
    fullYear = 2000 + yy;
  } else {
    return { ok: false, error: 'Invalid National ID: birth century digit must be 2 or 3.' };
  }

  if (!isValidCalendarDate(fullYear, mm, dd)) {
    return { ok: false, error: 'Invalid National ID: birth date is not a valid calendar date.' };
  }

  const governorateName = GOV_CODE_TO_NAME[govCode];
  if (!governorateName) {
    return { ok: false, error: 'Invalid National ID: unknown governorate code.' };
  }

  const genderDigit = parseInt(nationalId[12], 10);
  const gender = genderDigit % 2 === 1 ? 'male' : 'female';
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

module.exports = {
  validateEgyptianNationalId,
  GOV_CODE_TO_NAME,
};
