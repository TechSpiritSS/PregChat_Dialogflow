// import { useState } from 'react';
// // import reactLogo from './assets/react.svg';
// import './App.css';
// // import KomunicateChat from './components/chat/chat';

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <div className="App">
//       <iframe
//         allow="microphone;"
//         // width="350"
//         // height="430"
//         src="https://console.dialogflow.com/api-client/demo/embedded/74bfde5e-3d3e-46aa-b30c-d9b382eaf25c"
//       ></iframe>
//     </div>
//   );
// }

// export default App;

import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', message: 'Hi there! How can I assist you?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] =
    useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let synth = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance(
      'Hi there! How can I assist you?'
    );
    let femaleVoices = synth
      .getVoices()
      .filter((voice) => voice.gender === 'female');
    utterance.voice = femaleVoices[0];
    synth.speak(utterance);

    return () => {
      // Clean up function to stop the speech when the component unmounts
      synth.cancel();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();

    // check if speech recognition is supported by the browser
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechRecognitionSupported(true);
    }
  }, [messages]);

  const sendMessage = async () => {
    // prevent empty messages
    if (!inputValue) return;

    const newMessage = { message: inputValue, sender: 'user' };
    setMessages([...messages, newMessage]); // add user message here

    const jsonVal = {
      text: inputValue,
      userId: Math.floor(Math.random() * 1000000).toString(),
    };

    setLoading(true);

    const response = await fetch('http://localhost:8080/text_query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonVal),
    });

    const responseText = await response.text();
    const botMessage = { message: responseText, sender: 'bot' };
    setLoading(false);
    setMessages([...messages, newMessage, botMessage]); // add bot message here
    setInputValue('');

    // speak the bot message
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(responseText);
    const femaleVoices = synth
      .getVoices()
      .filter((voice) => voice.gender === 'female');
    utterance.voice = femaleVoices[0];
    synth.speak(utterance);
  };

  const startSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognitionRef.current = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };
    recognitionRef.current.start();
  };

  return (
    <div className="App">
      <div className="header">
        <div className="header-info">
          <img src="./logo.jpeg" alt="User Profile" className="profile-image" />
          <div className="username">PregChat</div>
        </div>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            className={`message ${
              message.sender === 'user' ? 'user-message' : 'bot-message'
            }`}
            key={index}
          >
            {message.message}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
        {loading && (
          <div className="message bot-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      <div className="input-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="input"
            type="text"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button
            className="send-button"
            onClick={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            Send
          </button>
          <button
            className="microphone-button"
            onClick={startSpeechRecognition}
            style={{
              display: speechRecognitionSupported ? 'inline' : 'none',
              color: isListening ? 'red' : 'black',
            }}
          >
            <i class="fa fa-microphone" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;

function startSpeechRecognition() {
  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = function (event) {
    const message = event.results[0][0].transcript;
    setInputValue(message);
    sendMessage();
  };
}

