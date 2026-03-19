import React from 'react';
import PlateCanvas from './PlateCanvas';
import { MOODS } from '../data/constants';

function isToday(d) {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

export default function DayEditor({
  selectedDate,
  bgId,
  onBgChange,
  mood,
  onMoodChange,
  notes,
  onNotesChange,
  onSave,
  canvasProps,
}) {
  const title = isToday(selectedDate)
    ? "Today's Plate"
    : selectedDate.toLocaleDateString('en', { month: 'long', day: 'numeric' }) + "'s Plate";

  const dateLabel = selectedDate.toLocaleDateString('en', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="panel-card">
      <div className="panel-header">
        <span className="panel-title">{title}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dateLabel}</span>
      </div>

      <div className="panel-body">
        <PlateCanvas bgId={bgId} onBgChange={onBgChange} {...canvasProps} />

        <div className="divider" />

        {/* Mood */}
        <div className="meta-label">Mood</div>
        <div className="mood-row">
          {MOODS.map(m => (
            <button
              key={m}
              className={`mood-btn ${mood === m ? 'selected' : ''}`}
              onClick={() => onMoodChange(mood === m ? '' : m)}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="divider" />

        {/* Notes */}
        <div className="meta-label">Notes</div>
        <textarea
          className="notes-area"
          placeholder="How was breakfast today?"
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
        />

        <div className="save-row">
          <button className="btn btn-primary" onClick={onSave}>Save Entry</button>
        </div>
      </div>
    </div>
  );
}
