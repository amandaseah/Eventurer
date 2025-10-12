import { memo } from "react";

export default memo(function Map() {
  // TODO: integrate Leaflet/OneMap here
  return (
    <div className="h-64 rounded-2xl bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Map placeholder</p>
    </div>
  );
});