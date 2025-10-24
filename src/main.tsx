  import 'leaflet/dist/leaflet.css';
  import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
  // Fix Leaflet's default icon paths under Vite
  import L from 'leaflet';
  import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
  import icon from 'leaflet/dist/images/marker-icon.png';
  import shadow from 'leaflet/dist/images/marker-shadow.png';

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: icon2x,
    iconUrl: icon,
    shadowUrl: shadow,
  });



  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  