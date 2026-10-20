import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { Compass, BookOpen, Anchor, MapPin, Eye, EyeOff, Sun, Moon, Sparkles, GripHorizontal } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Geographic Node Coordinates [lat, lng]
const locations = {
  westAfrica: { coords: [12.0, -2.5], name: "West Africa (Enslaved Muslim Networks)" },
  detroitChicago: { coords: [41.8781, -87.6298], name: "Detroit & Chicago (NOI Headquarters)" },
  harlemNY: { coords: [40.8116, -73.9442], name: "Harlem, NY (Malcolm X & OAAU)" },
  meccaCairoAccra: { coords: [21.4225, 39.8262], name: "Mecca, Cairo & Accra (Pan-African & Islamic Axis)" },
  
  lowndesAL: { coords: [32.3182, -86.6496], name: "Lowndes County, AL (LCFO & Panther Emblem)" },
  oaklandCA: { coords: [37.8044, -122.2712], name: "Oakland, CA (Black Panther Party Headquarters)" },
  globalPowerNodes: { coords: [51.5074, -0.1278], name: "Global Power Nodes (London, Bermuda, Trinidad 1970)" },
  
  india: { coords: [20.5937, 78.9629], name: "India (Gandhian Satyagraha Roots)" },
  montgomeryATL: { coords: [33.7490, -84.3880], name: "Montgomery, Atlanta & Nashville (CORE, SCLC, SNCC)" },
  southAfricaNI: { coords: [-33.9249, 18.4241], name: "Global Anti-Apartheid Axis (South Africa & N. Ireland)" },
  
  abolitionistRoots: { coords: [18.9712, -72.2852], name: "Haiti & Early Abolitionist Networks (Truth, Wells)" },
  bostonCRC: { coords: [42.3601, -71.0589], name: "Boston, MA (Combahee River Collective 1974)" },
  globalFeminism: { coords: [10.4806, -66.9036], name: "Global Transnational Black Feminism (Afro-Latin America & Caribbean)" },
  
  fergusonFL: { coords: [38.7444, -90.3013], name: "Ferguson, MO & Sanford, FL (2012–2014 Genesis)" },
  usTransnationalNet: { coords: [34.0522, -118.2437], name: "Transnational US Network (National BLM Chapters)" },
  globalProtests: { coords: [48.8566, 2.3522], name: "Global Protest Hubs (London, Paris, Toronto, Sydney, Rio)" }
};

