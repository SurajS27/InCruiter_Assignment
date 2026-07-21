import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTelemetryStore } from '../../../store/useTelemetryStore';
import { telemetryExporter } from '../services/TelemetryExporter';
import { usePathname } from 'next/navigation';
import {
  Terminal,
  Activity,
  Layers,
  Search,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Minimize2,
  Maximize2,
  Filter,
  Play,
  Pause,
  Clock,
  Layout,
} from 'lucide-react';
import { Card } from '../../../components/ui/card';

export const TelemetryConsole: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  // Dimensions (Resizable state)
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(550);
  const isResizingRef = useRef(false);

  const streamEndRef = useRef<HTMLDivElement>(null);

  const {
    events,
    statistics,
    browserState,
    windowState,
    focusState,
    networkState,
    visibilityState,
    clearEvents,
  } = useTelemetryStore();

  const currentRoute = usePathname();

  // Categories list for filtering
  const categories = ['All', 'Browser', 'Window', 'Visibility', 'Keyboard', 'Clipboard', 'Mouse', 'Network', 'System', 'Interview'];
  const sources = ['All', 'BrowserTelemetry', 'Interview', 'Camera', 'MediaPipe', 'Speech', 'RiskEngine', 'System'];
  const severities = ['All', 'info', 'warning', 'error'];

  // Handle Resize Mouse Events
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = Math.max(380, Math.min(800, window.innerWidth - e.clientX));
    const newHeight = Math.max(300, Math.min(800, window.innerHeight - e.clientY));
    setWidth(newWidth);
    setHeight(newHeight);
  };

  const stopResize = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  // Buffer events to allow pausing the live stream display
  const [displayedEvents, setDisplayedEvents] = useState(events);
  useEffect(() => {
    if (!isPaused) {
      setDisplayedEvents(events);
    }
  }, [events, isPaused]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return displayedEvents.filter((event) => {
      const matchesSearch =
        event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        JSON.stringify(event.payload).toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      const matchesSource = selectedSource === 'All' || event.source === selectedSource;
      const matchesSeverity = selectedSeverity === 'All' || event.severity === selectedSeverity;

      return matchesSearch && matchesCategory && matchesSource && matchesSeverity;
    });
  }, [displayedEvents, searchQuery, selectedCategory, selectedSource, selectedSeverity]);

  // Scroll to bottom
  useEffect(() => {
    if (autoScroll && streamEndRef.current) {
      streamEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredEvents, autoScroll]);

  // Check if we are in production to completely hide from real users
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-14 right-6 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-violet-500/30 bg-zinc-950 text-violet-400 hover:text-violet-300 font-extrabold text-xs tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Terminal className="w-4 h-4 animate-pulse" />
        <span>TELEMETRY CONSOLE</span>
      </button>
    );
  }

  return (
    <Card
      style={{ width: `${width}px`, height: `${height}px` }}
      className="fixed bottom-14 right-6 z-50 border border-zinc-800 bg-zinc-950/98 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden text-zinc-300"
    >
      {/* Resize Handle (Top-Left corner drag area) */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize border-t-2 border-l-2 border-zinc-800 hover:border-violet-500 z-50"
      />

      {/* Header */}
      <header className="px-4 py-3 border-b border-zinc-900 flex items-center justify-between select-none bg-zinc-950">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Telemetry SDK Console
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold font-mono">
            DEV
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded hover:bg-zinc-900 text-xs font-semibold ${
              autoScroll ? 'text-violet-400' : 'text-zinc-500'
            }`}
            title="Auto Scroll"
          >
            {autoScroll ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-1.5 rounded hover:bg-zinc-900 text-xs ${
              isPaused ? 'text-amber-400' : 'text-zinc-500'
            }`}
            title={isPaused ? 'Resume Stream' : 'Pause Stream'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Stats Summary Pane */}
      <section className="grid grid-cols-4 gap-1 p-2 bg-zinc-950 border-b border-zinc-900/60 font-mono text-[9px] text-zinc-400">
        <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
          <span className="text-zinc-600 block">EVENTS</span>
          <span className="font-extrabold text-zinc-200">{statistics.totalEvents}</span>
        </div>
        <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
          <span className="text-zinc-600 block">EPS</span>
          <span className="font-extrabold text-violet-400">{statistics.eventsPerSecond}</span>
        </div>
        <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
          <span className="text-zinc-600 block">FOCUS</span>
          <span className="font-extrabold text-zinc-200">{statistics.focusChanges}</span>
        </div>
        <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
          <span className="text-zinc-600 block">CLIPBOARD</span>
          <span className="font-extrabold text-amber-500">{statistics.clipboardOperations}</span>
        </div>
      </section>

      {/* State View Overlay Panel */}
      <section className="px-4 py-2 border-b border-zinc-900 bg-zinc-950/40 grid grid-cols-2 gap-2 text-[10px] font-mono select-none">
        <div className="space-y-1">
          <div className="flex justify-between border-b border-zinc-900/40 pb-0.5">
            <span className="text-zinc-500">Focus State</span>
            <span className={focusState.focused ? 'text-emerald-400' : 'text-rose-400'}>
              {focusState.focused ? 'FOCUSED' : 'BLURRED'}
            </span>
          </div>
          <div className="flex justify-between border-b border-zinc-900/40 pb-0.5">
            <span className="text-zinc-500">Tab State</span>
            <span className={visibilityState.visible ? 'text-emerald-400' : 'text-rose-400'}>
              {visibilityState.state.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between border-b border-zinc-900/40 pb-0.5">
            <span className="text-zinc-500">Network</span>
            <span className={networkState.online ? 'text-emerald-400' : 'text-rose-400'}>
              {networkState.online ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <div className="flex justify-between border-b border-zinc-900/40 pb-0.5">
            <span className="text-zinc-500">Window size</span>
            <span className="text-zinc-300 font-semibold">{`${windowState.width}x${windowState.height}`}</span>
          </div>
        </div>
      </section>

      {/* Control Bar (Search, Filters, Export) */}
      <div className="p-3 border-b border-zinc-900 bg-zinc-950 flex flex-wrap items-center gap-2 select-none">
        {/* Search */}
        <div className="relative flex-1 min-w-[120px]">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-8 pr-3 py-1.5 border border-zinc-800 bg-zinc-900/50 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-[10px] bg-zinc-900 border border-zinc-800 rounded px-1 py-1 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1.5 ml-auto">
          <button
            onClick={() => telemetryExporter.exportToJSON(events)}
            className="p-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => telemetryExporter.exportToCSV(events)}
            className="p-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold"
            title="Export CSV"
          >
            CSV
          </button>
          <button
            onClick={clearEvents}
            className="p-1.5 rounded border border-zinc-800 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400"
            title="Clear Stream"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stream Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-zinc-950 font-mono text-[9px] leading-relaxed">
        {filteredEvents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600">
            <span>No events matches filters.</span>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isSuspect = event.severity !== 'info';
            return (
              <div
                key={event.id}
                className={`p-2 border rounded-lg ${
                  isSuspect
                    ? 'border-rose-950/40 bg-rose-950/5 text-rose-300'
                    : 'border-zinc-900/60 bg-zinc-900/10 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-zinc-500 font-semibold border-b border-zinc-900/40 pb-1">
                  <span>
                    [{event.id}] {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`px-1 rounded uppercase font-bold text-[8px] ${
                      isSuspect ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {event.category}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-200 uppercase tracking-wide">
                    {event.type}
                  </span>
                </div>
                <div className="mt-1 text-zinc-500 break-all text-[8px]">
                  {JSON.stringify(event.payload)}
                </div>
              </div>
            );
          })
        )}
        <div ref={streamEndRef} />
      </div>

      {/* Current route indicator */}
      <footer className="h-6 px-4 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between text-[8px] text-zinc-600 select-none">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span>Active Session Duration: {statistics.sessionDuration}s</span>
        </div>
        <div className="flex items-center space-x-1">
          <Layout className="w-3 h-3 text-zinc-500" />
          <span>Route: {currentRoute || '/'}</span>
        </div>
      </footer>
    </Card>
  );
});

TelemetryConsole.displayName = 'TelemetryConsole';
export default TelemetryConsole;
