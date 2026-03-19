export const STICKERS = {
  '☕ Drinks':  ['☕','🍵','🧋','🍶','🥤','🧃','🥛','🍷','🫖','🍹'],
  '🥞 Mains':   ['🥞','🧇','🍳','🥚','🥓','🥐','🍞','🥖','🧆','🫔'],
  '🍓 Fruit':   ['🍓','🍇','🍊','🍋','🍌','🍎','🍑','🥝','🫐','🍒'],
  '🥗 Healthy': ['🥗','🥑','🥦','🥕','🌽','🧅','🫛','🥜','🌾','🫘'],
  '🍰 Sweets':  ['🍰','🧁','🍩','🍪','🍫','🍮','🥮','🍨','🍡','🍬'],
  '🍜 Savory':  ['🍜','🍱','🥙','🌮','🥪','🍛','🥘','🍲','🧄','🧀'],
};

export const PLATE_BACKGROUNDS = [
  { id: 'plain-cream',  label: 'Cream',       css: { background: '#FAF0E6' } },
  { id: 'plain-sage',   label: 'Sage',        css: { background: '#D4E2D2' } },
  { id: 'plain-blush',  label: 'Blush',       css: { background: '#F5DDD5' } },
  { id: 'plain-slate',  label: 'Slate',       css: { background: '#D8DDE6' } },
  { id: 'plain-gold',   label: 'Gold',        css: { background: '#F5EAC8' } },
  { id: 'check-brown',  label: 'Check',       css: { background: 'repeating-conic-gradient(#FAF0E6 0% 25%,#C49A78 0% 50%) 0 0/20px 20px' } },
  { id: 'check-green',  label: 'Green Check', css: { background: 'repeating-conic-gradient(#F0F5EE 0% 25%,#8BA888 0% 50%) 0 0/20px 20px' } },
  { id: 'check-blue',   label: 'Blue Check',  css: { background: 'repeating-conic-gradient(#EEF2F8 0% 25%,#7B9BC0 0% 50%) 0 0/20px 20px' } },
  { id: 'dot-warm',     label: 'Dots',        css: { background: 'radial-gradient(circle,#C49A78 2px,transparent 2px) 0 0/16px 16px,#FAF0E6' } },
  { id: 'dot-sage',     label: 'Green Dots',  css: { background: 'radial-gradient(circle,#8BA888 2px,transparent 2px) 0 0/16px 16px,#F0F5EE' } },
  { id: 'stripe-h',     label: 'Stripes',     css: { background: 'repeating-linear-gradient(0deg,#FAF0E6,#FAF0E6 8px,#EDE0D4 8px,#EDE0D4 10px)' } },
  { id: 'stripe-d',     label: 'Diagonal',    css: { background: 'repeating-linear-gradient(45deg,#FAF0E6,#FAF0E6 8px,#EDE0D4 8px,#EDE0D4 10px)' } },
  { id: 'waffle',       label: 'Waffle',      css: { background: 'repeating-linear-gradient(90deg,transparent,transparent 9px,#DDD0C0 9px,#DDD0C0 10px),repeating-linear-gradient(0deg,transparent,transparent 9px,#DDD0C0 9px,#DDD0C0 10px),#FAF0E6' } },
  { id: 'linen',        label: 'Linen',       css: { background: 'repeating-linear-gradient(90deg,#E8D5BB 0,#E8D5BB 1px,transparent 0,transparent 50%),repeating-linear-gradient(180deg,#E8D5BB 0,#E8D5BB 1px,transparent 0,transparent 50%),#F5ECD8', backgroundSize: '12px 12px,12px 12px,auto' } },
  { id: 'circle',       label: 'Round',       css: { background: 'radial-gradient(circle at 50% 50%,transparent 58%,#E8D4C0 58%,#E8D4C0 61%,transparent 61%),#FAF0E6' } },
];

export const MOODS = ['😊', '😌', '😴', '⚡', '🌧'];

export const GEMINI_SYSTEM_PROMPT = (allEmoji, bgIds) => `You are a breakfast plate designer. Based on the user's description, select food items and arrange them beautifully on the plate.
Available foods: ${allEmoji}
Available plate background IDs: ${bgIds}
x and y are percentages (0-100) representing the food center position on the plate. Arrange them with variety — not all clustered in the middle. Make it look visually balanced and appealing.
Return ONLY JSON in this format: {"bgId":"plain-cream","foods":[{"emoji":"☕","x":25,"y":30,"scale":1},...],"description":"one sentence"}
Choose 2-7 foods. No markdown, no code blocks, just raw JSON.`;
