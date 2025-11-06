type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const GAP = 12; // px gap between stacked widgets

type Entry = { id: string; el: HTMLElement; priority: number };

const registry: Record<Corner, Entry[]> = {
  'top-left': [],
  'top-right': [],
  'bottom-left': [],
  'bottom-right': [],
};

let resizeObserverAttached = false;

// offsets are stored (px) per id; subscribers are notified when offsets change
const offsets: Record<string, number> = {};
const subscribers: Record<string, (offset: number) => void> = {};

function layoutCorner(corner: Corner) {
  const list = registry[corner];

  // Sort by priority (higher priority = rendered on top, so lower in the stack for top/bottom corners)
  list.sort((a, b) => a.priority - b.priority);
  
  let cumulative = 0;

  for (let i = 0; i < list.length; i++) {
    const entry = list[i];
    const el = entry.el;
    const computed = getComputedStyle(el);
    // base position: read the inline style value (if present) or computed
    const basePos = corner.startsWith('top')
      ? parseFloat(computed.top || '0') || 0
      : parseFloat(computed.bottom || '0') || 0;

    const newOffset = cumulative;

    offsets[entry.id] = newOffset;
    if (subscribers[entry.id]) subscribers[entry.id](newOffset);

    // increment cumulative by element height + gap
    const height = el.offsetHeight || (parseFloat(computed.height || '0') || 0);
    cumulative += height + GAP;
  }
}

function relayoutAll() {
  (Object.keys(registry) as Corner[]).forEach(corner => layoutCorner(corner));
}

export function registerFloating(id: string, el: HTMLElement, corner: Corner, priority: number = 0) {
  const list = registry[corner];
  if (list.find(e => e.id === id)) return;
  list.push({ id, el, priority });
  
  // Small delay to ensure element is fully rendered before measuring
  setTimeout(() => {
    layoutCorner(corner);
  }, 10);

  if (!resizeObserverAttached) {
    window.addEventListener('resize', relayoutAll);
    resizeObserverAttached = true;
  }
}

export function unregisterFloating(id: string) {
  (Object.keys(registry) as Corner[]).forEach(corner => {
    const list = registry[corner];
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list.splice(idx, 1);
      delete offsets[id];
      if (subscribers[id]) subscribers[id](0);
      delete subscribers[id];
      layoutCorner(corner);
    }
  });
}

export function updateFloatingCorner(id: string, newCorner: Corner) {
  let found: Entry | null = null;
  let fromCorner: Corner | null = null;
  (Object.keys(registry) as Corner[]).forEach(corner => {
    const list = registry[corner];
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      found = list[idx];
      fromCorner = corner;
      list.splice(idx, 1);
    }
  });

  if (!found) return;

  registry[newCorner].push(found);
  
  // Small delay to ensure element position is updated before measuring
  setTimeout(() => {
    if (fromCorner) layoutCorner(fromCorner);
    layoutCorner(newCorner);
  }, 10);
}

export function getOffsetFor(id: string) {
  return offsets[id] || 0;
}

export function subscribeOffset(id: string, cb: (offset: number) => void) {
  subscribers[id] = cb;
  // call immediately with current offset
  cb(offsets[id] || 0);
}

export function unsubscribeOffset(id: string) {
  delete subscribers[id];
}

export function triggerRelayout(corner: Corner) {
  layoutCorner(corner);
}

export function getRegistrySnapshot() {
  return { ...registry };
}
