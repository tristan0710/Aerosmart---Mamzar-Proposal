/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Drone, 
  Scan, 
  Map, 
  AlertTriangle, 
  Trash2, 
  Waves, 
  TreeDeciduous, 
  Flame, 
  FileText, 
  Activity, 
  Users, 
  Car, 
  Ship, 
  Store, 
  Construction, 
  Search,
  ChevronRight,
  Clock,
  DollarSign,
  CheckCircle2,
  Info,
  Wind,
  ShieldAlert,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Data ---

const ALGORITHMS = [
  { id: 1, name: "Parking Utilization", description: "Vehicle count per zone, occupancy %, peak hour analysis, turnover rate", phase: 1, price: 2970, icon: Car },
  { id: 2, name: "Zone Density Analysis", description: "Heatmap by zones, area capacity %, people density (ppl/m2), overcrowding alerts", phase: 2, price: 3375, icon: Users },
  { id: 3, name: "Restricted Zone Intrusion", description: "Polygon-based zone monitoring, person entry detection, real-time alert + incident log. Includes swimming in", phase: 2, price: 3375, icon: ShieldAlert },
  { id: 4, name: "Illegal Structure Detection", description: "Aerial baseline comparison, new unauthorized structure detection, location + visual evidence report", phase: 3, price: 4050, icon: Construction },
  { id: 5, name: "Aerial Asset Monitoring", description: "Asset presence/absence detection, missing or damaged asset flagging and inspection report", phase: 3, price: 3375, icon: Scan },
  { id: 6, name: "Shoreline Tracking", description: "Shoreline contour extraction, historical comparison, advance/retreat measurement. Includes beach erosion & sand movement analysis.", phase: 4, price: 5400, icon: Map },
  { id: 7, name: "Coastal Project Inspection", description: "Aerial survey, baseline comparison, completion % estimate, progress tracking, deviation from plan reporting", phase: 4, price: 4050, icon: Activity },
  { id: 8, name: "People Counting", description: "Zone-based counting beyond FH2 native — heatmap, density, capacity, overcrowding alerts, scheduled patrol", phase: 1, price: 2430, icon: Users },
  { id: 9, name: "Vehicle Detection & Counting", description: "Beach-specific vehicle detection beyond FH2 native — unauthorized vehicles on restricted zones, zone-based counts", phase: 2, price: 2025, icon: Car },
  { id: 10, name: "Boat Detection", description: "Zone-aware vessel detection beyond FH2 native — unauthorized zone entry, vessel type classification", phase: 2, price: 2295, icon: Ship },
  { id: 11, name: "Unauthorized Vendor Detection", description: "Custom model for vendor setups (stalls, umbrellas, carts) in restricted zones, violation alert", phase: 3, price: 3375, icon: Store },
  { id: 12, name: "Trash / Litter Detection", description: "Aerial litter cluster detection, zone-based hotspot mapping, cleanup priority scoring", phase: 4, price: 3375, icon: Trash2 },
  { id: 13, name: "Water Movement Anomaly", description: "Optical flow analysis on water surface, abnormal current/surge pattern detection from drone video", phase: 4, price: 3375, icon: Waves },
  { id: 14, name: "Water Quality Anomaly", description: "Visible anomaly detection — foam, oil slick, discoloration, contamination zone mapping", phase: 4, price: 2700, icon: Activity },
  { id: 15, name: "Tree / Vegetation Damage", description: "Visible damage classification (dead, burned, diseased), affected area mapping from aerial imagery", phase: 5, price: 2700, icon: TreeDeciduous },
  { id: 16, name: "Fire / Smoke Detection", description: "Early fire and smoke detection from drone imagery, location pinpointing, alert generation", phase: 5, price: 2700, icon: Flame },
  { id: 17, name: "Site Documentation & Visual Evidence", description: "Geo-tagged imagery, GPS + timestamp metadata, CSV export, Power BI compatible output", phase: 5, price: 2025, icon: FileText },
  { id: 18, name: "Structural Crack & Defect Detection", description: "Aerial detection of visible surface cracks, corrosion, and structural anomalies. Limited to surface-level defects visible from above.", phase: 5, price: 3375, icon: Construction },
  { id: 19, name: "Animal / Bird Detection", description: "Detection of birds and animals in beach and coastal areas. Repeated activity hotspot mapping, incident logging.", phase: 5, price: 2025, icon: Activity },
];

