import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Compass, BookOpen, Anchor, MapPin, Eye, EyeOff, Sun, Moon, Sparkles, ChevronUp, ChevronDown, Maximize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon path issues in React bundlers
delete L.Icon.Default.prototype._getIconUrl;

// Function to create sleek, color-coded minimalist map pin icons
const createSimplePinIcon = (color, labelText, isSelected) => {
  const size = isSelected ? 34 : 26;
  const svgHtml = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: ${size / 3}px;
          height: ${size / 3}px;
          background-color: #ffffff;
          border-radius: 50%;
        "></div>
      </div>
      <span style="
        margin-top: 4px;
        background: rgba(15, 23, 42, 0.9);
        color: #f8fafc;
        font-size: ${isSelected ? '11px' : '9px'};
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid rgba(255,255,255,0.2);
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      ">${labelText}</span>
    </div>
  `;
  return L.divIcon({
    html: svgHtml,
    className: 'custom-minimal-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size]
  });
};

// Geographic Coordinates [lat, lng]
const locations = {
  westAfrica: { coords: [12.0, -2.5], name: "West Africa" },
  detroitChicago: { coords: [41.8781, -87.6298], name: "Detroit / Chicago" },
  harlemNY: { coords: [40.8116, -73.9442], name: "Harlem, NY" },
  meccaCairoAccra: { coords: [21.4225, 39.8262], name: "Mecca" },
  
  lowndesAL: { coords: [32.3182, -86.6496], name: "Lowndes Co., AL" },
  oaklandCA: { coords: [37.8044, -122.2712], name: "Oakland" },
  globalPowerNodes: { coords: [51.5074, -0.1278], name: "London" },
  
  india: { coords: [20.5937, 78.9629], name: "India" },
  montgomeryATL: { coords: [33.7490, -84.3880], name: "Atlanta / Montgomery" },
  southAfricaNI: { coords: [-33.9249, 18.4241], name: "South Africa" },
  
  abolitionistRoots: { coords: [18.9712, -72.2852], name: "Haiti" },
  bostonCRC: { coords: [42.3601, -71.0589], name: "Boston (CRC)" },
  globalFeminism: { coords: [10.4806, -66.9036], name: "Afro-Latin America" },
  
  fergusonFL: { coords: [38.7444, -90.3013], name: "Ferguson, MO" },
  usTransnationalNet: { coords: [34.0522, -118.2437], name: "US Network" },
  globalProtests: { coords: [48.8566, 2.3522], name: "Paris / London" }
};

const movementData = [
  {
    id: 'A',
    name: "Option A: Black Muslim Political Movements",
    color: "#10b981", // Emerald
    from: locations.westAfrica,
    intermediate: locations.detroitChicago,
    to: locations.meccaCairoAccra,
    trajectory: "West Africa / Enslaved Muslim Networks → Nation of Islam (Detroit/Chicago) → Malcolm X / OAAU (Harlem) → Global Pan-African & Islamic Solidarity (Mecca, Cairo, Accra).",
    howItTraversed: "Traversed via transatlantic slave routes through preserved memory, then codified during the Great Migration through urban mosque networks and print media ('Muhammad Speaks'). Malcolm X's international travels across West Africa and the Middle East catalyzed its expansion into global anti-colonial Pan-Africanism.",
    whyItArrived: "Urban northern enclaves provided fertile ground for disciplined, self-determining institutions amidst racial segregation, while international anti-colonial revolutions offered a global geopolitical framework beyond US civil rights reformism.",
    cargo: {
      strategy: "Anti-colonial critique, independent economic self-reliance (farms, bakeries), and disciplined self-defense principles.",
      culture: "Suits, bowties, modest dress standards, and mass print media distribution ('Muhammad Speaks' newspaper).",
      spirituality: "Islamic liberation theology, strict adherence to prayer, Ramadan observance, and Elijah Muhammad dietary guidelines.",
      vision: "Sovereign Black nation-building, cultural self-determination, and transnational Pan-African/Islamic solidarity."
    },
    citation: "Engages Sylvia Wynter's critique of Western humanism alongside Cedric Robinson's framework of Black radicalism as rooted in ontological traditions distinct from Western liberalism."
  },
  {
    id: 'B',
    name: "Option B: Black Power Movement",
    color: "#f59e0b", // Amber
    from: locations.lowndesAL,
    intermediate: locations.oaklandCA,
    to: locations.globalPowerNodes,
    trajectory: "Lowndes County, Alabama (LCFO / Original Black Panther Party) → Oakland, California (Black Panther Party for Self-Defense) → Global Black Power Nodes (Bermuda, London, Australia, Trinidad 1970 Revolution).",
    howItTraversed: "Organizing strategies moved north and west via SNCC field secretaries (Stokely Carmichael/Kwame Ture). Huey P. Newton and Bobby Seale adopted the Lowndes County Freedom Organization's black panther emblem, scaling it into an urban revolutionary party with global solidarity chapters.",
    whyItArrived: "Frustration with slow southern desegregation and pervasive northern police brutality created a demand for militant armed self-defense, community-led survival programs, and anti-imperialist solidarity with global third-world liberation fronts.",
    cargo: {
      strategy: "Ten-Point Program, Free Breakfast for Children, liberation schools, armed community patrols, and copwatch.",
      culture: "Black Panther emblem, black berets, leather jackets, 'The Black Panther' newspaper, and 'Black is Beautiful' aesthetic.",
      spirituality: "Secular revolutionary humanism fused with spiritual resilience and ancestral Maroon resistance memory.",
      vision: "Self-determination, community control of housing and education, international anti-imperialism, and socialism."
    },
    citation: "Draws on C.L.R. James' 'The Black Jacobins' and Stokely Carmichael / Charles V. Hamilton's articulation of Black Power as a systemic critique of domestic colonialism."
  },
  {
    id: 'C',
    name: "Option C: Black Non-Violence Movements",
    color: "#3b82f6", // Blue
    from: locations.india,
    intermediate: locations.montgomeryATL,
    to: locations.southAfricaNI,
    trajectory: "Gandhian Satyagraha (India) → Fellowship of Reconciliation & CORE / Montgomery Bus Boycott (1955) → SCLC / SNCC Student Movement (Nashville/Atlanta) → Global Anti-Apartheid & Civil Rights Solidarity (South Africa, Northern Ireland).",
    howItTraversed: "African American intellectuals (Howard Thurman, Benjamin Mays, James Lawson) traveled to India to study Gandhian mass resistance, translating those tactical manuals into Black Christian church contexts across the US South, eventually inspiring anti-apartheid movements abroad.",
    whyItArrived: "Non-violent direct action mobilized mass moral witness, utilizing local Black church networks and HBCU student coalitions to disrupt economic revenue streams and expose southern state terror on global television.",
    cargo: {
      strategy: "Non-violent direct action workshops & manuals, economic boycotts, sit-ins, freedom rides, and jail-no-bail tactics.",
      culture: "Freedom Songs ('We Shall Overcome', 'Ain't Gonna Let Nobody Turn Me Around') and mass march choreography.",
      spirituality: "Christian liberation theology, social gospel, Gandhian Satyagraha (truth-force), and moral witness philosophy.",
      vision: "The Beloved Community, racial integration, dismantling of Jim Crow carceral laws, and human rights expansion."
    },
    citation: "Analyzes the transnational circulation of anti-colonial non-violence studied in Sudarshan Kapur's 'Raising Up a Prophet' alongside King's theological writings."
  },
  {
    id: 'D',
    name: "Option D: Black Feminist Movements",
    color: "#ec4899", // Pink
    from: locations.abolitionistRoots,
    intermediate: locations.bostonCRC,
    to: locations.globalFeminism,
    trajectory: "Black Women's Club Movement & Abolitionist Roots (Sojourner Truth, Ida B. Wells) → Combahee River Collective (Boston, 1974) → Third World Women's Alliance → Global Transnational Black Feminism (Afro-Latin American & Caribbean Women's Network).",
    howItTraversed: "Evolved through autonomous study circles, radical feminist manifestos, independent publishing collectives ('Kitchen Table Press'), and international women's conferences across the global South.",
    whyItArrived: "Black women experienced simultaneous exclusion from both white feminist organizations (which ignored race and class) and male-dominated Black nationalist/civil rights groups (which ignored patriarchal domination).",
    cargo: {
      strategy: "Consciousness-raising circles, coalition building, independent publishing, and reproductive justice frameworks.",
      culture: "Articulation of 'Intersectionality' and 'Identity Politics', essays, anthologies ('This Bridge Called My Back').",
      spirituality: "Holistic self-care as political preservation, spiritual autonomy, and radical self-love practices.",
      vision: "Simultaneous liberation from racial, sexual, heterosexual, class, and imperialist oppression."
    },
    citation: "Anchored in the 'Combahee River Collective Statement' (1977) alongside Saidiya Hartman's and Kimberlé Crenshaw's analytical frameworks."
  },
  {
    id: 'E',
    name: "Option E: Black Lives Matter (BLM & M4BL)",
    color: "#8b5cf6", // Purple
    from: locations.fergusonFL,
    intermediate: locations.usTransnationalNet,
    to: locations.globalProtests,
    trajectory: "Ferguson, Missouri / Sanford, Florida (2012–2014) → Transnational US Network → Global Protests (London, Toronto, Paris, Sydney, Rio de Janeiro).",
    cargo: {
      strategy: "Social media hashtags (#BlackLivesMatter), decentralized network structures, community bail funds, copwatch, die-ins, and the BREATHE Act.",
      culture: "Mural & street art, digital archiving, viral video documentation, and abolitionist performance art.",
      spirituality: "Ancestral reverence, healing justice, communal grief rituals, and trauma-informed care.",
      vision: "Prison abolition, systemic defunding of policing, reinvestment in Black communities, and global anti-carceral liberation."
    },
    howItTraversed: "Diffused instantaneously via social media algorithms, decentralized digital organizing, and real-time livestreaming, connecting local extrajudicial police killings to global carceral state violence.",
    whyItArrived: "Unpunished police violence and systemic racism catalyzed a new generation of queer-, women-, and youth-led radical organizing that bypassed traditional hierarchical civil rights structures.",
    citation: "Connects contemporary abolitionist horizons (Ruth Wilson Gilmore, Angela Davis) to historical freedom dreams and anti-carceral geographies."
  }
];

// Custom component to render flowing animated directional arrows along polylines
function AnimatedTrajectoryArrows({ startCoords, endCoords, color, isSelected }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % 20);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Polyline
      positions={[startCoords, endCoords]}
      pathOptions={{
        color: color,
        weight: isSelected ? 4 : 2,
        dashArray: '10, 10',
        dashOffset: `-${offset}`,
        opacity: isSelected ? 1 : 0.65
      }}
    />
  );
}

export default function App() {
  const [activeMovement, setActiveMovement] = useState(movementData[0]);
  const [visibleMovements, setVisibleMovements] = useState({ A: true, B: true, C: true, D: true, E: true });
  const [mapTheme, setMapTheme] = useState('dark');
  const [hudHeight, setHudHeight] = useState('medium'); // 'compact', 'medium', 'full'

  const tileUrls = {
    light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
  };

  const toggleVisibility = (id) => {
    setVisibleMovements(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const hudHeightClasses = {
    compact: 'h-[22vh]',
    medium: 'h-[42vh]',
    full: 'h-[85vh]'
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 font-sans text-white overflow-hidden relative">
      
      {/* Top Banner Navigation */}
      <header className="absolute top-3 left-3 right-3 z-[1000] bg-slate-900/95 border border-slate-800 p-3 rounded-xl backdrop-blur-md flex flex-wrap justify-between items-center shadow-2xl">
        <div className="flex items-center space-x-3">
          <Compass className="w-6 h-6 text-emerald-400 animate-pulse" />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-emerald-400">Black Studies Movement Map</h1>
            <p className="text-xs text-slate-300">Guiding Question: <span className="text-slate-100 italic font-semibold">What happens to a political idea when it travels?</span></p>
          </div>
        </div>

        {/* Top Navigation Buttons */}
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors text-amber-300"
          >
            {mapTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            {mapTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {movementData.map((mov) => (
            <button
              key={mov.id}
              onClick={() => setActiveMovement(mov)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                activeMovement.id === mov.id
                  ? 'bg-slate-800 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mov.color }}></span>
              {mov.id}
            </button>
          ))}
        </div>
      </header>

      {/* Interactive Leaflet Map Canvas */}
      <div className="w-full h-full z-0">
        <MapContainer center={[20, -20]} zoom={3} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <TileLayer key={mapTheme} url={tileUrls[mapTheme]} attribution="&copy; OpenStreetMap contributors &copy; CARTO" />

          {/* Render Trajectories & Minimalist Pins */}
          {movementData.map((mov) => {
            if (!visibleMovements[mov.id]) return null;
            const isSelected = activeMovement.id === mov.id;

            return (
              <React.Fragment key={mov.id}>
                {/* Leg 1: Animated Flow Line (Origin -> Intermediate) */}
                <AnimatedTrajectoryArrows
                  startCoords={mov.from.coords}
                  endCoords={mov.intermediate.coords}
                  color={mov.color}
                  isSelected={isSelected}
                />

                {/* Leg 2: Animated Flow Line (Intermediate -> Destination) */}
                <AnimatedTrajectoryArrows
                  startCoords={mov.intermediate.coords}
                  endCoords={mov.to.coords}
                  color={mov.color}
                  isSelected={isSelected}
                />

                {/* Origin Pin */}
                <Marker
                  position={mov.from.coords}
                  icon={createSimplePinIcon(mov.color, mov.from.name, isSelected)}
                  evented={true}
                  onClick={() => setActiveMovement(mov)}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-xs text-slate-900 font-sans">
                      <strong className="text-emerald-700 font-bold text-sm">{mov.from.name} (Origin)</strong>
                      <p className="mt-1 font-semibold">{mov.name}</p>
                      <p className="mt-1 text-slate-600">Strategy: {mov.cargo.strategy}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Intermediate Pin */}
                <Marker
                  position={mov.intermediate.coords}
                  icon={createSimplePinIcon(mov.color, mov.intermediate.name, isSelected)}
                  evented={true}
                  onClick={() => setActiveMovement(mov)}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-xs text-slate-900 font-sans">
                      <strong className="text-amber-700 font-bold text-sm">{mov.intermediate.name} (Node)</strong>
                      <p className="mt-1 font-semibold">{mov.name}</p>
                      <p className="mt-1 text-slate-600">Culture: {mov.cargo.culture}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Destination Pin */}
                <Marker
                  position={mov.to.coords}
                  icon={createSimplePinIcon(mov.color, mov.to.name, isSelected)}
                  evented={true}
                  onClick={() => setActiveMovement(mov)}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-xs text-slate-900 font-sans">
                      <strong className="text-sky-700 font-bold text-sm">{mov.to.name} (Destination)</strong>
                      <p className="mt-1 font-semibold">{mov.name}</p>
                      <p className="mt-1 text-slate-600">Vision: {mov.cargo.vision}</p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      {/* Resizable HUD Dashboard Card at Bottom */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] w-[96%] max-w-6xl bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col transition-all duration-300 ease-in-out ${hudHeightClasses[hudHeight]}`}>
        
        {/* HUD Top Pull/Drag Handle */}
        <div className="w-full bg-slate-950/80 hover:bg-slate-800/80 border-b border-slate-800 py-2 px-4 rounded-t-2xl flex items-center justify-between cursor-pointer select-none transition-colors"
             onClick={() => setHudHeight(hudHeight === 'compact' ? 'medium' : hudHeight === 'medium' ? 'full' : 'compact')}>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeMovement.color }}></span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">{activeMovement.name}</span>
          </div>
          
          <div className="flex items-center space-x-1 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              {hudHeight === 'compact' ? 'Pull Up for Details' : hudHeight === 'medium' ? 'Expand Full View' : 'Collapse HUD'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="flex items-center space-x-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setHudHeight('compact'); }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${hudHeight === 'compact' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >Min</button>
            <button 
              onClick={(e) => { e.stopPropagation(); setHudHeight('medium'); }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${hudHeight === 'medium' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >Mid</button>
            <button 
              onClick={(e) => { e.stopPropagation(); setHudHeight('full'); }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${hudHeight === 'full' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >Max</button>
          </div>
        </div>

        {/* HUD Content Area */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col md:flex-row gap-5">
          
          {/* Layer Controls Panel (Left Side) */}
          <div className="w-full md:w-64 bg-slate-950/90 border border-slate-800 p-4 rounded-xl flex flex-col justify-between flex-shrink-0">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" /> Trajectory Layers:
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">Toggle movement lines on/off:</p>
              <div className="space-y-1.5">
                {movementData.map((m) => {
                  const isVisible = visibleMovements[m.id];
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleVisibility(m.id)}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all border ${
                        isVisible
                          ? 'bg-slate-900 border-emerald-600 text-white shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate pr-1">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }}></span>
                        <span className="truncate text-xs">{m.id}: {m.name.split(':')[1] || m.name}</span>
                      </div>
                      {isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 text-center">
              Click pins on map to inspect cargo
            </div>
          </div>

          {/* Extended Analytical Content Columns */}
          <div className="flex-1 space-y-3">
            <div className={`grid grid-cols-1 ${hudHeight === 'full' ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-4`}>
              
              {/* Historical Mechanics */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase text-xs tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Historical Traversal & Mechanics
                </h3>
                <p className={`${hudHeight === 'full' ? 'text-sm' : 'text-xs'} text-slate-200 leading-relaxed`}>
                  <strong className="text-emerald-300">How It Traversed:</strong> {activeMovement.howItTraversed}
                </p>
                <p className={`${hudHeight === 'full' ? 'text-sm' : 'text-xs'} text-slate-200 leading-relaxed pt-1`}>
                  <strong className="text-emerald-300">Why It Arrived:</strong> {activeMovement.whyItArrived}
                </p>
              </div>

              {/* Traveling Cargo */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-xs tracking-wider">
                  <Anchor className="w-4 h-4 text-amber-400" /> Traveling Cargo
                </h3>
                <p className={`${hudHeight === 'full' ? 'text-sm' : 'text-xs'} text-slate-200 leading-normal`}>
                  <strong className="text-amber-300">Tactics & Strategy:</strong> {activeMovement.cargo.strategy}
                </p>
                <p className={`${hudHeight === 'full' ? 'text-sm' : 'text-xs'} text-slate-200 leading-normal`}>
                  <strong className="text-amber-300">Culture & Aesthetics:</strong> {activeMovement.cargo.culture}
                </p>
                <p className={`${hudHeight === 'full' ? 'text-sm' : 'text-xs'} text-slate-200 leading-normal`}>
                  <strong className="text-amber-300">Spirituality:</strong> {activeMovement.cargo.spirituality}
                </p>
              </div>

            </div>

            {/* Course Citation Box */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <h3 className="font-bold text-purple-400 flex items-center gap-1.5 uppercase text-xs tracking-wider mb-1">
                <BookOpen className="w-4 h-4 text-purple-400" /> Course Reading Integration
              </h3>
              <p className={`${hudHeight === 'full' ? 'text-sm' : 'text-xs'} text-slate-200 italic leading-relaxed`}>
                "{activeMovement.citation}"
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}