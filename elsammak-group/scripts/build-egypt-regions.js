/**
 * Builds data/egyptRegions.json from egyptLocations.json + extra districts per governorate.
 * Run: node scripts/build-egypt-regions.js
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const oldPath = path.join(root, 'data', 'egyptLocations.json');
const outPath = path.join(root, 'data', 'egyptRegions.json');
const serverOut = path.join(root, 'server', 'data', 'egyptRegions.json');

const old = require(oldPath);

/** Additional districts / centers per governorate (English names, not translated). */
const EXTRA = {
  Cairo: [
    'Abbassia',
    'Rod El Farag',
    'Sayeda Zeinab',
    'El Mosky',
    'El Sayeda Aisha',
    'El Tebbin',
    'Bulaq',
    'El Zawya El Hamra',
    'El Salam City',
    'El Matareya',
    'El Nozha',
    'Helwan',
    '15th of May',
    'Tora',
    'Maasara',
  ],
  Giza: [
    'Saft El Laban',
    'Kerdasa',
    'Abu Rawash',
    'Baragil',
    'Nazlet El Samman',
    'Saqara',
    'Abu Nomros',
    'Hawamdiya',
    'Umm El Tagamm',
  ],
  Alexandria: [
    'Victoria',
    'Loran',
    'Bakos',
    'Seyouf',
    'Amreya',
    'King Mariout',
    'Borg El Arab',
    'Karmouz',
    'Moharam Bek',
    'Attarin',
    'El Labban',
    'El Max',
    'Abu Qir',
  ],
  Dakahlia: [
    'Mit Salsil',
    'El Manzala',
    'El Senbellawein',
    'Tama El Amdeed',
    'El Matarya',
    'Nabroh',
    'Mahalet Damana',
    'El Gamalia',
  ],
  Sharqia: [
    'Hehia',
    'El Husseiniya',
    'El Salhiya',
    'San El Hagar',
    'El Ibrahimiya',
    'Qenayat',
    'New Salhiya',
  ],
  Qalyubia: [
    'Bahtim',
    'Meet Okba',
    'El Ubour',
    'Orabi',
    'Nahda',
    'El Obour City',
  ],
  'Kafr El Sheikh': ['El Riyad', 'Sidi Ghazi', 'Brolos', 'El Hamoul'],
  Gharbia: ['Kafr El Zayat', 'El Mahalla El Kubra (Markaz)', 'Nabra'],
  Monufia: ['El Bagour', 'Tala', 'Shebin El Kom (Markaz)'],
  Beheira: [
    'Etay Baroud',
    'Abu Hummus',
    'El Delengat',
    'Wadi El Natrun',
    'Kom Hamada',
    'Badr',
    'Nubariya',
  ],
  Damietta: ['Kafr Saad', 'Ezbet El Borg', 'Zarqa', 'Ras El Bar'],
  'Port Said': ['East Port Said', 'West District'],
  Ismailia: ['Qassassin', 'Abu Sultan', 'El Tal El Kebir'],
  Suez: ['Arbaeen', 'Suez Port'],
  'North Sinai': ['El Hassana', 'Central Sinai'],
  'South Sinai': ['Nuweiba', 'Saint Catherine'],
  'Red Sea': ['Safaga Port', 'El Gouna'],
  'New Valley': ['El Kharga', 'Balat', 'Paris Oasis'],
  Matrouh: ['El Negaila', 'Salloum', 'El Alamein West'],
  Luxor: ['El Bayadiya', 'El Tod', 'Armant'],
  Aswan: ['El Sebou', 'Kalabsha', 'Kom Ombo (Markaz)'],
  Qena: ['Nagada', 'Abu Tesht', 'Farshout'],
  Sohag: ['Dar El Salam', 'Girga', 'Saqulta', 'Tama'],
  Asyut: ['Dayrout', 'Abnoub', 'Sahel Selim'],
  Minya: ['Samalout', 'Matai', 'Deir Mawas', 'Maghagha'],
  'Beni Suef': ['Nasser', 'El Wasta', 'Ihnasia'],
  Fayoum: ['Sinnuris', 'Yousef El Seddik', 'Tamiya'],
};

function uniq(arr) {
  return [...new Set(arr)];
}

const names = Object.keys(old).sort();
const regions = names.map((g) => {
  const base = old[g] || [];
  const extra = EXTRA[g] || [];
  const districts = uniq([...base, ...extra, 'Other']).sort((a, b) => a.localeCompare(b));
  return { governorate: g, districts };
});

fs.writeFileSync(outPath, JSON.stringify(regions, null, 2));
fs.writeFileSync(serverOut, JSON.stringify(regions, null, 2));
console.log('Wrote', outPath, serverOut, 'count', regions.length);
