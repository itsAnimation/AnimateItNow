const container = document.getElementById('assistant-container');
const chatUI = document.getElementById('chat-ui');
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');
const clearBtn = document.getElementById('clear-chat');

let isExpanded = false;

function loadChatHistory() {
  const saved = localStorage.getItem('chatHistory');
  if (saved) {
    const messages = JSON.parse(saved);
    messages.forEach(({ text, sender }) => addMessage(text, sender, false));
  }
}

function saveChatHistory() {
  const messages = [];
  chatWindow.querySelectorAll('.message').forEach(msg => {
    messages.push({ text: msg.textContent, sender: msg.classList.contains('user') ? 'user' : 'bot' });
  });
  localStorage.setItem('chatHistory', JSON.stringify(messages));
}

function addMessage(text, sender = 'bot', save = true) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  if (save) saveChatHistory();
}

function addTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.classList.add('typing');
  typingDiv.textContent = 'Assistant is typing';
  let dots = 0;
  const interval = setInterval(() => {
    dots = (dots + 1) % 4;
    typingDiv.textContent = 'Assistant is typing' + '.'.repeat(dots);
  }, 500);
  typingDiv.dataset.intervalId = interval;
  chatWindow.appendChild(typingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return typingDiv;
}

function removeTypingIndicator(typingDiv) {
  if (typingDiv && typingDiv.parentNode) {
    clearInterval(typingDiv.dataset.intervalId);
    typingDiv.parentNode.removeChild(typingDiv);
  }
}

function simulateBotResponse(userText) {
  const typing = addTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator(typing);
    let botReply = "Sorry, I didn't understand that.";
    const lower = userText.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) {
      botReply = 'Hello! How can I assist you with AnimateIt today?';
    } else if (lower.includes('how are you')) {
      botReply = "I'm doing great! How can I help you with AnimateIt?";
    } else if (lower.includes('thanks') || lower.includes('thank you')) {
      botReply = "You're welcome! Happy to help.";
    } else if (lower.includes('animate')) {
      botReply = 'AnimateIt helps you create smooth animations easily!';
    } else if (lower.includes('help')) {
      botReply = 'Feel free to ask me anything about the AnimateIt project or animations.';
    } else if (lower.trim() === '') {
      botReply = 'Please type something so I can help!';
    }
    addMessage(botReply, 'bot');
  }, 1500);
}

function sendMessage() {
  const text = userInput.value.trim();
  if (text === '') return;
  addMessage(text, 'user');
  userInput.value = '';
  simulateBotResponse(text);
}

// Toggle expand/collapse when icon clicked
container.addEventListener('click', (e) => {
  if ([userInput, sendBtn, voiceBtn, clearBtn].includes(e.target)) return;
  if (!isExpanded) {
    container.classList.remove('collapsed');
    container.classList.add('expanded');
    chatUI.classList.remove('hidden');
    isExpanded = true;
    userInput.focus();
  } else {
    container.classList.remove('expanded');
    container.classList.add('collapsed');
    chatUI.classList.add('hidden');
    isExpanded = false;
  }
});

sendBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  sendMessage();
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

if (clearBtn) {
  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chatWindow.innerHTML = '';
    localStorage.removeItem('chatHistory');
    userInput.focus();
  });
}

// Voice recognition setup and toggle
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false; // stop automatically after one phrase
  recognition.interimResults = false; // final results only
  recognition.lang = 'en-US';

  let listening = false;

  function updateVoiceBtnUI() {
    if (listening) {
      voiceBtn.textContent = '🎙 Listening... (Click to stop)';
      voiceBtn.classList.add('listening');
      voiceBtn.disabled = false;
    } else {
      voiceBtn.textContent = '🎙 Speak';
      voiceBtn.classList.remove('listening');
      voiceBtn.disabled = false;
    }
  }

  voiceBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!listening) {
      try {
        recognition.start();
        listening = true;
        updateVoiceBtnUI();
      } catch (err) {
        console.error('Recognition start error:', err);
        alert('Speech recognition failed to start. Please check your microphone permissions.');
        listening = false;
        updateVoiceBtnUI();
      }
    } else {
      recognition.stop();
    }
  });

  recognition.onstart = () => {
    console.log('Speech recognition started.');
    listening = true;
    updateVoiceBtnUI();
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('Recognition result:', transcript);
    userInput.value = transcript;
    sendMessage();
  };

  recognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
    alert(`Speech recognition error: ${event.error}`);
    listening = false;
    updateVoiceBtnUI();
  };

  recognition.onend = () => {
    console.log('Speech recognition ended.');
    listening = false;
    updateVoiceBtnUI();
  };

} else {
  console.warn('Speech Recognition API not supported in this browser.');
  voiceBtn.style.display = 'none';
}

loadChatHistory();






