const RD_ALGORITHMS = [
  { id: 1, name: "Rip Current Detection", description: "Specialized oceanographic modeling, custom dataset collection required. R&D feasibility study to be conducted prior to delivery.", phase: "R&D", price: 9000, icon: Waves },
  { id: 2, name: "Unauthorized Sports Activity", description: "Real-time action recognition pipeline beyond standard object detection. R&D feasibility study to be conducted prior to delivery.", phase: "R&D", price: 7000, icon: Activity },
];

const PHASES = [
  { id: 1, title: "Phase 1", weeks: "Week 1-3", focus: "Advanced People Counting + Parking Utilization + Advanced Vehicle Detection" },
  { id: 2, title: "Phase 2", weeks: "Week 3-6", focus: "Zone Density Analysis + Restricted Zone Intrusion + Advanced Boat Detection" },
  { id: 3, title: "Phase 3", weeks: "Week 6-9", focus: "Illegal Structure Detection + Aerial Asset Monitoring + Unauthorized Vendor Detection" },
  { id: 4, title: "Phase 4", weeks: "Week 9-12", focus: "Shoreline Tracking + Coastal Inspection + Trash Detection + Water Movement + Water Quality" },
  { id: 5, title: "Phase 5", weeks: "Week 12-15", focus: "Vegetation Damage + Fire/Smoke Detection + Site Documentation" },
  { id: "R&D", title: "R&D Phase", weeks: "TBD", focus: "Rip Current Detection + Unauthorized Sports Activity" },
];

const PAYMENT_TERMS = [
  { milestone: "Downpayment + Phase 1", percentage: "60%" },
  { milestone: "Phase 2", percentage: "10%" },
  { milestone: "Phase 3", percentage: "10%" },
  { milestone: "Phase 4", percentage: "10%" },
  { milestone: "Phase 5", percentage: "10%" },
];

// --- Components ---

const StatCard = ({ label, value, subValue, icon: Icon }: { label: string, value: string, subValue?: string, icon: any }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-2"
  >
    <div className="p-3 bg-blue-50 rounded-full text-blue-600 mb-2">
      <Icon size={24} />
    </div>
    <div className="text-3xl font-bold text-slate-900">{value}</div>
    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</div>
    {subValue && <div className="text-xs text-slate-400">{subValue}</div>}
  </motion.div>
);

interface AlgorithmProps {
  key?: React.Key;
  algo: {
    id: number;
    name: string;
    description: string;
    phase: number | string;
    price: number;
    icon: any;
  };
}

