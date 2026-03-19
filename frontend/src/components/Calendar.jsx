import React from 'react';
import { PLATE_BACKGROUNDS } from '../data/constants';

function applyBgStyle(bgId) {
  const bg = PLATE_BACKGROUNDS.find(b => b.id === bgId) || PLATE_BACKGROUNDS[0];
  return bg.css;
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isToday(d) {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

function CalCell({ day, isOtherMonth, isToday: today, isSelected, entry, onClick }) {
  const bgStyle = entry?.bgId ? applyBgStyle(entry.bgId) : { background: 'var(--warm-white)' };

  return (
    <div
      className={`cal-cell ${today ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isOtherMonth ? 'other-month' : ''}`}
      style={bgStyle}
      onClick={onClick}
    >
      <span className="date-num">{day}</span>
      {entry?.foods?.length > 0 && (
        <div className="mini-plate">
          {entry.foods.map((f, i) => (
            <span
              key={i}
              className="mini-food"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                fontSize: '11px',
                transform: `translate(-50%,-50%) scale(${f.scale || 1})`,
              }}
            >
              {f.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Calendar({ currentDate, selectedDate, entries, onSelectDay }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells = [];

  // Previous month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push(
      <CalCell key={`prev-${i}`} day={prevDays - i} isOtherMonth />
    );
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    const key = dateKey(dt);
    cells.push(
      <CalCell
        key={key}
        day={d}
        isToday={isToday(dt)}
        isSelected={dateKey(dt) === dateKey(selectedDate)}
        entry={entries[key]}
        onClick={() => onSelectDay(dt)}
      />
    );
  }

  // Next month padding
  const total = firstDay + daysInMonth;
  const rem = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let i = 1; i <= rem; i++) {
    cells.push(<CalCell key={`next-${i}`} day={i} isOtherMonth />);
  }

  return (
    <div className="calendar-card">
      <div className="day-labels">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="day-label">{d}</div>
        ))}
      </div>
      <div className="cal-grid">{cells}</div>
    </div>
  );
}
