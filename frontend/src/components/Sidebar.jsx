import React from 'react';

export default function Sidebar({ view, onViewChange, monthEntryCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">sipplate</div>
        <div className="logo-sub">breakfast journal</div>
      </div>

      <nav>
        <div
          className={`nav-item ${view === 'calendar' ? 'active' : ''}`}
          onClick={() => onViewChange('calendar')}
        >
          📅 &nbsp;Calendar
        </div>
        <div
          className={`nav-item ${view === 'log' ? 'active' : ''}`}
          onClick={() => onViewChange('log')}
        >
          📋 &nbsp;All Entries
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="stats-pill">
          <span className="snum">{monthEntryCount}</span>
          entries this month
        </div>
      </div>
    </aside>
  );
}
