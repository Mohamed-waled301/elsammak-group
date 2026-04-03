/**
 * Egyptian National ID — 14 digits, layout:
 *   C YY MM DD SS SSS G X
 *   C      = century (2 → 1900s, 3 → 2000s)
 *   YYMMDD = birth date
 *   SS     = governorate code (civil registry)
 *   SSS    = birth registration serial (not validated here)
 *   G      = gender digit (odd = male, even = female)
 *   X      = checksum (not validated)
 */

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
 * @param {string} nationalId
 * @returns {{ valid: true, data: { fullYear: number, birthDate: string, governorateCode: string, gender: 'male'|'female' } } | { valid: false, message: string }}
 */
function parseNationalID(nationalId) {
  const id = String(nationalId ?? '').replace(/\s/g, '');

  if (!/^\d{14}$/.test(id)) {
    return { valid: false, message: 'National ID must be exactly 14 digits.' };
  }

  const c = id[0];
  const yy = parseInt(id.slice(1, 3), 10);
  const month = parseInt(id.slice(3, 5), 10);
  const day = parseInt(id.slice(5, 7), 10);
  const governorateCode = id.slice(7, 9);

  if (c !== '2' && c !== '3') {
    return {
      valid: false,
      message: 'Invalid National ID: century digit must be 2 (1900s) or 3 (2000s).',
    };
  }

  const fullYear = c === '2' ? 1900 + yy : 2000 + yy;

  if (month < 1 || month > 12) {
    return { valid: false, message: 'Invalid National ID: month must be between 1 and 12.' };
  }

  if (!isValidCalendarDate(fullYear, month, day)) {
    return { valid: false, message: 'Invalid National ID: birth date is not a valid calendar date.' };
  }

  if (!GOV_CODE_TO_NAME[governorateCode]) {
    return { valid: false, message: 'Invalid National ID: unknown governorate code.' };
  }

  const genderDigit = parseInt(id[12], 10);
  const gender = genderDigit % 2 === 1 ? 'male' : 'female';
  const birthDate = `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    valid: true,
    data: {
      fullYear,
      birthDate,
      governorateCode,
      gender,
    },
  };
}

module.exports = {
  parseNationalID,
  GOV_CODE_TO_NAME,
};
