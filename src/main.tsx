// Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Leaflet default icon compatibility
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Leaflet default icon paths under Vite
import L from 'leaflet';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

import './index.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: shadow,
});

// React entry
import { createRoot } from 'react-dom/client';
import App from './App';   // ← no .tsx at the end

createRoot(document.getElementById('root')!).render(<App />);
