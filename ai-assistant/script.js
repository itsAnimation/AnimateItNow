/**
 * 🎯 AI Assistant JavaScript Functionality
 * 
 * Handles chat interface interactions, message processing, 
 * voice recognition, and chatbot responses.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 🎯 DOM Element References
    const chatLogo = document.getElementById('chat-logo');
    const chatContainer = document.getElementById('chat-container');
    const closeBtn = document.getElementById('close-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const voiceInputBtn = document.getElementById('voice-input-btn');

    // 🗃️ Chatbot Data Management
    let chatbotData = {};
    let dataLoaded = false;

    /**
     * 📥 Load chatbot data from JSON file
     * @returns {Promise<Object>} Promise resolving to chatbot data
     */
    function loadChatbotData() {
        return fetch('chatbot-data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                chatbotData = data;
                dataLoaded = true;
                console.log('✅ Chatbot data loaded successfully');
                return data;
            })
            .catch(error => {
                console.error('❌ Error loading chatbot data:', error);
                // 🎯 Fallback to hardcoded data if JSON fails to load
                chatbotData = getFallbackChatbotData();
                dataLoaded = true;
                return chatbotData;
            });
    }

    /**
     * 🗂️ Get fallback chatbot data when JSON loading fails
     * @returns {Object} Fallback chatbot responses
     */
    function getFallbackChatbotData() {
        return {
            "hi, how are you doing?": "i'm fine. how about yourself?",
            "i'm fine. how about yourself?": "i'm pretty good. thanks for asking.",
            "i'm pretty good. thanks for asking.": "no problem. so how have you been?",
            "no problem. so how have you been?": "i've been great. what about you?",
            "i've been great. what about you?": "i've been good. i'm in school right now.",
            "i've been good. i'm in school right now.": "what school do you go to?",
            "what school do you go to?": "i go to pcc.",
            "i go to pcc.": "do you like it there?",
            "do you like it there?": "it's okay. it's a really big campus.",
            "it's okay. it's a really big campus.": "good luck with school.",
            "good luck with school.": "thank you very much.",
            "how's it going?": "i'm doing well. how about you?",
            "i'm doing well. how about you?": "never better, thanks.",
            "never better, thanks.": "so how have you been lately?",
            "so how have you been lately?": "i've actually been pretty good. you?",
            "i've actually been pretty good. you?": "i'm actually in school right now.",
            "i'm actually in school right now.": "which school do you attend?",
            "which school do you attend?": "i'm attending pcc right now.",
            "are you enjoying it there?": "it's not bad. there are a lot of people there.",
            "it's not bad. there are a lot of people there.": "good luck with that.",
            "good luck with that.": "thanks.",
            "how are you doing today?": "i'm doing great. what about you?",
            "i'm doing great. what about you?": "i'm absolutely lovely, thank you.",
            "i'm absolutely lovely, thank you.": "everything's been good with you?",
            "everything's been good with you?": "i haven't been better. how about yourself?",
            "i haven't been better. how about yourself?": "i started school recently.",
            "i started school recently.": "where are you going to school?",
            "where are you going to school?": "i'm going to pcc.",
            "i'm going to pcc.": "how do you like it so far?",
            "how do you like it so far?": "i like it so far. my classes are pretty good right now.",
            "i like it so far. my classes are pretty good right now.": "i wish you luck.",
            "it's an ugly day today.": "i know. i think it may rain.",
            "i know. i think it may rain.": "it's the middle of summer, it shouldn't rain today.",
            "it's the middle of summer, it shouldn't rain today.": "that would be weird.",
            "that would be weird.": "yeah, especially since it's ninety degrees outside.",
            "yeah, especially since it's ninety degrees outside.": "i know, it would be horrible if it rained and it was hot outside.",
            "i know, it would be horrible if it rained and it was hot outside.": "yes, it would be.",
            "yes, it would be.": "i really wish it wasn't so hot every day.",
            "i really wish it wasn't so hot every day.": "me too. i can't wait until winter.",
            "me too. i can't wait until winter.": "i like winter too, but sometimes it gets too cold.",
            "i like winter too, but sometimes it gets too cold.": "i'd rather be cold than hot.",
            "i'd rather be cold than hot.": "me too."
            // 🎯 Additional responses would continue here...
        };
    }

    // 📥 Load the chatbot data when the page loads
    loadChatbotData();

    // 🎮 Event Listeners

    /**
     * 🖱️ Toggle chat window visibility
     */
    chatLogo.addEventListener('click', () => {
        const isVisible = chatContainer.style.display === 'flex';
        chatContainer.style.display = isVisible ? 'none' : 'flex';
        
        // 🎯 Focus input when opening chat
        if (!isVisible) {
            setTimeout(() => userInput.focus(), 100);
        }
    });

    /**
     * ❌ Close chat window
     */
    closeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });

    /**
     * 📤 Send message handler
     */
    sendBtn.addEventListener('click', () => {
        sendMessage();
    });
    
    /**
     * 🎤 Voice input handler
     */
    voiceInputBtn.addEventListener('click', () => {
        startVoiceRecognition();
    });

    /**
     * ⌨️ Handle 'Enter' key press for message sending
     * @param {KeyboardEvent} event - Keyboard event
     */
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // 💬 Message Handling Functions

    /**
     * 📤 Send user message and get bot response
     */
    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;

        appendMessage(userMessage, 'user-message');
        userInput.value = '';

        // 🔍 Search for bot response in dataset
        searchDataset(userMessage);
    }

    /**
     * 📝 Append message to chat box
     * @param {string} message - Message text to display
     * @param {string} className - CSS class for styling
     */
    function appendMessage(message, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        
        // 📜 Auto-scroll to latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    /**
     * 🔍 Search dataset for bot response
     * @param {string} message - User message to search for
     */
    function searchDataset(message) {
        const normalizedMessage = message.toLowerCase().trim();
        let botResponse;

        // ⏳ Check if data is loaded before searching
        if (!dataLoaded) {
            appendMessage('...', 'bot-message');
            setTimeout(() => {
                if (dataLoaded) {
                    // 🔄 Data now loaded, search again
                    searchDataset(message);
                } else {
                    // ❌ Still not loaded, show error
                    updateThinkingMessage("I'm still loading my data. Please try again in a moment.");
                }
            }, 500);
            return;
        }

        // 🎯 Find exact match in dataset
        if (chatbotData[normalizedMessage]) {
            botResponse = chatbotData[normalizedMessage];
        } else {
            botResponse = "I'm sorry, I don't have an answer for that. Please try rephrasing your question.";
        }

        // ⏰ Simulate typing delay for natural conversation
        appendMessage('...', 'bot-message');
        setTimeout(() => {
            updateThinkingMessage(botResponse);
        }, 800);
    }

    /**
     * ✏️ Update thinking message with final response
     * @param {string} response - Final bot response
     */
    function updateThinkingMessage(response) {
        const thinkingMessage = chatBox.lastElementChild;
        if (thinkingMessage && thinkingMessage.textContent === '...') {
            thinkingMessage.textContent = response;
        } else {
            appendMessage(response, 'bot-message');
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // 🎤 Voice Recognition Functions

    /**
     * 🎤 Start voice recognition for speech-to-text input
     */
    function startVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        // 🚫 Check browser support
        if (!SpeechRecognition) {
            alert('Your browser does not support voice input. Please use a modern browser like Chrome or Edge.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US'; 
        recognition.interimResults = false; 
        recognition.maxAlternatives = 1; 

        /**
         * 🎯 Handle speech recognition result
         * @param {SpeechRecognitionEvent} event - Speech recognition event
         */
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            sendMessage();
        };

        /**
         * 🔄 Voice recognition started
         */
        recognition.onstart = () => {
            console.log('🎤 Voice recognition started...');
            voiceInputBtn.classList.add('recording');
        };

        /**
         * 🔚 Voice recognition ended
         */
        recognition.onend = () => {
            console.log('🎤 Voice recognition ended.');
            voiceInputBtn.classList.remove('recording');
        };

        /**
         * ❌ Handle speech recognition errors
         * @param {SpeechRecognitionErrorEvent} event - Error event
         */
        recognition.onerror = (event) => {
            console.error('🎤 Speech recognition error:', event.error);
            voiceInputBtn.classList.remove('recording');
            
            // 🎯 User-friendly error messages
            const errorMessages = {
                'no-speech': 'No speech was detected. Please try again.',
                'audio-capture': 'No microphone was found. Please ensure a microphone is connected.',
                'not-allowed': 'Permission to use microphone was denied. Please allow microphone access.',
                'network': 'Network error occurred. Please check your connection.',
                'default': 'An error occurred with voice recognition. Please try again.'
            };
            
            alert(`Error: ${errorMessages[event.error] || errorMessages.default}`);
        };

        // 🚀 Start voice recognition
        try {
            recognition.start();
        } catch (error) {
            console.error('🎤 Error starting voice recognition:', error);
            alert('Unable to start voice recognition. Please try again.');
        }
    }

    // 🎯 Additional Utility Functions

    /**
     * 🧹 Clear chat history
     */
    function clearChat() {
        chatBox.innerHTML = '';
        appendMessage("Hello! How can I help you today?", 'bot-message');
    }

    /**
     * 💾 Export chat history
     */
    function exportChat() {
        const messages = Array.from(chatBox.querySelectorAll('.message'));
        const chatText = messages.map(msg => {
            const type = msg.classList.contains('user-message') ? 'User' : 'Bot';
            return `${type}: ${msg.textContent}`;
        }).join('\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-history.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    // 🌟 Initialize chat interface
    console.log('🤖 AI Assistant initialized successfully');
});
