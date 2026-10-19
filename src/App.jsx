import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Line, Marker, ZoomableGroup } from 'react-simple-maps';

// World Map TopoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";

// Geographic Coordinates [Longitude, Latitude]
const locations = {
  westAfrica: { coordinates: [-2.5, 12.0], name: "West Africa (Enslaved Muslim / Intellectual Roots)" },
  haiti: { coordinates: [-72.2852, 18.9712], name: "Haiti / St. Domingue (1791 Genesis)" },
  caribbean: { coordinates: [-77.2975, 18.1096], name: "Caribbean Diaspora (Jamaica / Trinidad / UK Windrush)" },
  alabama: { coordinates: [-86.6496, 32.3182], name: "Lowndes County, AL (Black Power / LCFO)" },
  oakland: { coordinates: [-122.2712, 37.8044], name: "Oakland & Harlem (BPP, NOI, Black Feminism)" },
};

// Trajectory Paths for Movements
const movementPaths = [
  {
    name: "Black Muslim Political Movements",
    color: "#10b981", // Emerald
    from: locations.westAfrica,
    to: locations.oakland,
    cargo: "Arabic Literacy, Islamic Liberation Theology, 'Muhammad Speaks' Press"
  },
  {
    name: "Black Power Movement",
    color: "#f59e0b", // Amber
    from: locations.haiti,
    to: locations.alabama,
    cargo: "Armed Self-Defense, Ten-Point Programs, Free Breakfasts"
  },
  {
    name: "Black Feminist Movements",
    color: "#ec4899", // Pink
    from: locations.caribbean,
    to: locations.oakland,
    cargo: "Intersectionality Frameworks, Consciousness-Raising, Kitchen Table Press"
  },
  {
    name: "Black Non-Violence Movements",
    color: "#3b82f6", // Blue
    from: locations.westAfrica,
    to: locations.alabama,
    cargo: "Freedom Songs, Sit-In Tactics, Moral Witness Philosophy"
  },
  {
    name: "Black Lives Matter (M4BL)",
    color: "#8b5cf6", // Purple
    from: locations.caribbean,
    to: locations.oakland,
    cargo: "Hashtags (#BLM), Copwatch, Decentralized Networks, Bail Funds"
  }
];

export default function App() {
  const [activeMovement, setActiveMovement] = useState(movementPaths[0]);
  const [position, setPosition] = useState({ coordinates: [-20, 20], zoom: 1 });

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.3 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 0.8) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.3 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [-20, 20], zoom: 1 });
  };

  const handleMoveEnd = (newPosition) => {
    setPosition(newPosition);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 font-sans text-white">
      {/* Header */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10 shadow-md">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">Countercultural Movement Map: Africa to America</h1>
          <p className="text-xs text-slate-400">Guiding Question: What happens to a political idea when it travels?</p>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Sidebar: Movement Selector & Cargo Info */}
        <div className="w-full lg:w-96 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Select Movement to Trace:
            </h2>
            <div className="space-y-2">
              {movementPaths.map((movement, index) => (
                <button
                  key={index}
                  onClick={() => setActiveMovement(movement)}
                  className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-medium flex items-center justify-between ${
                    activeMovement.name === movement.name
                      ? 'bg-slate-800 border-emerald-500 text-white shadow-lg'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <span>{movement.name}</span>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: movement.color }}></span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Cargo / Trajectory Details Box */}
          <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              📦 Traveling Cargo ({activeMovement.name}):
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeMovement.cargo}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">Trajectory:</span> {activeMovement.from.name} $\rightarrow$ {activeMovement.to.name}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Geographic Map with Zoom/Pan */}
        <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-4">
          
          {/* Zoom Control Buttons */}
          <div className="absolute top-6 right-6 z-20 flex flex-col space-y-2 bg-slate-900 border border-slate-800 p-1.5 rounded-lg shadow-xl">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded text-base transition-colors"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded text-base transition-colors"
              title="Zoom Out"
            >
              −
            </button>
            <button
              onClick={handleReset}
              className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors"
              title="Reset View"
            >
              ⟲
            </button>
          </div>

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 160,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={handleMoveEnd}
            >
              {/* Render World Landmasses */}
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#334155", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Trajectory Arc Line */}
              <Line
                from={activeMovement.from.coordinates}
                to={activeMovement.to.coordinates}
                stroke={activeMovement.color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="4 4"
              />

              {/* Origin Marker */}
              <Marker coordinates={activeMovement.from.coordinates}>
                <circle r={6} fill={activeMovement.color} stroke="#fff" strokeWidth={2} />
                <text textAnchor="end" y={-10} style={{ fontSize: '10px', fill: '#cbd5e1', fontWeight: 'bold' }}>
                  {activeMovement.from.name.split(' ')[0]}
                </text>
              </Marker>

              {/* Destination Marker */}
              <Marker coordinates={activeMovement.to.coordinates}>
                <circle r={6} fill={activeMovement.color} stroke="#fff" strokeWidth={2} />
                <text textAnchor="start" y={-10} style={{ fontSize: '10px', fill: '#cbd5e1', fontWeight: 'bold' }}>
                  {activeMovement.to.name.split(' ')[0]}
                </text>
              </Marker>
            </ZoomableGroup>
          </ComposableMap>

          {/* Map Overlay Helper Legend */}
          <div className="absolute bottom-6 right-6 bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-xs backdrop-blur-sm pointer-events-none">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
              <span className="text-slate-300">Click & drag map to pan • Use + / - or scroll to zoom</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}