import Modeler from '../../lib/Modeler';
import 'diagram-js/assets/diagram-js.css';
import '../../archimate-font/lib/css/archimate-font.css';
import '../../assets/archimate-js.css';
import '../../assets/palette-icons.css';
import './styles.css';

const storageKey = 'archimate-js-demo-model';
const modeler = new Modeler({ container: '#canvas' });
const status = document.querySelector('#status');
const fileInput = document.querySelector('#file-input');
const matrixDialog = document.querySelector('#matrix-dialog');
const matrix = Modeler.Archimate4Relationships.getRelationshipMatrix();

function setStatus(message, error = false) {
  status.value = message;
  status.classList.toggle('error', error);
}

async function newModel() {
  await modeler.createNewModel();
  modeler.get('canvas').zoom('fit-viewport');
  setStatus('New ArchiMate 4 model ready');
}

async function importXml(xml, message = 'Model imported') {
  await modeler.importXML(xml);
  modeler.get('canvas').zoom('fit-viewport');
  setStatus(message);
}

async function exportXml() {
  const { xml } = await modeler.saveXML({ format: true });
  const url = URL.createObjectURL(new Blob([ xml ], { type: 'application/xml;charset=utf-8' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: 'architecture.archimate' });
  link.click();
  URL.revokeObjectURL(url);
  setStatus('Model exported');
}

function bind(id, action) {
  document.querySelector(id).addEventListener('click', () => Promise.resolve(action()).catch((error) => {
    console.error(error);
    setStatus(error.message || String(error), true);
  }));
}

bind('#new-model', newModel);
bind('#save-local', async () => {
  const { xml } = await modeler.saveXML({ format: true });
  localStorage.setItem(storageKey, xml);
  setStatus('Model saved in this browser');
});
bind('#open-local', async () => {
  const xml = localStorage.getItem(storageKey);
  if (!xml) throw new Error('No locally saved model was found');
  await importXml(xml, 'Local model opened');
});
bind('#import-model', () => fileInput.click());
bind('#export-model', exportXml);
bind('#zoom-fit', () => modeler.get('canvas').zoom('fit-viewport'));
bind('#zoom-in', () => { const canvas = modeler.get('canvas'); canvas.zoom(canvas.zoom() + 0.2); });
bind('#zoom-out', () => { const canvas = modeler.get('canvas'); canvas.zoom(canvas.zoom() - 0.2); });
bind('#show-matrix', () => { renderMatrix(); matrixDialog.showModal(); });

fileInput.addEventListener('change', async () => {
  try {
    if (fileInput.files[0]) await importXml(await fileInput.files[0].text());
  } catch (error) {
    setStatus(error.message || String(error), true);
  } finally {
    fileInput.value = '';
  }
});

const domains = [ ...new Set(matrix.concepts.map((concept) => concept.domain)) ];
document.querySelector('#domain-filter').append(...domains.map((domain) => {
  const option = document.createElement('option');
  option.value = option.textContent = domain;
  return option;
}));

function renderMatrix() {
  const sourceNeedle = document.querySelector('#source-filter').value.toLowerCase();
  const targetNeedle = document.querySelector('#target-filter').value.toLowerCase();
  const domain = document.querySelector('#domain-filter').value;
  const filtered = (needle) => matrix.concepts.filter((concept) =>
    (!domain || concept.domain === domain) && (!needle || concept.name.toLowerCase().includes(needle))
  );
  const sources = filtered(sourceNeedle), targets = filtered(targetNeedle);
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>Source ↓ / Target →</th>${targets.map((item) => `<th title="${item.domain}"><span>${item.name}</span></th>`).join('')}</tr></thead>`;
  const body = table.createTBody();
  for (const source of sources) {
    const row = body.insertRow();
    const heading = document.createElement('th');
    heading.textContent = source.name;
    heading.title = source.domain;
    row.append(heading);
    for (const target of targets) {
      const cellData = matrix.getCell(source.name, target.name);
      const cell = row.insertCell();
      cell.textContent = cellData.codes;
      cell.title = `${source.name} → ${target.name}\n${cellData.relationships.join('\n') || 'No allowed relationships'}`;
      if (cellData.codes) cell.className = 'has-relationships';
    }
  }
  document.querySelector('#matrix-container').replaceChildren(table);
}

for (const id of [ '#source-filter', '#target-filter', '#domain-filter' ]) {
  document.querySelector(id).addEventListener('input', renderMatrix);
}
document.querySelector('#matrix-legend').innerHTML = Object.entries(matrix.relationshipCodes)
  .map(([ name, code ]) => `<span><b>${code}</b> = ${name}</span>`).join('');

newModel().catch((error) => setStatus(error.message || String(error), true));
window.archimateModeler = modeler;
