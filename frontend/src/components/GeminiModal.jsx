import React, { useState } from 'react';
import { STICKERS, PLATE_BACKGROUNDS, GEMINI_SYSTEM_PROMPT } from '../data/constants';

export default function GeminiModal({ isOpen, onClose, onApply }) {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!apiKey.trim()) { setError('Please enter your Gemini API Key'); return; }
    if (!prompt.trim()) { setError('Describe your breakfast first'); return; }
    setError('');
    setLoading(true);
    setResult(null);

    const allEmoji = Object.values(STICKERS).flat().join(' ');
    const bgIds = PLATE_BACKGROUNDS.map(b => b.id).join(', ');
    const sys = GEMINI_SYSTEM_PROMPT(allEmoji, bgIds);

    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: sys + '\n\nUser: ' + prompt }] }],
            generationConfig: { temperature: 0.9, maxOutputTokens: 400 },
          }),
        }
      );
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      setResult(parsed);
    } catch (e) {
      setError(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (result) {
      onApply(result);
      onClose();
      setResult(null);
      setPrompt('');
    }
  }

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">✦ AI Plate Designer</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="api-key-row">
            <span className="api-label">Gemini Key:</span>
            <input
              type="password"
              className="api-input"
              placeholder="AIza..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
          </div>

          <textarea
            className="gemini-prompt-area"
            placeholder="Describe your morning... e.g. 'light and fresh, fruits and coffee' or 'hearty and filling'"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />

          {error && (
            <p style={{ color: 'var(--terracotta)', fontSize: '12px', marginBottom: '10px' }}>{error}</p>
          )}

          {loading && (
            <div className="gemini-result" style={{ display: 'block' }}>
              <span style={{ color: 'var(--text-muted)' }}>AI is designing your plate...</span>
            </div>
          )}

          {result && !loading && (
            <div className="gemini-result" style={{ display: 'block' }}>
              <div style={{ fontSize: '22px', letterSpacing: '3px', marginBottom: '6px' }}>
                {result.foods.map(f => f.emoji).join(' ')}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {result.description}
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleApply}>
                Apply to Today's Plate
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-gemini"
            onClick={handleSubmit}
            disabled={loading}
          >
            <span>{loading ? '◌ Designing...' : '✦ Design My Plate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
