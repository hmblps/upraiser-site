const fs = require('fs');

const svg = `
<svg viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="font-mono text-[11px] uppercase tracking-widest font-semibold">
  
  {/* Mountain Ridges (Subtle Background) */}
  <path d="M150,750 L350,450 L480,250 L500,200 L650,400 L850,650" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
  <path d="M500,200 L550,350 L750,550 L950,750" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
  <path d="M350,450 L200,600 L50,750" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />

  {/* Climbing Routes (Solid Lines) */}
  
  {/* Route 1: Far Left (North Ridge) */}
  <path d="M250,750 Q280,550 330,420 T460,260 L500,200" stroke="currentColor" strokeWidth="4" />
  
  {/* Route 2: Center Left (North Face) */}
  <path d="M380,750 Q410,500 450,380 T500,200" stroke="currentColor" strokeWidth="4" />

  {/* Route 3: Center Right (West Ridge) */}
  <path d="M600,750 Q580,550 540,400 T500,200" stroke="currentColor" strokeWidth="4" />

  {/* Route 4: Far Right (South-West Face) */}
  <path d="M800,750 Q750,500 650,350 T500,200" stroke="currentColor" strokeWidth="4" />

  {/* Connectors / Traverses */}
  <path d="M330,420 Q390,400 450,380" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />
  <path d="M540,400 Q580,360 650,350" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />

  {/* Nodes & Labels */}
  <g className="text-current">
    {/* Summit */}
    <circle cx="500" cy="200" r="10" fill="currentColor"/>
    <text x="500" y="175" textAnchor="middle" className="text-[14px]">THE SUMMIT</text>
    <text x="500" y="190" textAnchor="middle" opacity="0.6" className="text-[10px]">8,848M</text>

    {/* North Ridge Camp */}
    <circle cx="330" cy="420" r="7" fill="currentColor"/>
    <text x="315" y="424" textAnchor="end">NORTH RIDGE</text>
    
    {/* North Col */}
    <circle cx="280" cy="550" r="7" fill="currentColor"/>
    <text x="265" y="554" textAnchor="end">NORTH COL</text>

    {/* North Face Camp */}
    <circle cx="450" cy="380" r="7" fill="currentColor"/>
    <text x="435" y="384" textAnchor="end">CAMP VI</text>

    {/* West Ridge */}
    <circle cx="540" cy="400" r="7" fill="currentColor"/>
    <text x="555" y="404" textAnchor="start">WEST RIDGE</text>

    {/* South Col */}
    <circle cx="650" cy="350" r="7" fill="currentColor"/>
    <text x="665" y="354" textAnchor="start">SOUTH COL</text>

    {/* Ice Fall */}
    <circle cx="705" cy="515" r="7" fill="currentColor"/>
    <text x="720" y="519" textAnchor="start">KHUMBU ICEFALL</text>

    {/* Basecamps */}
    <circle cx="250" cy="750" r="8" fill="currentColor"/>
    <text x="250" y="775" textAnchor="middle">ADVANCED BC</text>

    <circle cx="600" cy="750" r="8" fill="currentColor"/>
    <text x="600" y="775" textAnchor="middle">BASECAMP</text>
  </g>
</svg>
`;

fs.writeFileSync('mountain.svg', svg);
