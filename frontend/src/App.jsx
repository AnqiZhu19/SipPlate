import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import DayEditor from './components/DayEditor';
import StickerPicker from './components/StickerPicker';
import LogView from './components/LogView';
import GeminiModal from './components/GeminiModal';
import Toast from './components/Toast';
import { useEntries } from './hooks/useEntries';
import { usePlateCanvas } from './hooks/usePlateCanvas';

export default function App() {
  const [view, setView] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bgId, setBgId] = useState('plain-cream');
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [geminiOpen, setGeminiOpen] = useState(false);
  const [toast, setToast] = useState('');

  const { entries, saveEntry, getEntry, getMonthEntries, getStreak } = useEntries();

  const {
    foods, selectedIdx, setSelectedIdx,
    addFood, removeFood, setFoodsFromData,
    canvasRef, onFoodMouseDown, onFoodWheel, onFoodTouchStart,
  } = usePlateCanvas();

  // Load entry when selected day changes
  useEffect(() => {
    const entry = getEntry(selectedDate);
    setFoodsFromData(entry?.foods || []);
    setBgId(entry?.bgId || 'plain-cream');
    setMood(entry?.mood || '');
    setNotes(entry?.notes || '');
  }, [selectedDate]);

  // Stats for current month
  const monthEntries = getMonthEntries(currentDate.getFullYear(), currentDate.getMonth());
  const foodTypeSet = new Set(monthEntries.flatMap(([, e]) => (e.foods || []).map(f => f.emoji)));
  const streak = getStreak();

  function handleSave() {
    saveEntry(selectedDate, { foods, bgId, mood, notes });
    showToast('Saved ✓');
  }

  function handleGeminiApply(parsed) {
    setFoodsFromData(parsed.foods || []);
    if (parsed.bgId) setBgId(parsed.bgId);
    showToast('AI layout applied — feel free to adjust ✓');
  }

  function showToast(msg) {
    setToast(msg);
  }

  const monthLabel = currentDate.toLocaleString('default', { month: 'long' }) + ' ' + currentDate.getFullYear();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        view={view}
        onViewChange={setView}
        monthEntryCount={monthEntries.length}
      />

      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="month-nav">
            <button className="nav-btn" onClick={() => setCurrentDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; })}>‹</button>
            <span className="month-title">{monthLabel}</span>
            <button className="nav-btn" onClick={() => setCurrentDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; })}>›</button>
          </div>
          <div className="top-actions">
            <button className="btn btn-gemini" onClick={() => setGeminiOpen(true)}>
              <span>✦ AI Layout</span>
            </button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>

        {/* Calendar view */}
        {view === 'calendar' && (
          <div className="view">
            <div className="cal-view">
              {/* Stats */}
              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-value">{monthEntries.length}</span>
                  <div className="stat-label">this month</div>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{foodTypeSet.size}</span>
                  <div className="stat-label">food types</div>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{streak}</span>
                  <div className="stat-label">day streak</div>
                </div>
              </div>

              {/* Calendar grid */}
              <Calendar
                currentDate={currentDate}
                selectedDate={selectedDate}
                entries={entries}
                onSelectDay={setSelectedDate}
              />

              {/* Right panel */}
              <div className="right-panel">
                <DayEditor
                  selectedDate={selectedDate}
                  bgId={bgId}
                  onBgChange={setBgId}
                  mood={mood}
                  onMoodChange={setMood}
                  notes={notes}
                  onNotesChange={setNotes}
                  onSave={handleSave}
                  canvasProps={{
                    foods,
                    selectedIdx,
                    onSelect: setSelectedIdx,
                    onRemove: removeFood,
                    canvasRef,
                    onFoodMouseDown,
                    onFoodWheel,
                    onFoodTouchStart,
                  }}
                />
                <StickerPicker onAdd={addFood} />
              </div>
            </div>
          </div>
        )}

        {/* Log view */}
        {view === 'log' && (
          <div className="view">
            <LogView entries={entries} />
          </div>
        )}
      </main>

      <GeminiModal
        isOpen={geminiOpen}
        onClose={() => setGeminiOpen(false)}
        onApply={handleGeminiApply}
      />

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  );
}
