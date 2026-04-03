/**
 * Single source of truth: server/data/egyptRegions.json
 * Merges legacy client/src/data/egypt_locations.json (mapped governorate names),
 * dedupes by normalized label, writes both files.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const serverPath = path.join(root, 'server', 'data', 'egyptRegions.json');
const clientPath = path.join(root, 'client', 'src', 'data', 'egypt_locations.json');

const CLIENT_GOV_TO_SERVER = {
  Menofia: 'Monufia',
  Assiut: 'Asyut',
  Sharkia: 'Sharqia',
};

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function sortDistricts(list) {
  const other = [];
  const rest = [];
  for (const d of list) {
    if (norm(d) === 'other') other.push(d);
    else rest.push(d);
  }
  rest.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  return [...rest, ...other];
}

function mergeRegions(serverRows, clientRecord) {
  const byGov = new Map();
  for (const row of serverRows) {
    if (!row.governorate || !Array.isArray(row.districts)) continue;
    const seen = new Map();
    for (const d of row.districts) {
      const n = norm(d);
      if (!n) continue;
      if (!seen.has(n)) seen.set(n, d);
    }
    byGov.set(row.governorate, seen);
  }

  for (const [clientGov, districts] of Object.entries(clientRecord)) {
    if (!Array.isArray(districts)) continue;
    const serverGov = CLIENT_GOV_TO_SERVER[clientGov] || clientGov;
    if (!byGov.has(serverGov)) {
      byGov.set(serverGov, new Map());
    }
    const seen = byGov.get(serverGov);
    for (const d of districts) {
      const n = norm(d);
      if (!n) continue;
      if (!seen.has(n)) seen.set(n, d);
    }
  }

  const out = [];
  for (const [governorate, seen] of byGov.entries()) {
    out.push({
      governorate,
      districts: sortDistricts([...seen.values()]),
    });
  }
  out.sort((a, b) => a.governorate.localeCompare(b.governorate, 'en'));
  return out;
}

function regionsToClientRecord(rows) {
  const o = {};
  for (const row of rows) {
    o[row.governorate] = row.districts;
  }
  return o;
}

const serverRows = JSON.parse(fs.readFileSync(serverPath, 'utf8'));
const clientLegacy = JSON.parse(fs.readFileSync(clientPath, 'utf8'));
const merged = mergeRegions(serverRows, clientLegacy);

fs.writeFileSync(serverPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
fs.writeFileSync(clientPath, JSON.stringify(regionsToClientRecord(merged), null, 2) + '\n', 'utf8');

console.log('Synced', merged.length, 'governorates to server and client.');
