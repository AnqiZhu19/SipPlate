import React from 'react';
import { STICKERS } from '../data/constants';

export default function StickerPicker({ onAdd }) {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <span className="panel-title">Add Food</span>
      </div>
      <div className="panel-body" style={{ maxHeight: '260px', overflowY: 'auto' }}>
        {Object.entries(STICKERS).map(([category, emojis]) => (
          <div key={category}>
            <div className="sticker-section-label">{category}</div>
            <div className="sticker-grid">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  className="sticker-btn"
                  onClick={() => onAdd(emoji)}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
