const optionsInput = document.getElementById('options');
const generateBtn = document.getElementById('generate');
const drawBtn = document.getElementById('draw');
const resetBtn = document.getElementById('reset');
const ticketsGrid = document.getElementById('tickets');
const totalEl = document.getElementById('total');
const pickedEl = document.getElementById('picked');
const resultValue = document.getElementById('resultValue');
const historyList = document.getElementById('history');
const langSelect = document.getElementById('langSelect');

let tickets = [];
let pickedCount = 0;

const languages = window.LANG_DATA || {};
const defaultLang = window.LANG_DEFAULT || 'zh';
let currentLang = localStorage.getItem('lang') || defaultLang;
if (!languages[currentLang]) {
  currentLang = defaultLang;
}

function t(key) {
  if (languages[currentLang] && languages[currentLang][key]) {
    return languages[currentLang][key];
  }
  if (languages[defaultLang] && languages[defaultLang][key]) {
    return languages[defaultLang][key];
  }
  return key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) {
      el.textContent = t(key);
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (key) {
      el.innerHTML = t(key);
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) {
      el.setAttribute('placeholder', t(key));
    }
  });

  ticketsGrid.querySelectorAll('.ticket').forEach((ticketEl) => {
    const index = Number(ticketEl.dataset.index || 0);
    ticketEl.dataset.mark = t('ticketPicked');
    if (!ticketEl.classList.contains('revealed')) {
      ticketEl.textContent = `${t('ticketPrefix')} ${index + 1}`;
    }
  });
}

function parseOptions() {
  return optionsInput.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function updateStatus() {
  totalEl.textContent = String(tickets.length);
  pickedEl.textContent = String(pickedCount);
}

function setResult(value) {
  resultValue.textContent = value || '-';
}

function addHistory(value) {
  const item = document.createElement('div');
  item.className = 'history-item';
  item.textContent = value;
  historyList.prepend(item);
}

function createTicket(label, index) {
  const ticket = document.createElement('div');
  ticket.className = 'ticket';
  ticket.dataset.index = String(index);
  ticket.dataset.label = label;
  ticket.dataset.mark = t('ticketPicked');
  ticket.textContent = `${t('ticketPrefix')} ${index + 1}`;
  ticket.addEventListener('click', () => revealTicket(ticket));
  return ticket;
}

function renderTickets() {
  ticketsGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();
  tickets.forEach((ticket, index) => {
    fragment.appendChild(createTicket(ticket.label, index));
  });
  ticketsGrid.appendChild(fragment);
  updateStatus();
}

function revealTicket(ticketEl) {
  if (ticketEl.classList.contains('revealed')) {
    return;
  }
  ticketEl.classList.add('revealed');
  ticketEl.textContent = ticketEl.dataset.label;
  pickedCount += 1;
  updateStatus();
  setResult(ticketEl.dataset.label);
  addHistory(ticketEl.dataset.label);
}

function drawRandom() {
  const available = Array.from(ticketsGrid.querySelectorAll('.ticket:not(.revealed)'));
  if (available.length === 0) {
    setResult(t('drawnOut'));
    return;
  }
  const ticket = available[Math.floor(Math.random() * available.length)];
  ticket.classList.add('revealed');
  ticket.textContent = ticket.dataset.label;
  pickedCount += 1;
  updateStatus();
  setResult(ticket.dataset.label);
  addHistory(ticket.dataset.label);
}

function resetAll() {
  tickets = [];
  pickedCount = 0;
  ticketsGrid.innerHTML = '';
  historyList.innerHTML = '';
  setResult('');
  updateStatus();
}

generateBtn.addEventListener('click', () => {
  const options = parseOptions();
  if (options.length === 0) {
    setResult(t('enterOptions'));
    return;
  }
  tickets = options.map((label) => ({ label }));
  pickedCount = 0;
  historyList.innerHTML = '';
  setResult('');
  renderTickets();
});

drawBtn.addEventListener('click', () => {
  drawRandom();
});

resetBtn.addEventListener('click', () => {
  optionsInput.value = '';
  resetAll();
});

if (langSelect) {
  langSelect.value = currentLang;
  langSelect.addEventListener('change', (event) => {
    currentLang = event.target.value;
    localStorage.setItem('lang', currentLang);
    applyTranslations();
  });
}

applyTranslations();
updateStatus();
