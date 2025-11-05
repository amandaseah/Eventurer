type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const GAP = 12; // px gap between stacked widgets

type Entry = { id: string; el: HTMLElement };

const registry: Record<Corner, Entry[]> = {
  'top-left': [],
  'top-right': [],
  'bottom-left': [],
  'bottom-right': [],
};

let resizeObserverAttached = false;

function getComputedPos(el: HTMLElement, corner: Corner) {
  const style = getComputedStyle(el);
  if (corner.startsWith('top')) {
    return parseFloat(style.top || '0') || 0;
  }
  return parseFloat(style.bottom || '0') || 0;
}

function setPos(el: HTMLElement, corner: Corner, value: number) {
  if (corner.startsWith('top')) {
    el.style.top = `${value}px`;
  } else {
    el.style.bottom = `${value}px`;
  }
}

function layoutCorner(corner: Corner) {
  const list = registry[corner];
  // compute offsets sequentially using the element heights
  let cumulative = 0;

  for (let i = 0; i < list.length; i++) {
    const entry = list[i];
    const el = entry.el;

    // read current computed pos and previous applied offset from dataset
    const computed = getComputedStyle(el);
    const prevOffset = parseFloat(el.dataset.floatingOffset || '0') || 0;
    const basePos = (corner.startsWith('top')
      ? parseFloat(computed.top || '0') || 0
      : parseFloat(computed.bottom || '0') || 0) - prevOffset;

    const newOffset = cumulative;
    setPos(el, corner, basePos + newOffset);
    el.dataset.floatingOffset = String(newOffset);

    // increment cumulative by element height + gap
    const height = el.offsetHeight || (parseFloat(computed.height || '0') || 0);
    cumulative += height + GAP;
  }
}

function relayoutAll() {
  (Object.keys(registry) as Corner[]).forEach(corner => layoutCorner(corner));
}

export function registerFloating(id: string, el: HTMLElement, corner: Corner) {
  // ensure element is present and not already registered
  const list = registry[corner];
  if (list.find(e => e.id === id)) return;
  list.push({ id, el });
  layoutCorner(corner);

  if (!resizeObserverAttached) {
    window.addEventListener('resize', relayoutAll);
    resizeObserverAttached = true;
  }
}

export function unregisterFloating(id: string) {
  // remove from any corner and restore its base position
  (Object.keys(registry) as Corner[]).forEach(corner => {
    const list = registry[corner];
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      const entry = list[idx];
      const el = entry.el;
      const computed = getComputedStyle(el);
      const prevOffset = parseFloat(el.dataset.floatingOffset || '0') || 0;
      // restore base pos by subtracting previously applied offset
      if (corner.startsWith('top')) {
        const cur = parseFloat(computed.top || '0') || 0;
        el.style.top = `${cur - prevOffset}px`;
      } else {
        const cur = parseFloat(computed.bottom || '0') || 0;
        el.style.bottom = `${cur - prevOffset}px`;
      }
      delete el.dataset.floatingOffset;
      list.splice(idx, 1);
      layoutCorner(corner);
    }
  });
}

export function updateFloatingCorner(id: string, newCorner: Corner) {
  // find entry and move to new corner
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
  // relayout both affected corners
  if (fromCorner) layoutCorner(fromCorner);
  layoutCorner(newCorner);
}

export function getRegistrySnapshot() {
  return { ...registry };
}
