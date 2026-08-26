import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { Bot, X, Send, Sparkles, Shield, HelpCircle } from 'lucide-react';

export const Databot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am ATLAS Databot, your Women Safety & System Help Assistant. Ask me anything about camera status, safety alerts, evidence, drone setup, or user roles.',
      timestamp: 'Just now'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    setInputMsg('');

    const userMsgObj = {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsgObj]);
    setLoading(true);

    try {
      const res = await apiService.askDatabot(userText);
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

  const handleQuickQuestion = (qText) => {
    setInputMsg(qText);
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
          title="Open ATLAS Databot Help Assistant"
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
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
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
                <div style={{ fontSize: '14px', fontWeight: 700 }}>ATLAS Databot</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Women Safety & System Assistant</div>
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
              <div style={{ alignSelf: 'flex-start', color: '#6b7280', fontSize: '12px', fontStyle: 'italic' }}>
                Databot is analyzing...
              </div>
            )}
          </div>

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
              'Camera status?',
              'Safety alerts?',
              'Drone setup?',
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

          {/* INPUT FORM */}
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
              placeholder="Ask Databot something..."
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '13px',
                outline: 'none',
              }}
            />
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
