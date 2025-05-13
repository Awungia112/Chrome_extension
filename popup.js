const countEl = document.getElementById('count');
const resultEl = document.getElementById('result');
const historyTable = document.getElementById('history');

// Load history on popup open
chrome.storage.local.get({ history: [] }, data => {
  data.history.forEach(item => appendHistoryRow(item));
});

// Handle button click
document.getElementById('start').addEventListener('click', () => {
  const challenge = document.getElementById('challenge').value;
  const difficulty = parseInt(document.getElementById('difficulty').value, 10);
  countEl.textContent = '0';
  resultEl.textContent = '';
  chrome.runtime.sendMessage({ cmd: 'startPoW', challenge, difficulty });
});

// Listen for background updates
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'count') {
    countEl.textContent = msg.value;
  }
  if (msg.type === 'done') {
    resultEl.textContent = `Nonce=${msg.nonce}, Hash=${msg.hash}`;
    const record = {
      challenge: msg.challenge,
      nonce: msg.nonce,
      hash: msg.hash,
      time: msg.time
    };
    appendHistoryRow(record);
  }
});

function appendHistoryRow({ challenge, nonce, hash, time }) {
  const tr = document.createElement('tr');
  [challenge, nonce, hash, new Date(time).toLocaleString()].forEach(txt => {
    const td = document.createElement('td');
    td.textContent = txt;
    tr.appendChild(td);
  });
  historyTable.appendChild(tr);
}
