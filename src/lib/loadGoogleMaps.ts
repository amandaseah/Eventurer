// src/lib/loadGoogleMaps.ts
let isLoaded = false;
let isLoading = false;

declare global {
  interface Window {
    google: any;
  }
}

export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (isLoaded && window.google && window.google.maps) {
      resolve();
      return;
    }

    // If currently loading, poll until ready
    if (isLoading) {
      const wait = () => {
        if (isLoaded && window.google && window.google.maps) resolve();
        else setTimeout(wait, 120);
      };
      wait();
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY (check .env and restart dev server)'));
      return;
    }
    
    isLoading = true;

    // Avoid duplicate script tags if one exists
    let script = document.querySelector<HTMLScriptElement>('script[data-gmaps="1"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('data-gmaps', '1');
      // v=weekly + loading=async recommended. `libraries=places` to allow Places.
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.onload = async () => {
        try {
            if (!window.google || !window.google.maps) {
              throw new Error('Google Maps loaded but window.google.maps missing. Check API key, referrers, billing.');
            }
        
            console.log('[GMAPS] script onload, google=', !!window.google, 'maps=', !!window.google?.maps);
        
            if (window.google && window.google.maps) {
              try {
                // New accounts (modern loader)
                if (typeof window.google.maps.importLibrary === 'function') {
                  await window.google.maps.importLibrary('maps');
                  await window.google.maps.importLibrary('places');
                  console.log('[GMAPS] Loaded via importLibrary');
                } else {
                  console.log('[GMAPS] Using legacy loader (no importLibrary)');
                }
              } catch (e) {
                console.warn('[GMAPS] importLibrary failed, continuing with legacy mode:', e);
              }
            }
        
            isLoaded = true;
            isLoading = false;
            resolve();
          } catch (e) {
            isLoading = false;
            reject(e);
          }
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Google Maps script (network/CSP).'));
    };
  });
};