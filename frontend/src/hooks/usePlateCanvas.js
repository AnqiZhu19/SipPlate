import { useState, useRef, useCallback } from 'react';

export function usePlateCanvas() {
  const [foods, setFoods] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const dragging = useRef(null); // { idx, offsetX, offsetY }
  const pinch = useRef(null);    // { idx, startDist, startScale }
  const canvasRef = useRef(null);

  const addFood = useCallback((emoji) => {
    const margin = 12;
    setFoods(prev => [
      ...prev,
      {
        emoji,
        x: margin + Math.random() * (100 - margin * 2),
        y: margin + Math.random() * (100 - margin * 2),
        scale: 1,
      },
    ]);
  }, []);

  const removeFood = useCallback((idx) => {
    setFoods(prev => prev.filter((_, i) => i !== idx));
    setSelectedIdx(-1);
  }, []);

  const clearFoods = useCallback(() => {
    setFoods([]);
    setSelectedIdx(-1);
  }, []);

  const setFoodsFromData = useCallback((foodsData) => {
    setFoods(foodsData.map(f => ({ scale: 1, ...f })));
    setSelectedIdx(-1);
  }, []);

  const scaleFood = useCallback((idx, delta) => {
    setFoods(prev => prev.map((f, i) =>
      i === idx ? { ...f, scale: Math.min(4, Math.max(0.3, (f.scale || 1) + delta)) } : f
    ));
  }, []);

  // ── Mouse drag ────────────────────────────────────────────────────────────
  const onFoodMouseDown = useCallback((e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIdx(idx);
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    dragging.current = {
      idx,
      offsetX: e.clientX - r.left - r.width / 2,
      offsetY: e.clientY - r.top - r.height / 2,
    };

    const onMove = (me) => {
      if (!dragging.current || !canvasRef.current) return;
      const cr = canvasRef.current.getBoundingClientRect();
      const x = Math.max(5, Math.min(95, ((me.clientX - dragging.current.offsetX - cr.left) / cr.width) * 100));
      const y = Math.max(5, Math.min(95, ((me.clientY - dragging.current.offsetY - cr.top) / cr.height) * 100));
      setFoods(prev => prev.map((f, i) => i === dragging.current.idx ? { ...f, x, y } : f));
    };

    const onUp = () => {
      dragging.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

  // ── Mouse wheel scale ─────────────────────────────────────────────────────
  const onFoodWheel = useCallback((e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIdx(idx);
    scaleFood(idx, e.deltaY < 0 ? 0.1 : -0.1);
  }, [scaleFood]);

  // ── Touch ─────────────────────────────────────────────────────────────────
  const getTouchDist = (touches) =>
    Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

  const onFoodTouchStart = useCallback((e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIdx(idx);

    if (e.touches.length === 2) {
      pinch.current = { idx, startDist: getTouchDist(e.touches), startScale: foods[idx]?.scale || 1 };
      return;
    }

    const t = e.touches[0];
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    dragging.current = {
      idx,
      offsetX: t.clientX - r.left - r.width / 2,
      offsetY: t.clientY - r.top - r.height / 2,
    };

    const onMove = (me) => {
      me.preventDefault();
      if (pinch.current && me.touches.length === 2) {
        const dist = getTouchDist(me.touches);
        const newScale = Math.min(4, Math.max(0.3, pinch.current.startScale * (dist / pinch.current.startDist)));
        setFoods(prev => prev.map((f, i) => i === pinch.current.idx ? { ...f, scale: newScale } : f));
        return;
      }
      if (!dragging.current || !canvasRef.current) return;
      const mt = me.touches[0];
      const cr = canvasRef.current.getBoundingClientRect();
      const x = Math.max(5, Math.min(95, ((mt.clientX - dragging.current.offsetX - cr.left) / cr.width) * 100));
      const y = Math.max(5, Math.min(95, ((mt.clientY - dragging.current.offsetY - cr.top) / cr.height) * 100));
      setFoods(prev => prev.map((f, i) => i === dragging.current.idx ? { ...f, x, y } : f));
    };

    const onEnd = (me) => {
      dragging.current = null;
      pinch.current = null;
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  }, [foods]);

  return {
    foods,
    selectedIdx,
    setSelectedIdx,
    addFood,
    removeFood,
    clearFoods,
    setFoodsFromData,
    scaleFood,
    canvasRef,
    onFoodMouseDown,
    onFoodWheel,
    onFoodTouchStart,
  };
}
