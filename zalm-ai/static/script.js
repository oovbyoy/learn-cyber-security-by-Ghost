const sendBtn = document.getElementById('send');
const msgInput = document.getElementById('message');
const chatBox = document.getElementById('chat-box');
const langSelect = document.getElementById('langSelect');

if (sendBtn) {
  sendBtn.addEventListener('click', sendMessage);
  msgInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });
}

function addMessage(text, who = 'bot') {
  const msg = document.createElement('div');
  msg.classList.add('msg', who === 'user' ? 'user' : 'bot');
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  msgInput.value = '';

  const loading = document.createElement('div');
  loading.classList.add('msg','bot');
  loading.textContent = '...';
  chatBox.appendChild(loading);
  chatBox.scrollTop = chatBox.scrollHeight;

  const lang = langSelect ? langSelect.value : 'auto';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, lang: lang })
    });
    const data = await res.json();
    loading.remove();
    addMessage(data.answer || 'No response', 'bot');
  } catch(err) {
    loading.remove();
    addMessage('Connection error. Make sure the server is running.', 'bot');
    console.error(err);
  }
}
