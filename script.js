const idToProvinsi = {
  "aceh": "Aceh",
  "sumatera-utara": "Sumatera Utara",
  "sumatera-barat": "Sumatera Barat",
  "riau": "Riau",
  "jambi": "Jambi",
  "sumatera-selatan": "Sumatera Selatan",
  "bengkulu": "Bengkulu",
  "lampung": "Lampung",
  "kepulauan-bangka-belitung": "Kepulauan Bangka Belitung",
  "kepulauan-riau": "Kepulauan Riau",
  "dki-jakarta": "DKI Jakarta",
  "jawa-barat": "Jawa Barat",
  "jawa-tengah": "Jawa Tengah",
  "di-yogyakarta": "DI Yogyakarta",
  "jawa-timur": "Jawa Timur",
  "banten": "Banten",
  "bali": "Bali",
  "nusa-tenggara-barat": "Nusa Tenggara Barat",
  "nusa-tenggara-timur": "Nusa Tenggara Timur",
  "kalimantan-barat": "Kalimantan Barat",
  "kalimantan-tengah": "Kalimantan Tengah",
  "kalimantan-selatan": "Kalimantan Selatan",
  "kalimantan-timur": "Kalimantan Timur",
  "kalimantan-utara": "Kalimantan Utara",
  "sulawesi-utara": "Sulawesi Utara",
  "sulawesi-tengah": "Sulawesi Tengah",
  "sulawesi-selatan": "Sulawesi Selatan",
  "sulawesi-tenggara": "Sulawesi Tenggara",
  "gorontalo": "Gorontalo",
  "sulawesi-barat": "Sulawesi Barat",
  "maluku": "Maluku",
  "maluku-utara": "Maluku Utara",
  "papua-barat": "Papua Barat",
  "papua-barat-daya": "Papua Barat Daya",
  "papua": "Papua",
  "papua-pegunungan": "Papua Pegunungan",
  "papua-selatan": "Papua Selatan (Merauke)",
  "papua-tengah": "Papua Tengah"
};

const sheetURL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRHsOABP-IAmmdTdKr6Zs2Bv623SotQg3HNiHw4vMnnIDiP-0UDQWArUpgihfQDgLynL_2qr8_CEnvI/pub?output=csv';

const dataMap = new Map();

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// async function initializeApp() {
//   try {
//         const urlWithTs = `${sheetURL}&_=${Date.now()}`;
//     // const csvText = await fetchText(urlWithTs);
//     const csvText = await fetchText(sheetURL);
//     const { header, rows } = parseCSV(csvText);
async function initializeApp() {
  try {
    const urlWithTs = `${sheetURL}&_=${Date.now()}`;  
    const csvText = await fetchText(urlWithTs);       // <-- diubah di sini
    const { header, rows } = parseCSV(csvText);
    buildDataMap(header, rows);

    const totalRow = rows[rows.length - 1];
    updateSummaryCards(totalRow);
    populateDataTable(rows);
    // Ambil 6 baris pertama
const displayedRows       = rows.slice(0, 6);
// Kolom ke-1 (`cols[1]`) adalah nama Provinsi
const displayedProvinsis   = displayedRows.map(cols => cols[1]);


 await loadSVGMap('map.html');
          reorderLabels();     // <-- pastikan teks nama di atas shapes
          expandHitboxes();    // <-- area hover seluas bounding box
          +  attachHoverEvents(displayedProvinsis);

        //   attachHoverEvents();  nanti kalau butuh semua
          setupToggleButtons();

  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Utility to fetch text from a URL
async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return response.text();
}

// Parse CSV into header and row arrays
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const header = lines.shift().split(',').map(h => h.trim());
  const rows = lines.map(line => line.split(',').map(cell => cell.trim()));
  return { header, rows };
}

// Build dataMap from parsed CSV
function buildDataMap(header, rows) {
  rows.forEach(cols => {
    const entry = {};
    header.forEach((key, i) => {
      entry[key] = cols[i] || '';
    });
    if (entry['Provinsi']) {
      dataMap.set(entry['Provinsi'], entry);
    }
  });
}

// Update the summary cards at top
function updateSummaryCards(cols) {
  const ids = [
    'card-kontrak-sid',
    'card-target-konstruksi',
    'card-sid-tersedia',
    'card-kontrak-konstruksi',
    'card-realisasi-fisik'
  ];
  const values = cols.slice(3, 8);

  ids.forEach((id, idx) => {
    const card = document.getElementById(id);
    if (!card) return;
    const valueElem = card.querySelector('p:nth-child(2)');
    valueElem.textContent = (values[idx] || '0') + ' Ha';
  });
}

// Populate HTML table with data
// function populateDataTable(rows) {
//   const tbody = document.getElementById('data-table-body');
//   tbody.innerHTML = '';

//   rows.forEach(cols => {
//     if (cols.length < 8) return;
//     const tr = document.createElement('tr');
//     cols.forEach(cell => {
//       const td = document.createElement('td');
//       td.textContent = cell;
//       td.className = 'px-3 py-2 text-sm text-gray-700';
//       tr.appendChild(td);
//     });
//     tbody.appendChild(tr);
//   });
// }

