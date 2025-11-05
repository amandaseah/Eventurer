import { useEffect, useRef } from 'react';

type Handle = string | HTMLElement | React.RefObject<HTMLElement> | null;
// Added priority: higher priority elements will always sit above lower priority ones
type Options = { handle?: Handle; priority?: number };

// Global z-index counter for the app process. Kept simple and in-memory.
let __globalZ = 1000;
export function bringToFront(el: HTMLElement | null, priority = 0) {
	if (!el) return;
	// Give each priority "band" a large gap so higher priority always beats lower ones.
	const band = priority * 1_000_000;
	__globalZ++;
	el.style.zIndex = String(band + __globalZ);
}

export default function useDraggable(targetRef: React.RefObject<HTMLElement>, options?: Options) {
	const stateRef = useRef({
		dragging: false,
		lastX: 0,
		lastY: 0,
	});

	useEffect(() => {
		const el = targetRef.current;
		if (!el) return;

		// Determine priority: option overrides data attribute; default 0.
		const attrPriority = parseInt(el.dataset.draggablePriority ?? '', 10);
		const priority = typeof options?.priority === 'number' ? options.priority : (Number.isFinite(attrPriority) ? attrPriority : 0);

		// Ensure element can be moved
		const computed = getComputedStyle(el);
		if (computed.position === 'static') {
			el.style.position = 'absolute';
		}
		// initialize left/top if not set so movement is predictable
		if (!el.style.left) el.style.left = `${el.offsetLeft}px`;
		if (!el.style.top) el.style.top = `${el.offsetTop}px`;

		// Set an initial z-index so overlapping order is deterministic from mount
		bringToFront(el, priority);

		el.style.cursor = 'grab';
		el.style.touchAction = 'none';

		const getHandleElement = (): HTMLElement | null => {
			const h = options?.handle;
			if (!h) return el;
			if (typeof h === 'string') return el.querySelector(h);
			if ('current' in h) return h.current ?? null;
			if (h instanceof HTMLElement) return h;
			return el;
		};

		const handleEl = getHandleElement() || el;
		handleEl.style.cursor = 'grab';

		const onPointerDown = (ev: PointerEvent) => {
			// Bring this element on top when user starts interacting with it
			bringToFront(el, priority);

			try { (ev.target as Element).setPointerCapture?.(ev.pointerId); } catch {}
			stateRef.current.dragging = true;
			el.style.cursor = 'grabbing';
			handleEl.style.cursor = 'grabbing';
			stateRef.current.lastX = ev.clientX;
			stateRef.current.lastY = ev.clientY;
			ev.preventDefault();
		};

		const onPointerMove = (ev: PointerEvent) => {
			if (!stateRef.current.dragging) return;
			const dx = ev.clientX - stateRef.current.lastX;
			const dy = ev.clientY - stateRef.current.lastY;
			stateRef.current.lastX = ev.clientX;
			stateRef.current.lastY = ev.clientY;

			const curLeft = parseFloat(el.style.left || String(el.offsetLeft || 0)) || 0;
			const curTop = parseFloat(el.style.top || String(el.offsetTop || 0)) || 0;
			el.style.left = `${curLeft + dx}px`;
			el.style.top = `${curTop + dy}px`;
		};

		const onPointerUp = (ev: PointerEvent) => {
			stateRef.current.dragging = false;
			el.style.cursor = 'grab';
			handleEl.style.cursor = 'grab';
			try { (ev.target as Element).releasePointerCapture?.(ev.pointerId); } catch {}
		};

		handleEl.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('pointermove', onPointerMove);
		document.addEventListener('pointerup', onPointerUp);

		return () => {
			handleEl.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('pointermove', onPointerMove);
			document.removeEventListener('pointerup', onPointerUp);
		};
		// We intentionally only want to re-run if the target ref object itself changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [targetRef]);
}