const movementData = [
  {
    id: 'A',
    name: "Option A: Black Muslim Political Movements",
    color: "#10b981", // Emerald
    from: locations.westAfrica,
    intermediate: locations.detroitChicago,
    to: locations.meccaCairoAccra,
    trajectory: "West Africa / Enslaved Muslim Networks → Nation of Islam (Detroit/Chicago) → Malcolm X / Organization of Afro-American Unity (Harlem) → Global Pan-African & Islamic Solidarity (Mecca, Cairo, Accra).",
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
    name: "Option E: Black Lives Matter (BLM & Movement for Black Lives)",
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

export default function App() {
  const [activeMovement, setActiveMovement] = useState(movementData[0]);
  const [visibleMovements, setVisibleMovements] = useState({ A: true, B: true, C: true, D: true, E: true });
  const [mapTheme, setMapTheme] = useState('dark');
  
  // Resizable Bottom Card State
  const [panelHeight, setPanelHeight] = useState(340); // Initial height in px
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const tileUrls = {
    light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };

  const toggleVisibility = (id) => {
    setVisibleMovements(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Dragging logic for top handle
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startHeight.current = panelHeight;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaY = startY.current - e.clientY; // Dragging UP increases height
    const newHeight = Math.max(200, Math.min(window.innerHeight * 0.85, startHeight.current + deltaY));
    setPanelHeight(newHeight);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Calculate dynamic text sizing based on panel height
  const isExpanded = panelHeight > 450;
  const isLarge = panelHeight > 600;

  const titleSizeClass = isLarge ? 'text-xl' : isExpanded ? 'text-lg' : 'text-base';
  const headingSizeClass = isLarge ? 'text-sm' : 'text-xs';
  const bodyTextSizeClass = isLarge ? 'text-sm' : isExpanded ? 'text-xs' : 'text-[11px]';

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 font-sans text-white overflow-hidden relative select-none">
      
      {/* Top Banner Navigation */}
      <header className="absolute top-3 left-3 right-3 z-[1000] bg-slate-900/95 border border-slate-800 p-3.5 rounded-xl backdrop-blur-md flex flex-wrap justify-between items-center shadow-2xl">
        <div className="flex items-center space-x-3">
          <Compass className="w-6 h-6 text-emerald-400 animate-pulse" />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-emerald-400">Black Studies Countercultural Movement Map</h1>
            <p className="text-xs text-slate-300">Guiding Question: <span className="text-slate-100 italic font-semibold">What happens to a political idea when it travels?</span></p>
          </div>
        </div>

        {/* Header Toolbar */}
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors text-amber-300"
          >
            {mapTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            {mapTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {movementData.map((mov) => (
            <button
              key={mov.id}
              onClick={() => setActiveMovement(mov)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                activeMovement.id === mov.id
                  ? 'bg-slate-800 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mov.color }}></span>
              {mov.id}
            </button>
          ))}
        </div>
      </header>

      {/* Interactive Map Canvas */}
      <div className="w-full h-full z-0">
        <MapContainer center={[20, -20]} zoom={3} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <TileLayer url={tileUrls[mapTheme]} attribution="&copy; OpenStreetMap contributors" />

          {/* Reverted Map Movements & Speech Bubbles */}
          {movementData.map((mov) => {
            if (!visibleMovements[mov.id]) return null;
            const isSelected = activeMovement.id === mov.id;

            return (
              <React.Fragment key={mov.id}>
                {/* Trajectory Direction Lines */}
                <Polyline
                  positions={[mov.from.coords, mov.intermediate.coords, mov.to.coords]}
                  pathOptions={{
                    color: mov.color,
                    weight: isSelected ? 5 : 3,
                    dashArray: '8, 8',
                    opacity: isSelected ? 1 : 0.6
                  }}
                />

                {/* Node 1: Origin Pin */}
                <CircleMarker center={mov.from.coords} radius={isSelected ? 10 : 7} pathOptions={{ fillColor: mov.color, color: '#fff', weight: 3, fillOpacity: 0.95 }}>
                  <Tooltip permanent direction="top" className="bg-slate-900/95 text-white border-2 border-emerald-500 rounded-xl p-3 text-sm font-semibold shadow-2xl backdrop-blur-md max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 border-b border-slate-800 pb-1">
                        <span className="text-base">📍</span>
                        <span className="font-bold text-emerald-400 text-sm">Genesis Node:</span>
                        <span className="text-white text-xs">{mov.from.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-normal leading-tight mt-1">
                        <strong>Strategic Cargo:</strong> {mov.cargo.strategy}
                      </p>
                    </div>
                  </Tooltip>
                  <Popup className="text-slate-900 font-sans">
                    <div className="p-2 text-sm max-w-sm">
                      <strong className="text-emerald-700 text-base">{mov.name}</strong>
                      <p className="text-xs mt-1"><strong>How it Traversed:</strong> {mov.howItTraversed}</p>
                    </div>
                  </Popup>
                </CircleMarker>

                {/* Node 2: Intermediate Pin */}
                <CircleMarker center={mov.intermediate.coords} radius={isSelected ? 10 : 7} pathOptions={{ fillColor: mov.color, color: '#fff', weight: 3, fillOpacity: 0.95 }}>
                  <Tooltip permanent direction="right" className="bg-slate-900/95 text-white border-2 border-amber-500 rounded-xl p-3 text-sm font-semibold shadow-2xl backdrop-blur-md max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 border-b border-slate-800 pb-1">
                        <span className="text-base">🔄</span>
                        <span className="font-bold text-amber-400 text-sm">Intermediate Node:</span>
                        <span className="text-white text-xs">{mov.intermediate.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-normal leading-tight mt-1">
                        <strong>Cultural Cargo:</strong> {mov.cargo.culture}
                      </p>
                    </div>
                  </Tooltip>
                </CircleMarker>

                {/* Node 3: Destination Pin */}
                <CircleMarker center={mov.to.coords} radius={isSelected ? 10 : 7} pathOptions={{ fillColor: mov.color, color: '#fff', weight: 3, fillOpacity: 0.95 }}>
                  <Tooltip permanent direction="bottom" className="bg-slate-900/95 text-white border-2 border-sky-500 rounded-xl p-3 text-sm font-semibold shadow-2xl backdrop-blur-md max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 border-b border-slate-800 pb-1">
                        <span className="text-base">🎯</span>
                        <span className="font-bold text-sky-400 text-sm">Transnational Horizon:</span>
                        <span className="text-white text-xs">{mov.to.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-normal leading-tight mt-1">
                        <strong>Freedom Vision:</strong> {mov.cargo.vision}
                      </p>
                    </div>
                  </Tooltip>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      {/* Top-Resizable Bottom Dashboard Hub */}
      <div 
        style={{ height: `${panelHeight}px` }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[96%] max-w-6xl bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col transition-none overflow-hidden"
      >
        
        {/* Top Grab Handle Bar */}
        <div 
          onMouseDown={handleMouseDown}
          className="w-full bg-slate-950/80 hover:bg-slate-800 border-b border-slate-800 py-1.5 flex flex-col items-center justify-center cursor-row-resize group transition-colors flex-shrink-0"
          title="Click and drag up to expand info card and increase text size"
        >
          <GripHorizontal className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          <span className="text-[10px] text-slate-500 group-hover:text-slate-300 font-medium tracking-wider uppercase">
            Drag Top Edge Up To Extend Info & Scale Text
          </span>
        </div>

        {/* Dashboard Content Body */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-5 overflow-y-auto flex-1">
          
          {/* Left Side: Layer Controls */}
          <div className="w-full md:w-72 bg-slate-950/90 border border-slate-800 p-4 rounded-xl flex flex-col justify-between flex-shrink-0">
            <div>
              <h3 className={`font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5 ${headingSizeClass}`}>
                <MapPin className="w-4 h-4 text-emerald-400" /> Map Trajectory Layers:
              </h3>
              <p className={`text-slate-400 mb-3 ${bodyTextSizeClass}`}>Toggle dotted line overlays on/off:</p>
              <div className="space-y-2">
                {movementData.map((m) => {
                  const isVisible = visibleMovements[m.id];
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleVisibility(m.id)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all border ${
                        isVisible
                          ? 'bg-slate-900 border-emerald-600 text-white shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate pr-1">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }}></span>
                        <span className={`truncate ${bodyTextSizeClass}`}>{m.id}: {m.name.split(':')[1] || m.name}</span>
                      </div>
                      {isVisible ? <Eye className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <EyeOff className="w-4 h-4 text-slate-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className={`mt-3 pt-2 border-t border-slate-800 text-slate-400 text-center ${bodyTextSizeClass}`}>
              Click map markers to jump to nodes
            </div>
          </div>

          {/* Main Extended Analytical Cards */}
          <div className="flex-1 space-y-3 flex flex-col justify-between">
            
            {/* Movement Title */}
            <div className="border-b border-slate-800 pb-2 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: activeMovement.color }}></span>
                <h2 className={`font-extrabold text-white tracking-wide ${titleSizeClass}`}>{activeMovement.name}</h2>
              </div>
              <span className={`font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 ${bodyTextSizeClass}`}>
                Active Focus
              </span>
            </div>

            {/* Detailed Content Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 flex-1">
              
              {/* Column 1: Historical Mechanics & Diffusion */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-center">
                <h3 className={`font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider ${headingSizeClass}`}>
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Historical Traversal & Mechanics
                </h3>
                <p className={`text-slate-200 leading-relaxed ${bodyTextSizeClass}`}>
                  <strong className="text-emerald-300">How It Traversed:</strong> {activeMovement.howItTraversed}
                </p>
                <p className={`text-slate-200 leading-relaxed pt-1 ${bodyTextSizeClass}`}>
                  <strong className="text-emerald-300">Why It Arrived:</strong> {activeMovement.whyItArrived}
                </p>
              </div>

              {/* Column 2: Traveling Cargo Breakdown */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-center">
                <h3 className={`font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider ${headingSizeClass}`}>
                  <Anchor className="w-4 h-4 text-amber-400" /> Traveling Cargo
                </h3>
                <p className={`text-slate-200 leading-relaxed ${bodyTextSizeClass}`}>
                  <strong className="text-amber-300">Tactics & Strategy:</strong> {activeMovement.cargo.strategy}
                </p>
                <p className={`text-slate-200 leading-relaxed ${bodyTextSizeClass}`}>
                  <strong className="text-amber-300">Culture & Aesthetics:</strong> {activeMovement.cargo.culture}
                </p>
                <p className={`text-slate-200 leading-relaxed ${bodyTextSizeClass}`}>
                  <strong className="text-amber-300">Spirituality:</strong> {activeMovement.cargo.spirituality}
                </p>
              </div>

            </div>

            {/* Full-Width Course Citation Box */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex-shrink-0">
              <h3 className={`font-bold text-purple-400 flex items-center gap-1.5 uppercase tracking-wider mb-1 ${headingSizeClass}`}>
                <BookOpen className="w-4 h-4 text-purple-400" /> Course Reading Integration
              </h3>
              <p className={`text-slate-200 italic leading-relaxed ${bodyTextSizeClass}`}>
                "{activeMovement.citation}"
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}