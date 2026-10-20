import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Compass, BookOpen, Anchor, MapPin, Eye, EyeOff, Sun, Moon, Sparkles, ChevronUp, ChevronDown, Quote, Navigation, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon path issues in React bundlers
delete L.Icon.Default.prototype._getIconUrl;

// Function to create sleek, minimalist map pin icons cleanly anchored over lines
const createSimplePinIcon = (color, labelText, isSelected, isDarkMode) => {
  const size = isSelected ? 42 : 32;
  const pinBorderColor = isDarkMode ? '#ffffff' : '#cbd5e1'; // White outline in Dark Mode, light grey in Light Mode
  const badgeBg = isDarkMode ? 'rgba(30, 30, 30, 0.96)' : 'rgba(255, 255, 255, 0.96)';
  const badgeText = isDarkMode ? '#cccccc' : '#1e1e1e';
  const badgeBorder = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(203, 213, 225, 0.8)';

  const svgHtml = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translate(-50%, -100%); pointer-events: auto;">
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid ${pinBorderColor};
        box-shadow: 0 6px 14px rgba(0,0,0,0.5);
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
        background: ${badgeBg};
        color: ${badgeText};
        font-size: ${isSelected ? '13px' : '11px'};
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 5px;
        border: 1px solid ${badgeBorder};
        white-space: nowrap;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        letter-spacing: 0.02em;
      ">${labelText}</span>
    </div>
  `;
  return L.divIcon({
    html: svgHtml,
    className: 'custom-minimal-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

// Geographic Coordinates [lat, lng]
const locations = {
  westAfrica: { coords: [12.0, -2.5], name: "West Africa" },
  detroitChicago: { coords: [41.8781, -87.6298], name: "Detroit / Chicago" },
  harlemNY: { coords: [40.8116, -73.9442], name: "Harlem, NY" },
  meccaCairoAccra: { coords: [21.4225, 39.8262], name: "Mecca / Cairo / Accra" },
  
  lowndesAL: { coords: [32.3182, -86.6496], name: "Lowndes Co., AL" },
  oaklandCA: { coords: [37.8044, -122.2712], name: "Oakland, CA" },
  globalPowerNodes: { coords: [51.5074, -0.1278], name: "London / Global Nodes" },
  
  india: { coords: [20.5937, 78.9629], name: "India (Satyagraha)" },
  montgomeryATL: { coords: [33.7490, -84.3880], name: "Montgomery / Atlanta" },
  southAfricaNI: { coords: [-33.9249, 18.4241], name: "South Africa / Global Axis" },
  
  abolitionistRoots: { coords: [18.9712, -72.2852], name: "Haiti / Abolitionist Roots" },
  bostonCRC: { coords: [42.3601, -71.0589], name: "Boston (CRC)" },
  globalFeminism: { coords: [10.4806, -66.9036], name: "Afro-Latin America & Diaspora" },
  
  fergusonFL: { coords: [38.7444, -90.3013], name: "Ferguson, MO & Sanford, FL" },
  usTransnationalNet: { coords: [34.0522, -118.2437], name: "US Transnational Network" },
  globalProtests: { coords: [48.8566, 2.3522], name: "Paris / London / Global Hubs" }
};

const rawMovementData = [
  {
    id: 'A',
    name: "Option A: Black Muslim Political Movements",
    darkColor: "#34d399",  // Emerald
    lightColor: "#059669", 
    from: locations.westAfrica,
    intermediate: locations.detroitChicago,
    to: locations.meccaCairoAccra,
    trajectory: "West Africa / Enslaved Muslim Networks → Nation of Islam (Detroit/Chicago) → Malcolm X / Organization of Afro-American Unity (Harlem) → Global Pan-African & Islamic Solidarity (Mecca, Cairo, Accra).",
    howItTraversed: "Traversed via transatlantic slave routes through preserved memory, Arabic literacy, and covert prayer circles. Codified during the Great Migration through urban mosque networks and mass print media ('Muhammad Speaks'). Malcolm X's international travels across West Africa and the Middle East catalyzed its expansion into global anti-colonial Pan-Africanism.",
    whyItArrived: "Urban northern enclaves provided fertile ground for disciplined, self-determining institutions amidst racial segregation, while international anti-colonial revolutions offered a global geopolitical framework beyond US civil rights reformism.",
    primaryQuote: "“You can't understand what is happening in Mississippi if you don't understand what is happening in the Congo. We are living in a country that is a colonial power in itself.” — Malcolm X (1964)",
    theoreticalSynthesis: "When Black Muslim thought traveled globally, it mutated from a domestic critique of Jim Crow into a transnational anti-imperialist movement that linked domestic racial capitalism to global anti-colonial struggles in the Third World.",
    cargo: {
      strategy: "Anti-colonial critique, independent economic self-reliance (farms, bakeries, print shops), and disciplined self-defense principles.",
      culture: "Suits, bowties, modest dress standards, and mass print media distribution ('Muhammad Speaks' newspaper).",
      spirituality: "Islamic liberation theology, strict adherence to prayer, Ramadan observance, and Elijah Muhammad dietary guidelines.",
      vision: "Sovereign Black nation-building, cultural self-determination, and transnational Pan-African/Islamic solidarity."
    },
    citation: "Engages Sylvia Wynter's critique of Western humanism alongside Cedric Robinson's framework of Black radicalism as rooted in ontological traditions distinct from Western liberalism."
  },
  {
    id: 'B',
    name: "Option B: Black Power Movement",
    darkColor: "#fbbf24",  // Amber
    lightColor: "#d97706", 
    from: locations.lowndesAL,
    intermediate: locations.oaklandCA,
    to: locations.globalPowerNodes,
    trajectory: "Lowndes County, Alabama (LCFO / Original Black Panther Party) → Oakland, California (Black Panther Party for Self-Defense) → Global Black Power Nodes (Bermuda, London, Australia, Trinidad 1970 Revolution).",
    howItTraversed: "Organizing strategies moved north and west via SNCC field secretaries (Stokely Carmichael/Kwame Ture). Huey P. Newton and Bobby Seale adopted the Lowndes County Freedom Organization's black panther emblem, scaling it into an urban revolutionary party with global solidarity chapters.",
    whyItArrived: "Frustration with slow southern desegregation and pervasive northern police brutality created a demand for militant armed self-defense, community-led survival programs, and anti-imperialist solidarity with global third-world liberation fronts.",
    primaryQuote: "“It is a call for Black people in this country to unite, to recognize their heritage, to build a sense of community. It is a call for Black people to define their own goals, to lead their own organizations.” — Stokely Carmichael (Kwame Ture), 1966",
    theoreticalSynthesis: "Black Power's spatial traversal demonstrates how grassroots rural electoral symbols can transform into global urban revolutionary iconography, re-framing Black identity from civil rights petitioning to sovereign anti-colonial struggle.",
    cargo: {
      strategy: "Ten-Point Program, Free Breakfast for Children, liberation schools, armed community patrols, and copwatch programs.",
      culture: "Black Panther emblem, black berets, leather jackets, 'The Black Panther' newspaper, and 'Black is Beautiful' aesthetic.",
      spirituality: "Secular revolutionary humanism fused with spiritual resilience and ancestral Maroon resistance memory.",
      vision: "Self-determination, community control of housing and education, international anti-imperialism, and socialism."
    },
    citation: "Draws on C.L.R. James' 'The Black Jacobins' and Stokely Carmichael / Charles V. Hamilton's articulation of Black Power as a systemic critique of domestic colonialism."
  },
  {
    id: 'C',
    name: "Option C: Black Non-Violence Movements",
    darkColor: "#60a5fa",  // Blue
    lightColor: "#2563eb", 
    from: locations.india,
    intermediate: locations.montgomeryATL,
    to: locations.southAfricaNI,
    trajectory: "Gandhian Satyagraha (India) → Fellowship of Reconciliation & CORE / Montgomery Bus Boycott (1955) → SCLC / SNCC Student Movement (Nashville/Atlanta) → Global Anti-Apartheid & Civil Rights Solidarity (South Africa, Northern Ireland).",
    howItTraversed: "African American intellectuals (Howard Thurman, Benjamin Mays, James Lawson) traveled to India to study Gandhian mass resistance, translating those tactical manuals into Black Christian church contexts across the US South, eventually inspiring anti-apartheid movements abroad.",
    whyItArrived: "Non-violent direct action mobilized mass moral witness, utilizing local Black church networks and HBCU student coalitions to disrupt economic revenue streams and expose southern state terror on global television.",
    primaryQuote: "“Nonviolent direct action seeks to create such a crisis and foster such a tension that a community which has constantly refused to negotiate is forced to confront the issue.” — Dr. Martin Luther King Jr., 1963",
    theoreticalSynthesis: "Non-violent direct action adapted as it traversed: Gandhian Satyagraha was reframed through Black Christian liberation theology into an active, coercive economic weapon capable of forcing legislative collapse.",
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
    darkColor: "#f472b6",  // Pink
    lightColor: "#db2777", 
    from: locations.abolitionistRoots,
    intermediate: locations.bostonCRC,
    to: locations.globalFeminism,
    trajectory: "Black Women's Club Movement & Abolitionist Roots (Sojourner Truth, Ida B. Wells) → Combahee River Collective (Boston, 1974) → Third World Women's Alliance → Global Transnational Black Feminism (Afro-Latin American & Caribbean Women's Network).",
    howItTraversed: "Evolved through autonomous study circles, radical feminist manifestos, independent publishing collectives ('Kitchen Table Press'), and international women's conferences across the global South.",
    whyItArrived: "Black women experienced simultaneous exclusion from both white feminist organizations (which ignored race and class) and male-dominated Black nationalist/civil rights groups (which ignored patriarchal domination).",
    primaryQuote: "“If Black women were free, it would mean that everyone else would have to be free since our freedom would necessitate the destruction of all the systems of oppression.” — Combahee River Collective Statement, 1977",
    theoreticalSynthesis: "The global trajectory of Black Feminism demonstrates how localized political exclusion birthed Intersectionality as a master analytical framework, uniting women of color across the Third World against multi-locking oppression.",
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
    darkColor: "#c084fc",  // Purple
    lightColor: "#7c3aed", 
    from: locations.fergusonFL,
    intermediate: locations.usTransnationalNet,
    to: locations.globalProtests,
    trajectory: "Ferguson, Missouri / Sanford, Florida (2012–2014) → Transnational US Network → Global Protests (London, Toronto, Paris, Sydney, Rio de Janeiro).",
    howItTraversed: "Diffused instantaneously via social media algorithms, decentralized digital organizing, and real-time livestreaming, connecting local extrajudicial police killings to global carceral state violence.",
    whyItArrived: "Unpunished police violence and systemic racism catalyzed a new generation of queer-, women-, and youth-led radical organizing that bypassed traditional hierarchical civil rights structures.",
    primaryQuote: "“When Black people get free, everybody gets free. #BlackLivesMatter is an ideological and political intervention in a world where Black lives are systematically targeted for demise.” — Alicia Garza (2014)",
    theoreticalSynthesis: "BLM's rapid digital translation proves that modern political ideas travel without traditional physical headquarters, uniting global struggles against carceral state violence while remaining rooted in local community demands.",
    cargo: {
      strategy: "Social media hashtags (#BlackLivesMatter), decentralized network structures, community bail funds, copwatch, die-ins, and the BREATHE Act.",
      culture: "Mural & street art, digital archiving, viral video documentation, and abolitionist performance art.",
      spirituality: "Ancestral reverence, healing justice, communal grief rituals, and trauma-informed care.",
      vision: "Prison abolition, systemic defunding of policing, reinvestment in Black communities, and global anti-carceral liberation."
    },
    citation: "Connects contemporary abolitionist horizons (Ruth Wilson Gilmore, Angela Davis) to historical freedom dreams and anti-carceral geographies."
  }
];

// Custom component to render thick, high-visibility animated directional arrows along polylines
function AnimatedTrajectoryArrows({ startCoords, endCoords, color, isSelected }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % 28);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <Polyline
      positions={[startCoords, endCoords]}
      pathOptions={{
        color: color,
        weight: isSelected ? 5 : 3,
        dashArray: '12, 12',
        dashOffset: `-${offset}`,
        opacity: isSelected ? 0.95 : 0.65,
        zIndexOffset: 100
      }}
    />
  );
}

export default function App() {
  const [mapTheme, setMapTheme] = useState('dark');
  const [visibleMovements, setVisibleMovements] = useState({ A: true, B: true, C: true, D: true, E: true });
  const [hudHeight, setHudHeight] = useState('medium'); // 'compact', 'medium', 'full'

  const isDarkMode = mapTheme === 'dark';

  // Map movements with dynamic color based on active theme
  const movementData = rawMovementData.map(mov => ({
    ...mov,
    color: isDarkMode ? mov.darkColor : mov.lightColor
  }));

  const [activeMovement, setActiveMovement] = useState(movementData[0]);

  // Sync active movement color when mapTheme changes
  useEffect(() => {
    const current = movementData.find(m => m.id === activeMovement.id);
    if (current) setActiveMovement(current);
  }, [mapTheme]);

  // Free public tile URLs requiring no API keys
  const tileUrls = {
    light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
  };

  const toggleVisibility = (id) => {
    setVisibleMovements(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const hudHeightClasses = {
    compact: 'h-[25vh]',
    medium: 'h-[50vh]',
    full: 'h-[92vh]'
  };

  // Theme-aware tailwind utility classes for VS Code Smoky Dark Grey aesthetic
  const themeClasses = {
    bgApp: isDarkMode ? 'bg-[#181818] text-[#cccccc]' : 'bg-[#f8fafc] text-[#0f172a]',
    headerBg: isDarkMode ? 'bg-[#1e1e1e]/95 border-[#3c3c3c] text-[#cccccc]' : 'bg-white/95 border-[#e2e8f0] text-[#0f172a] shadow-xl',
    headerTitle: isDarkMode ? 'text-[#34d399]' : 'text-emerald-700',
    hudBg: isDarkMode ? 'bg-[#1e1e1e]/95 border-[#3c3c3c] text-[#cccccc]' : 'bg-white/95 border-[#e2e8f0] text-[#0f172a] shadow-2xl',
    hudHandleBg: isDarkMode ? 'bg-[#181818]/90 hover:bg-[#2d2d2d]/90 border-[#3c3c3c]' : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] border-[#cbd5e1]',
    hudTitle: isDarkMode ? 'text-[#ffffff]' : 'text-[#0f172a]',
    cardBg: isDarkMode ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-[#f8fafc] border-[#cbd5e1] shadow-sm',
    sidebarBg: isDarkMode ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-[#f8fafc] border-[#cbd5e1] shadow-sm',
    btnInactive: isDarkMode ? 'bg-[#2d2d2d] border-[#3c3c3c] text-[#cccccc] hover:bg-[#383838]' : 'bg-white border-[#cbd5e1] text-[#334155] hover:bg-[#f1f5f9] shadow-sm',
    btnActive: isDarkMode ? 'bg-[#007acc] border-[#007acc] text-white ring-2 ring-[#007acc]/40' : 'bg-[#0f172a] border-emerald-600 text-white ring-2 ring-emerald-600/30',
    textMuted: isDarkMode ? 'text-[#9d9d9d]' : 'text-[#64748b]',
    textMain: isDarkMode ? 'text-[#cccccc]' : 'text-[#0f172a]'
  };

  return (
    <div className={`w-screen h-screen flex flex-col font-sans overflow-hidden relative transition-colors duration-300 ${themeClasses.bgApp}`}>
      
      {/* Top Banner Navigation */}
      <header className={`absolute top-3 left-3 right-3 z-[1000] p-4 rounded-xl backdrop-blur-md flex flex-wrap justify-between items-center transition-colors duration-300 border ${themeClasses.headerBg}`}>
        <div className="flex items-center space-x-3.5">
          <Compass className={`w-8 h-8 animate-pulse flex-shrink-0 ${isDarkMode ? 'text-[#34d399]' : 'text-emerald-600'}`} />
          <div>
            <h1 className={`text-lg sm:text-xl font-black tracking-wide ${themeClasses.headerTitle}`}>Black Studies Movement Map</h1>
            <p className={`text-sm sm:text-base ${themeClasses.textMuted}`}>Guiding Question: <span className="text-amber-400 italic font-bold">What happens to a political idea when it travels?</span></p>
          </div>
        </div>

        {/* Top Navigation Buttons */}
        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          <button
            onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
            className={`px-4 py-2.5 rounded-lg text-sm font-extrabold flex items-center gap-2 transition-colors shadow-md border ${
              isDarkMode 
                ? 'bg-[#2d2d2d] hover:bg-[#383838] border-[#3c3c3c] text-amber-300' 
                : 'bg-[#1e293b] hover:bg-[#0f172a] border-[#334155] text-amber-300'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-300" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          {movementData.map((mov) => (
            <button
              key={mov.id}
              onClick={() => setActiveMovement(mov)}
              className={`px-4 py-2.5 rounded-lg text-sm font-black transition-all flex items-center gap-2 border ${
                activeMovement.id === mov.id ? themeClasses.btnActive : themeClasses.btnInactive
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: mov.color }}></span>
              {mov.id}
            </button>
          ))}
        </div>
      </header>

      {/* Interactive Leaflet Map Canvas */}
      <div className="w-full h-full z-0">
        <MapContainer center={[20, -20]} zoom={3} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <TileLayer 
            key={mapTheme}
            url={tileUrls[mapTheme]} 
            attribution={isDarkMode ? '&copy; Esri' : '&copy; OpenStreetMap contributors'} 
          />

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
                  zIndexOffset={isSelected ? 1000 : 500}
                  icon={createSimplePinIcon(mov.color, mov.from.name, isSelected, isDarkMode)}
                  eventHandlers={{ click: () => setActiveMovement(mov) }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-3 text-sm text-slate-900 font-sans">
                      <strong className="text-emerald-700 font-black text-base">{mov.from.name} (Origin)</strong>
                      <p className="mt-1 font-extrabold text-slate-900">{mov.name}</p>
                      <p className="mt-1.5 text-slate-800 leading-relaxed text-sm"><strong>Strategy:</strong> {mov.cargo.strategy}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Intermediate Pin */}
                <Marker
                  position={mov.intermediate.coords}
                  zIndexOffset={isSelected ? 1000 : 500}
                  icon={createSimplePinIcon(mov.color, mov.intermediate.name, isSelected, isDarkMode)}
                  eventHandlers={{ click: () => setActiveMovement(mov) }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-3 text-sm text-slate-900 font-sans">
                      <strong className="text-amber-700 font-black text-base">{mov.intermediate.name} (Node)</strong>
                      <p className="mt-1 font-extrabold text-slate-900">{mov.name}</p>
                      <p className="mt-1.5 text-slate-800 leading-relaxed text-sm"><strong>Culture:</strong> {mov.cargo.culture}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Destination Pin */}
                <Marker
                  position={mov.to.coords}
                  zIndexOffset={isSelected ? 1000 : 500}
                  icon={createSimplePinIcon(mov.color, mov.to.name, isSelected, isDarkMode)}
                  eventHandlers={{ click: () => setActiveMovement(mov) }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-3 text-sm text-slate-900 font-sans">
                      <strong className="text-sky-700 font-black text-base">{mov.to.name} (Destination)</strong>
                      <p className="mt-1 font-extrabold text-slate-900">{mov.name}</p>
                      <p className="mt-1.5 text-slate-800 leading-relaxed text-sm"><strong>Vision:</strong> {mov.cargo.vision}</p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      {/* Resizable HUD Dashboard Card at Bottom */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] w-[96%] max-w-7xl border rounded-2xl shadow-2xl backdrop-blur-md flex flex-col transition-all duration-300 ease-in-out ${themeClasses.hudBg} ${hudHeightClasses[hudHeight]}`}>
        
        {/* HUD Top Pull/Drag Handle */}
        <div className={`w-full py-3.5 px-6 rounded-t-2xl flex items-center justify-between cursor-pointer select-none transition-colors border-b ${themeClasses.hudHandleBg}`}
             onClick={() => setHudHeight(hudHeight === 'compact' ? 'medium' : hudHeight === 'medium' ? 'full' : 'compact')}>
          <div className="flex items-center space-x-3.5">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: activeMovement.color }}></span>
            <span className={`text-base sm:text-lg font-black uppercase tracking-wider ${themeClasses.hudTitle}`}>{activeMovement.name}</span>
          </div>
          
          <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-full border shadow-sm ${isDarkMode ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-white border-[#cbd5e1]'}`}>
            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-[#34d399]' : 'text-emerald-600'}`} />
            <span className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider ${themeClasses.textMain}`}>
              {hudHeight === 'compact' ? 'Pull Up for Details' : hudHeight === 'medium' ? 'Expand Full View' : 'Collapse HUD'}
            </span>
            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-[#34d399]' : 'text-emerald-600'}`} />
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setHudHeight('compact'); }}
              className={`px-3 py-1 rounded text-xs sm:text-sm font-black ${hudHeight === 'compact' ? 'bg-[#007acc] text-white' : themeClasses.btnInactive}`}
            >Min</button>
            <button 
              onClick={(e) => { e.stopPropagation(); setHudHeight('medium'); }}
              className={`px-3 py-1 rounded text-xs sm:text-sm font-black ${hudHeight === 'medium' ? 'bg-[#007acc] text-white' : themeClasses.btnInactive}`}
            >Mid</button>
            <button 
              onClick={(e) => { e.stopPropagation(); setHudHeight('full'); }}
              className={`px-3 py-1 rounded text-xs sm:text-sm font-black ${hudHeight === 'full' ? 'bg-[#007acc] text-white' : themeClasses.btnInactive}`}
            >Max</button>
          </div>
        </div>

        {/* HUD Content Area */}
        <div className="flex-1 p-6 sm:p-7 overflow-y-auto flex flex-col md:flex-row gap-6 sm:gap-8">
          
          {/* Layer Controls Panel (Left Side) */}
          <div className={`w-full md:w-80 border p-5 rounded-xl flex flex-col justify-between flex-shrink-0 ${themeClasses.sidebarBg}`}>
            <div>
              <h3 className={`text-sm sm:text-base font-black uppercase tracking-wider mb-3 flex items-center gap-2.5 ${isDarkMode ? 'text-[#34d399]' : 'text-emerald-700'}`}>
                <Layers className={`w-5 h-5 ${isDarkMode ? 'text-[#34d399]' : 'text-emerald-600'}`} /> Trajectory Layers:
              </h3>
              <p className={`text-xs sm:text-sm mb-4 font-semibold ${themeClasses.textMuted}`}>Toggle movement lines on/off:</p>
              <div className="space-y-2.5">
                {movementData.map((m) => {
                  const isVisible = visibleMovements[m.id];
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleVisibility(m.id)}
                      className={`w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold flex items-center justify-between transition-all border ${
                        isVisible
                          ? isDarkMode ? 'bg-[#2d2d2d] border-[#007acc] text-white shadow-sm' : 'bg-white border-emerald-600 text-slate-900 shadow-md'
                          : isDarkMode ? 'bg-[#181818]/60 border-[#3c3c3c] text-[#717171]' : 'bg-slate-200/60 border-[#cbd5e1] text-slate-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate pr-1">
                        <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }}></span>
                        <span className="truncate">{m.id}: {m.name.split(':')[1] || m.name}</span>
                      </div>
                      {isVisible ? <Eye className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-[#34d399]' : 'text-emerald-600'}`} /> : <EyeOff className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className={`mt-5 pt-3 border-t text-xs sm:text-sm font-bold text-center ${isDarkMode ? 'border-[#3c3c3c] text-[#9d9d9d]' : 'border-[#e2e8f0] text-slate-500'}`}>
              Click map pins to inspect cargo details
            </div>
          </div>

          {/* Extended Analytical Content Columns */}
          <div className="flex-1 space-y-6">
            
            {/* Primary Top Row: Historical Mechanics & Traveling Cargo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Historical Mechanics */}
              <div className={`p-5 sm:p-6 rounded-xl border space-y-3.5 ${themeClasses.cardBg}`}>
                <h3 className={`font-black flex items-center gap-2.5 uppercase text-sm sm:text-base tracking-wider ${isDarkMode ? 'text-[#34d399]' : 'text-emerald-700'}`}>
                  <Sparkles className="w-5 h-5" /> Historical Traversal & Mechanics
                </h3>
                <p className={`text-base sm:text-lg leading-relaxed ${themeClasses.textMain}`}>
                  <strong className={isDarkMode ? 'text-[#a7f3d0] font-bold' : 'text-emerald-800 font-bold'}>How It Traversed:</strong> {activeMovement.howItTraversed}
                </p>
                <p className={`text-base sm:text-lg leading-relaxed pt-1 ${themeClasses.textMain}`}>
                  <strong className={isDarkMode ? 'text-[#a7f3d0] font-bold' : 'text-emerald-800 font-bold'}>Why It Arrived:</strong> {activeMovement.whyItArrived}
                </p>
              </div>

              {/* Traveling Cargo */}
              <div className={`p-5 sm:p-6 rounded-xl border space-y-3.5 ${themeClasses.cardBg}`}>
                <h3 className={`font-black flex items-center gap-2.5 uppercase text-sm sm:text-base tracking-wider ${isDarkMode ? 'text-[#fbbf24]' : 'text-amber-700'}`}>
                  <Anchor className="w-5 h-5" /> Traveling Cargo
                </h3>
                <p className={`text-base sm:text-lg leading-relaxed ${themeClasses.textMain}`}>
                  <strong className={isDarkMode ? 'text-[#fef08a] font-bold' : 'text-amber-800 font-bold'}>Tactics & Strategy:</strong> {activeMovement.cargo.strategy}
                </p>
                <p className={`text-base sm:text-lg leading-relaxed ${themeClasses.textMain}`}>
                  <strong className={isDarkMode ? 'text-[#fef08a] font-bold' : 'text-amber-800 font-bold'}>Culture & Aesthetics:</strong> {activeMovement.cargo.culture}
                </p>
                <p className={`text-base sm:text-lg leading-relaxed ${themeClasses.textMain}`}>
                  <strong className={isDarkMode ? 'text-[#fef08a] font-bold' : 'text-amber-800 font-bold'}>Spirituality:</strong> {activeMovement.cargo.spirituality}
                </p>
              </div>

            </div>

            {/* EXPANDED CONTENT (VISIBLE IN MID & FULL HUD): Primary Source Voices & Geographic Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Primary Source Quote Box */}
              <div className={`p-5 sm:p-6 rounded-xl border space-y-3.5 ${themeClasses.cardBg}`}>
                <h3 className={`font-black flex items-center gap-2.5 uppercase text-sm sm:text-base tracking-wider ${isDarkMode ? 'text-[#38bdf8]' : 'text-sky-700'}`}>
                  <Quote className="w-5 h-5" /> Primary Source Voice
                </h3>
                <p className={`text-base sm:text-lg italic leading-relaxed border-l-4 border-[#38bdf8] pl-4 py-2 rounded-r-lg font-medium ${isDarkMode ? 'bg-[#181818]/90 text-[#f1f5f9]' : 'bg-sky-50 text-slate-800'}`}>
                  {activeMovement.primaryQuote}
                </p>
              </div>

              {/* Spatial Trajectory Node Timeline */}
              <div className={`p-5 sm:p-6 rounded-xl border space-y-3.5 ${themeClasses.cardBg}`}>
                <h3 className={`font-black flex items-center gap-2.5 uppercase text-sm sm:text-base tracking-wider ${isDarkMode ? 'text-[#818cf8]' : 'text-indigo-700'}`}>
                  <Navigation className="w-5 h-5" /> Geographic Node Timeline
                </h3>
                <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm pt-1">
                  <div className={`p-3 rounded-lg border shadow-inner ${isDarkMode ? 'bg-[#181818] border-[#3c3c3c]' : 'bg-white border-[#cbd5e1]'}`}>
                    <span className={`font-extrabold block mb-1 text-sm ${isDarkMode ? 'text-[#34d399]' : 'text-emerald-700'}`}>1. Genesis:</span>
                    <span className={`font-bold text-sm sm:text-base ${themeClasses.textMain}`}>{activeMovement.from.name}</span>
                  </div>
                  <div className={`p-3 rounded-lg border shadow-inner ${isDarkMode ? 'bg-[#181818] border-[#3c3c3c]' : 'bg-white border-[#cbd5e1]'}`}>
                    <span className={`font-extrabold block mb-1 text-sm ${isDarkMode ? 'text-[#fbbf24]' : 'text-amber-700'}`}>2. Vector:</span>
                    <span className={`font-bold text-sm sm:text-base ${themeClasses.textMain}`}>{activeMovement.intermediate.name}</span>
                  </div>
                  <div className={`p-3 rounded-lg border shadow-inner ${isDarkMode ? 'bg-[#181818] border-[#3c3c3c]' : 'bg-white border-[#cbd5e1]'}`}>
                    <span className={`font-extrabold block mb-1 text-sm ${isDarkMode ? 'text-[#38bdf8]' : 'text-sky-700'}`}>3. Horizon:</span>
                    <span className={`font-bold text-sm sm:text-base ${themeClasses.textMain}`}>{activeMovement.to.name}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* EXPANDED CONTENT (VISIBLE IN FULL HUD): Core Analytical Synthesis */}
            {hudHeight === 'full' && (
              <div className={`p-5 sm:p-6 rounded-xl border space-y-3 shadow-lg ${isDarkMode ? 'bg-[#1e1e1e]/95 border-[#007acc]/60' : 'bg-emerald-50/80 border-emerald-300'}`}>
                <h3 className={`font-black flex items-center gap-2.5 uppercase text-sm sm:text-base tracking-wider ${isDarkMode ? 'text-[#34d399]' : 'text-emerald-800'}`}>
                  <Compass className="w-5 h-5" /> Theoretical Synthesis & Guiding Analysis
                </h3>
                <p className={`text-base sm:text-lg leading-relaxed italic font-medium ${themeClasses.textMain}`}>
                  "{activeMovement.theoreticalSynthesis}"
                </p>
              </div>
            )}

            {/* Course Citation Box */}
            <div className={`p-5 rounded-xl border ${themeClasses.cardBg}`}>
              <h3 className={`font-black flex items-center gap-2.5 uppercase text-sm sm:text-base tracking-wider mb-2 ${isDarkMode ? 'text-[#c084fc]' : 'text-purple-700'}`}>
                <BookOpen className="w-5 h-5" /> Course Reading Integration
              </h3>
              <p className={`text-base sm:text-lg italic leading-relaxed font-medium ${themeClasses.textMuted}`}>
                "{activeMovement.citation}"
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}