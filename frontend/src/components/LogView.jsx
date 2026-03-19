import React from 'react';
import { PLATE_BACKGROUNDS } from '../data/constants';

function applyBgStyle(bgId) {
  const bg = PLATE_BACKGROUNDS.find(b => b.id === bgId) || PLATE_BACKGROUNDS[0];
  return bg.css;
}

export default function LogView({ entries }) {
  const sorted = Object.entries(entries).sort(([a], [b]) => b.localeCompare(a));

  if (!sorted.length) {
    return (
      <div className="log-view">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '1.25rem' }}>
          All Entries
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          No entries yet — start logging your breakfasts!
        </p>
      </div>
    );
  }

  return (
    <div className="log-view">
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '1.25rem' }}>
        All Entries
      </h2>

      {sorted.map(([key, entry]) => {
        const d = new Date(key + 'T00:00:00');
        const bgStyle = entry.bgId ? applyBgStyle(entry.bgId) : { background: 'var(--warm-white)' };

        return (
          <div key={key} className="log-entry-card">
            {/* Mini plate thumbnail */}
            <div className="log-mini-plate" style={bgStyle}>
              {(entry.foods || []).map((f, i) => (
                <span
                  key={i}
                  className="mini-food"
                  style={{
                    left: `${f.x}%`,
                    top: `${f.y}%`,
                    fontSize: '9px',
                    transform: `translate(-50%,-50%) scale(${f.scale || 1})`,
                  }}
                >
                  {f.emoji}
                </span>
              ))}
            </div>

            {/* Entry body */}
            <div className="log-entry-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px' }}>
                  {d.toLocaleDateString('en', { month: 'long', day: 'numeric', weekday: 'long' })}
                </span>
                <span style={{ fontSize: '15px' }}>{entry.mood || ''}</span>
              </div>

              <div style={{ fontSize: '16px', letterSpacing: '2px', marginBottom: '3px' }}>
                {entry.foods?.length
                  ? entry.foods.map(f => f.emoji).join('')
                  : <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>no food</span>
                }
              </div>

              {entry.notes && (
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {entry.notes}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
