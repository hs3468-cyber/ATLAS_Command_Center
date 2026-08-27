import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/apiService';
import { Bot, X, Send, Mic, MicOff, Volume2, VolumeX, AlertCircle, RefreshCw } from 'lucide-react';

export const Databot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am ATLAS Databot, your Multimodal Women Safety & System Assistant. Ask me anything via text or voice about camera status, safety alerts, evidence, drone setup, or user roles.',
      timestamp: 'Just now'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechNotice, setSpeechNotice] = useState('');
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const recognitionRef = useRef(null);

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setSpeechNotice('Listening... Speak now');
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMsg(transcript);
          handleSendText(transcript);
        }
      };

      rec.onerror = (err) => {
        console.warn('[SPEECH RECOGNITION] Error:', err.error);
        setIsListening(false);
        if (err.error === 'not-allowed' || err.error === 'permission-denied') {
          setSpeechNotice('Microphone access denied. You can use text chat.');
        } else if (err.error === 'no-speech') {
          setSpeechNotice('No speech detected. Please try again.');
        } else {
          setSpeechNotice('Speech recognition error. Text chat remains available.');
        }
        setTimeout(() => setSpeechNotice(''), 4000);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechNotice('Voice input is not supported in this browser. Please use text chat.');
      setTimeout(() => setSpeechNotice(''), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setSpeechNotice('');
      try {
        recognitionRef.current?.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSendText = async (textToSend) => {
    if (!textToSend || !textToSend.trim()) return;

    const userText = textToSend.trim();
    setInputMsg('');
    setSpeechNotice('');

    const userMsgObj = {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsgObj]);
    setLoading(true);

    try {
      // Pass recent messages array for multi-turn conversational NLP context
      const res = await apiService.askDatabot(userText, messages);
      const botText = res.isConnected && res.data ? res.data.reply : 'I am ATLAS Databot. Please ensure backend connectivity for dynamic responses.';
      
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botText,
          timestamp: res.data?.timestamp || 'Just now'
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'I am currently unable to reach the ATLAS backend, but I can assist with general navigation questions.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    handleSendText(inputMsg);
  };

  const handleQuickQuestion = (qText) => {
    setInputMsg(qText);
    handleSendText(qText);
  };

  // Browser Text-To-Speech (SpeechSynthesis)
  const speakMessage = (index, text) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 9990,
            transition: 'all 0.3s ease',
          }}
          title="Open Multimodal ATLAS Databot Assistant"
        >
          <Bot size={26} />
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #ffffff',
            }}
          />
        </button>
      )}

      {/* COMPACT CHAT PANEL */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '390px',
            maxWidth: 'calc(100vw - 32px)',
            height: '530px',
            maxHeight: 'calc(100vh - 48px)',
            background: '#ffffff',
            borderRadius: '14px',
            boxShadow: '0 20px 30px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {/* CHAT HEADER */}
          <div
            style={{
              padding: '14px 18px',
              background: '#111827',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ATLAS Databot
                  <span style={{ fontSize: '10px', background: '#374151', color: '#60a5fa', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>⚡ NLP & VOICE</span>
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Multimodal Women Safety Assistant</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* MESSAGES BODY */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#f9fafb',
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    background: msg.sender === 'user' ? '#111827' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#1f2937',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e5e7eb',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.text}

                  {/* VOICE SPEAKER OUTPUT BUTTON FOR BOT MESSAGES */}
                  {msg.sender === 'bot' && 'speechSynthesis' in window && (
                    <button
                      type="button"
                      onClick={() => speakMessage(index, msg.text)}
                      title={speakingIndex === index ? 'Stop speaking' : 'Read message aloud'}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: speakingIndex === index ? '#2563eb' : '#9ca3af',
                        cursor: 'pointer',
                        padding: '2px',
                        marginLeft: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      {speakingIndex === index ? <VolumeX size={14} className="spin" /> : <Volume2 size={14} />}
                    </button>
                  )}
                </div>

                <div
                  style={{
                    fontSize: '10px',
                    color: '#9ca3af',
                    marginTop: '4px',
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#6b7280', fontSize: '12px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={12} className="spin" /> ATLAS AI is analyzing operational context...
              </div>
            )}
          </div>

          {/* LISTENING / SPEECH NOTICE BANNER */}
          {(isListening || speechNotice) && (
            <div
              style={{
                padding: '6px 12px',
                background: isListening ? '#eff6ff' : '#fef2f2',
                borderTop: '1px solid #e5e7eb',
                fontSize: '11px',
                color: isListening ? '#1d4ed8' : '#991b1b',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isListening ? (
                <>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
                  <span>Listening... Speak your query clearly</span>
                </>
              ) : (
                <>
                  <AlertCircle size={12} />
                  <span>{speechNotice}</span>
                </>
              )}
            </div>
          )}

          {/* QUICK TOPIC SUGGESTIONS */}
          <div
            style={{
              padding: '8px 12px',
              background: '#ffffff',
              borderTop: '1px solid #f3f4f6',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
            }}
          >
            {[
              'Current system status',
              'Explain latest event',
              'Camera status',
              'Current mission',
              'Admin vs User?'
            ].map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickQuestion(q)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  color: '#374151',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* INPUT FORM WITH VOICE MIC BUTTON */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '12px',
              background: '#ffffff',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Ask Databot (text or voice)..."}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: isListening ? '1px solid #3b82f6' : '1px solid #d1d5db',
                fontSize: '13px',
                outline: 'none',
                background: isListening ? '#f0f9ff' : '#ffffff',
              }}
            />

            {/* MICROPHONE BUTTON */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Speak question using microphone"}
              style={{
                background: isListening ? '#ef4444' : '#f3f4f6',
                color: isListening ? '#ffffff' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '9px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            {/* SEND BUTTON */}
            <button
              type="submit"
              disabled={!inputMsg.trim() || loading}
              style={{
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 14px',
                cursor: inputMsg.trim() ? 'pointer' : 'not-allowed',
                opacity: inputMsg.trim() ? 1 : 0.6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Databot;