const AlgorithmCard = ({ algo }: AlgorithmProps) => {
  const Icon = algo.icon;
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col h-full group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
          algo.phase === 'R&D' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
        }`}>
          Phase {algo.phase}
        </span>
      </div>
      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{algo.name}</h3>
      <p className="text-sm text-slate-500 flex-grow leading-relaxed">{algo.description}</p>
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs font-medium text-slate-400">Price (USD)</span>
        <span className="font-mono font-bold text-slate-900">${algo.price.toLocaleString()}</span>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activePhase, setActivePhase] = useState<number | 'R&D' | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlgorithms = useMemo(() => {
    const all = [...ALGORITHMS, ...RD_ALGORITHMS];
    return all.filter(algo => {
      const matchesPhase = activePhase === 'All' || algo.phase === activePhase;
      const matchesSearch = algo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            algo.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPhase && matchesSearch;
    });
  }, [activePhase, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Drone className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">Aerosmart</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UAV Aerial Solutions</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-500">
            <a href="#algorithms" className="hover:text-blue-600 transition-colors">Algorithms</a>
            <a href="#timeline" className="hover:text-blue-600 transition-colors">Timeline</a>
            <a href="#payment" className="hover:text-blue-600 transition-colors">Terms</a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
              Algorithm Coverage <span className="text-blue-600">&</span> Pricing
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Comprehensive drone-based AI solutions for coastal monitoring, asset management, and public safety.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <Calendar size={16} className="text-blue-600" />
                <span>Prepared: Apr 9, 2026</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <Wind size={16} className="text-blue-600" />
                <span>GPS Waypoint + KML Mapping</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard label="Total Algorithms" value="21" subValue="19 Std + 2 R&D" icon={Activity} />
            <StatCard label="Project Timeline" value="15 Weeks" subValue="Early delivery possible" icon={Clock} />
            <StatCard label="Total Investment" value="$64,800" subValue="Discounted Package" icon={DollarSign} />
            <StatCard label="Maintenance" value="$0" subValue="Until full deployment" icon={ShieldAlert} />
          </div>
        </section>

        {/* Algorithm Explorer */}
        <section id="algorithms" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Algorithm Explorer</h3>
              <p className="text-slate-500">Browse our specialized AI models delivered via drone operations.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search algorithms..."
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
                {['All', 1, 2, 3, 4, 5, 'R&D'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePhase(p as any)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                      activePhase === p 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {p === 'All' ? 'All' : p === 'R&D' ? 'R&D' : `P${p}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredAlgorithms.map((algo) => (
                <AlgorithmCard key={`${algo.phase}-${algo.id}`} algo={algo} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredAlgorithms.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-400" size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900">No algorithms found</h4>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="space-y-12">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-slate-900">Project Timeline</h3>
            <p className="text-slate-500">Phased deployment strategy over 15 weeks.</p>
          </div>

          <div className="relative">
            {/* Vertical Line for Mobile */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 md:hidden"></div>
            
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-5 gap-4">
              {PHASES.filter(p => p.id !== 'R&D').map((phase, idx) => (
                <motion.div 
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-16 md:pl-0 md:pt-8 group"
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 md:-top-3 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm z-10 group-hover:scale-125 transition-transform"></div>
                  
                  {/* Horizontal Line for Desktop */}
                  {idx < 4 && (
                    <div className="hidden md:block absolute top-[-1px] left-1/2 right-[-50%] h-0.5 bg-slate-200"></div>
                  )}

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full hover:border-blue-200 transition-colors">
                    <div className="text-blue-600 font-bold text-sm mb-1">{phase.weeks}</div>
                    <h4 className="text-lg font-black text-slate-900 mb-3">{phase.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{phase.focus}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600 p-3 rounded-2xl text-white">
                <Activity size={24} />
              </div>
              <div>
                <h4 className="font-bold text-purple-900">R&D Phase (TBD)</h4>
                <p className="text-sm text-purple-700">Experimental features requiring specialized oceanographic modeling and feasibility studies.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Estimated Cost</div>
              <div className="text-2xl font-black text-purple-900">$16,000</div>
            </div>
          </div>
        </section>

        {/* Payment Terms & Footer */}
        <section id="payment" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-slate-900">Payment Terms</h3>
              <p className="text-slate-500">Structured milestones to ensure project success.</p>
            </div>
            <div className="space-y-4">
              {PAYMENT_TERMS.map((term, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400">
                      {idx + 1}
                    </div>
                    <span className="font-medium text-slate-700">{term.milestone}</span>
                  </div>
                  <span className="text-lg font-black text-blue-600">{term.percentage}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full"></div>
            
            <div className="space-y-4 relative">
              <h3 className="text-3xl font-bold">Ready to proceed?</h3>
              <p className="text-slate-400">Contact our team to finalize the agreement and begin Phase 1 operations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</div>
                <a href="mailto:sales@aerosmart.ae" className="text-lg font-medium hover:text-blue-400 transition-colors">sales@aerosmart.ae</a>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">WhatsApp</div>
                <a href="tel:+971501576093" className="text-lg font-medium hover:text-blue-400 transition-colors">+971 50 157 6093</a>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Website</div>
                <a href="https://www.aerosmart.ae" target="_blank" className="text-lg font-medium hover:text-blue-400 transition-colors">www.aerosmart.ae</a>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</div>
                <p className="text-sm text-slate-300">203, Al Tayer Commercial Building, Al Raffa, Bur Dubai - Dubai, UAE</p>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 group">
              <span>Accept Proposal</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 opacity-50">
            <Drone size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Aerosmart UAV Trading © 2026</span>
          </div>
          <div className="flex space-x-6 text-xs font-medium text-slate-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