// Ambil hanya 6 baris pertama
function populateDataTable(rows) {
  const tbody = document.getElementById('data-table-body');
  tbody.innerHTML = '';

  // Hanya render 6 baris pertama
  rows.slice(0, 21).forEach(cols => {
    if (cols.length < 8) return;
    const tr = document.createElement('tr');
    cols.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      td.className = 'px-3 py-2 text-sm text-gray-700';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}



// Load SVG map into DOM
async function loadSVGMap(path) {
  try {
    const svgContent = await fetchText(path);
    document.getElementById('svg-map-container').innerHTML = svgContent;
  } catch (err) {
    console.error('Failed to load SVG map:', err);
  }
}

 // Move <text> elements to end of each group
      function reorderLabels() {
        document.querySelectorAll('#svg-map-container g.province').forEach(g => {
          g.querySelectorAll('text').forEach(txt => {
            g.appendChild(txt);
          });
        });
      }

      function expandHitboxes() {
        const svgNS = 'http://www.w3.org/2000/svg';
        document.querySelectorAll('#svg-map-container g.province').forEach(g => {
          const { x, y, width, height } = g.getBBox();
          const rect = document.createElementNS(svgNS, 'rect');
          rect.setAttribute('x', x);
          rect.setAttribute('y', y);
          rect.setAttribute('width', width);
          rect.setAttribute('height', height);
          rect.setAttribute('fill', 'transparent');
          g.insertBefore(rect, g.firstChild);
        });
      }


// Attach hover events to map provinces semua provinsi
function attachHoverEvents() {
  const container = document.getElementById('svg-map-container');
  container.querySelectorAll('g.province').forEach(group => {
    // Cari nama provinsi (fallback ke ID jika tidak ada di idToProvinsi)
    const provKey  = group.id;
    const provName = idToProvinsi[provKey] || provKey;

    group.addEventListener('mouseenter', e => {
      const data = dataMap.get(provName) || null;
      showHoverCard(provName, data, e);
    });
    group.addEventListener('mouseleave', hideHoverCard);
  });
}

// /**
//  * @param {string[]} allowedProvinsis  // hanya yang ada di tabel
//  */
// function attachHoverEvents(allowedProvinsis) {
//   const container = document.getElementById('svg-map-container');
//   container.querySelectorAll('g.province').forEach(group => {
//     const provName = idToProvinsi[group.id];
//     // kalau provinsi ini tidak di tabel, skip
//     if (!allowedProvinsis.includes(provName)) return;

//     // sisipkan hitbox atau langsung pakai path
//     group.addEventListener('mouseenter', e => {
//       const data = dataMap.get(provName);
//       if (data) showHoverCard(provName, data, e);
//     });
//     group.addEventListener('mouseleave', hideHoverCard);
//   });
// }


// Show hover info card
// function showHoverCard(name, data, event) {
//   const card = document.getElementById('hover-card');
//   card.innerHTML = `
//     <h3 class="text-lg font-semibold mb-2">${data['Provinsi']}</h3>
//     ${['Target SID','Sudah Kontrak SID','Target Konstruksi (Ha)','Total SID Tersedia (Ha)','Kontrak Konstruksi  (Ha)','Realisasi Fisik']
//       .map(key => `<p><strong>${key.replace(/\s*\(Ha\)/, '')}:</strong> ${data[key]}${key.includes('(Ha)') ? ' Ha' : ''}</p>`)
//       .join('')}
//   `;
//   card.style.top = `${event.clientY + 20}px`;
//   card.style.left = `${event.clientX + 20}px`;
//   card.classList.remove('hidden');
// }

function showHoverCard(name, data, event) {
  const card = document.getElementById('hover-card');
  // Awali dengan judul nama provinsi
  let html = `<h3 class="text-lg font-semibold mb-2">${name}</h3>`;

  if (data) {
    // Tampilkan semua field jika ada data
    html += ['Target SID','Sudah Kontrak SID','Target Konstruksi (Ha)',
             'Total SID Tersedia (Ha)','Kontrak Konstruksi  (Ha)',
             'Realisasi Fisik']
      .map(key => 
        `<p><strong>${key.replace(/\s*\(Ha\)/, '')}:</strong> ` +
        `${data[key] || '-'}${key.includes('(Ha)') ? ' Ha' : ''}</p>`
      ).join('');
  } else {
    // Fallback jika datanya belum tersedia
    html += `<p class="text-sm text-gray-500">Data belum tersedia</p>`;
  }

  card.innerHTML = html;
  card.style.top  = `${event.clientY + 20}px`;
  card.style.left = `${event.clientX + 20}px`;
  card.classList.remove('hidden');
}

// Hide hover info card
function hideHoverCard() {
  document.getElementById('hover-card').classList.add('hidden');
}

// Setup map/table toggle buttons
function setupToggleButtons() {
  const btns = [
    { btn: 'btn-map', panel: 'panel-map' },
    { btn: 'btn-table', panel: 'panel-table' }
  ];

  btns.forEach(({ btn, panel }) => {
    const button = document.getElementById(btn);
    const other = btns.find(b => b.btn !== btn);
    const panelEl = document.getElementById(panel);
    const otherPanelEl = document.getElementById(other.panel);

    if (button && panelEl && otherPanelEl) {
      button.addEventListener('click', () => {
        button.classList.replace('bg-gray-200','bg-blue-500');
        button.classList.replace('text-gray-700','text-white');
        document.getElementById(other.btn).classList.replace('bg-blue-500','bg-gray-200');
        document.getElementById(other.btn).classList.replace('text-white','text-gray-700');
        panelEl.classList.remove('hidden');
        otherPanelEl.classList.add('hidden');
      });
    }
  });
}

async function fetchText(url) {
  const response = await fetch(url, {
    cache: 'no-cache',               // bypass cache
    headers: { 'Cache-Control': 'no-cache' }
  });
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return response.text();
}