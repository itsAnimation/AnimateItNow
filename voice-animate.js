window.initVoiceAnimation = function({
  micBtnId,
  inputBoxId,
  animationBoxId,
  commands = {}
}) {
  const micBtn = document.getElementById(micBtnId);
  const inputBox = document.getElementById(inputBoxId);
  const animationBox = document.getElementById(animationBoxId);

  console.log("Voice animation elements:", { micBtn, inputBox, animationBox });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("Speech Recognition not supported in this browser");
    if (inputBox) inputBox.value = "Speech Recognition not supported in this browser.";
    if (micBtn) micBtn.disabled = true;
    return;
  }

  if (!micBtn || !inputBox || !animationBox) {
    console.error("Required elements not found:", { micBtn: !!micBtn, inputBox: !!inputBox, animationBox: !!animationBox });
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let isListening = false;

  micBtn.addEventListener('click', () => {
    if (isListening) {
      console.log("Stopping recognition...");
      recognition.stop();
      return;
    }

    console.log("Starting recognition...");
    micBtn.classList.add('active');
    inputBox.value = "Listening... Speak now!";
    isListening = true;
    
    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      inputBox.value = "Error starting voice recognition.";
      micBtn.classList.remove('active');
      isListening = false;
    }
  });

  recognition.onstart = () => {
    console.log("Recognition started");
    isListening = true;
    micBtn.classList.add('active');
    inputBox.value = "Listening... Say: bounce, spin, shake, zoom, boy, girl, handshake, or fistbump";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    console.log("Recognition result:", transcript);
    inputBox.value = `You said: "${transcript}"`;
    micBtn.classList.remove('active');
    isListening = false;
    
    // Small delay to show the transcript before triggering animation
    setTimeout(() => {
      triggerVoiceAnimation(transcript);
    }, 500);
  };

  recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);
    let errorMessage = "Voice recognition error: ";
    
    switch (event.error) {
      case 'no-speech':
        errorMessage += "No speech detected. Try again.";
        break;
      case 'audio-capture':
        errorMessage += "Microphone not accessible.";
        break;
      case 'not-allowed':
        errorMessage += "Microphone access denied. Please allow microphone access.";
        break;
      case 'network':
        errorMessage += "Network error occurred.";
        break;
      default:
        errorMessage += event.error;
    }
    
    inputBox.value = errorMessage;
    micBtn.classList.remove('active');
    isListening = false;
  };

  recognition.onend = () => {
    console.log("Recognition ended");
    micBtn.classList.remove('active');
    isListening = false;
  };

  function triggerVoiceAnimation(text) {
    console.log("Triggering animation for:", text);
    
    // Clear previous content
    animationBox.innerHTML = '';
    animationBox.className = ''; // Clear previous animation classes
    
    // Check for command matches
    let matchedCommand = null;
    for (const [key, value] of Object.entries(commands)) {
      if (text.includes(key.toLowerCase())) {
        matchedCommand = key;
        break;
      }
    }

    if (matchedCommand) {
      console.log("Matched command:", matchedCommand);
      
      // Try to load Lottie animation first
      const animationPath = commands[matchedCommand];
      
      // Check if it's a file path (contains .json) or just a command name
      if (animationPath.includes('.json')) {
        // Try to load Lottie animation
        if (typeof lottie !== 'undefined') {
          try {
            lottie.loadAnimation({
              container: animationBox,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: animationPath
            });
            inputBox.value = `Playing ${matchedCommand} animation!`;
            return;
          } catch (error) {
            console.warn("Lottie animation failed, falling back to CSS:", error);
          }
        }
      }
      
      // Fallback to CSS animations
      createFallbackAnimation(matchedCommand);
      inputBox.value = `Playing ${matchedCommand} animation!`;
    } else {
      console.log("No matching command found for:", text);
      inputBox.value = `No animation found for "${text}". Try: bounce, spin, shake, zoom, boy, girl, handshake, fistbump`;
      
      // Show a default animation
      createFallbackAnimation('bounce');
    }
  }

  function createFallbackAnimation(command) {
    // Create animated element
    const animElement = document.createElement('div');
    animElement.className = `voice-animation-fallback ${command}-anim`;
    
    // Add appropriate emoji or icon based on command
    const icons = {
      bounce: '',
      spin: '🌀', 
      shake: '📳',
      zoom: '🔍',
      boy: '👦',
      girl: '👧',
      handshake: '🤝',
      fist: '👊'
    };
    
    animElement.textContent = icons[command] || '✨';
    
    // Clear and add the element
    animationBox.innerHTML = '';
    animationBox.appendChild(animElement);
    
    // Remove animation after it completes
    setTimeout(() => {
      if (animElement && animElement.parentNode) {
        animElement.style.animation = 'none';
      }
    }, 2000);
  }

  // Add visual feedback for microphone button
  const originalMicHTML = micBtn.innerHTML;
  
  function updateMicButton(isActive) {
    if (isActive) {
      micBtn.innerHTML = '<i class="fas fa-stop"></i>';
      micBtn.style.background = '#dc3545';
      micBtn.title = 'Click to stop listening';
    } else {
      micBtn.innerHTML = originalMicHTML;
      micBtn.style.background = '#2563eb';
      micBtn.title = 'Click to start voice input';
    }
  }

  // Update button appearance based on state
  recognition.onstart = () => {
    console.log("Recognition started");
    isListening = true;
    updateMicButton(true);
    inputBox.value = "🎤 Listening... Say a command!";
  };

  recognition.onend = () => {
    console.log("Recognition ended");
    isListening = false;
    updateMicButton(false);
  };

  // Initialize button
  updateMicButton(false);
  
  console.log("Voice animation initialized successfully!");
};