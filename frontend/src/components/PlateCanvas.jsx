import React, { useState } from 'react';
import { PLATE_BACKGROUNDS } from '../data/constants';

function applyBgStyle(bgId) {
  const bg = PLATE_BACKGROUNDS.find(b => b.id === bgId) || PLATE_BACKGROUNDS[0];
  return bg.css;
}

function FoodItem({ food, idx, isSelected, onMouseDown, onWheel, onTouchStart, onRemove, onSelect }) {
  return (
    <div
      className={`food-item ${isSelected ? 'selected-food' : ''}`}
      style={{
        left: `${food.x}%`,
        top: `${food.y}%`,
        transform: `translate(-50%,-50%) scale(${food.scale || 1})`,
      }}
      onMouseDown={(e) => onMouseDown(e, idx)}
      onWheel={(e) => onWheel(e, idx)}
      onTouchStart={(e) => onTouchStart(e, idx)}
      onClick={(e) => { e.stopPropagation(); onSelect(idx); }}
      onContextMenu={(e) => { e.preventDefault(); onRemove(idx); }}
    >
      {food.emoji}
    </div>
  );
}

export default function PlateCanvas({
  bgId,
  onBgChange,
  foods,
  selectedIdx,
  onSelect,
  onRemove,
  canvasRef,
  onFoodMouseDown,
  onFoodWheel,
  onFoodTouchStart,
}) {
  const [draggingOver, setDraggingOver] = useState(false);

  return (
    <div>
      {/* Background picker */}
      <div className="meta-label">Choose Plate</div>
      <div className="plate-bg-grid">
        {PLATE_BACKGROUNDS.map(bg => (
          <div
            key={bg.id}
            className={`plate-bg-opt ${bgId === bg.id ? 'selected' : ''}`}
            style={bg.css}
            title={bg.label}
            onClick={() => onBgChange(bg.id)}
          />
        ))}
      </div>

      {/* Canvas */}
      <div className="meta-label">
        Arrange &nbsp;
        <span style={{ opacity: 0.55, textTransform: 'none', fontSize: '10px' }}>
          right-click or drag to 🗑 to delete
        </span>
      </div>
      <div
        ref={canvasRef}
        className="plate-canvas-wrap"
        style={applyBgStyle(bgId)}
        onClick={() => onSelect(-1)}
      >
        <div className="scale-hint">scroll to resize · click to select</div>

        {/* Delete zone */}
        <div className={`delete-zone ${draggingOver ? 'visible hot' : ''}`} id="delete-zone">🗑</div>

        {foods.map((food, idx) => (
          <FoodItem
            key={idx}
            food={food}
            idx={idx}
            isSelected={selectedIdx === idx}
            onMouseDown={onFoodMouseDown}
            onWheel={onFoodWheel}
            onTouchStart={onFoodTouchStart}
            onRemove={onRemove}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
