import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { mockTrains } from './TrainData';

type ViewMode = 'congestion' | 'risk' | 'delay';

export function NetworkVisualization() {
  const [viewMode, setViewMode] = useState<ViewMode>('congestion');
  const [trains, setTrains] = useState(mockTrains);

  // Simulate train movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prevTrains =>
        prevTrains.map(train => ({
          ...train,
          position: {
            x: (train.position.x + (Math.random() - 0.5) * 3) % 100,
            y: (train.position.y + (Math.random() - 0.5) * 3) % 100,
          },
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Network nodes (stations)
  const stations = [
    { id: 'STA-1', name: 'Mumbai Central', x: 20, y: 30, congestion: 'high' },
    { id: 'STA-2', name: 'Delhi Junction', x: 45, y: 25, congestion: 'medium' },
    { id: 'STA-3', name: 'Bangalore Station', x: 65, y: 70, congestion: 'low' },
    { id: 'STA-4', name: 'Chennai Terminal', x: 70, y: 50, congestion: 'medium' },
    { id: 'STA-5', name: 'Kolkata Hub', x: 75, y: 35, congestion: 'high' },
    { id: 'STA-6', name: 'Hyderabad Central', x: 55, y: 55, congestion: 'low' },
  ];

  // Track connections
  const connections = [
    { from: stations[0], to: stations[1] },
    { from: stations[1], to: stations[4] },
    { from: stations[4], to: stations[3] },
    { from: stations[3], to: stations[2] },
    { from: stations[2], to: stations[5] },
    { from: stations[5], to: stations[0] },
  ];

  const getStationColor = (congestion: string) => {
    if (viewMode === 'congestion') {
      switch (congestion) {
        case 'high':
          return 'bg-red-500';
        case 'medium':
          return 'bg-yellow-500';
        case 'low':
          return 'bg-green-500';
        default:
          return 'bg-gray-500';
      }
    } else if (viewMode === 'risk') {
      return congestion === 'high' ? 'bg-red-500' : 'bg-blue-500';
    } else {
      return congestion === 'high' ? 'bg-orange-500' : 'bg-teal-500';
    }
  };

  const getHeatZoneOpacity = (station: { congestion: string }) => {
    if (viewMode === 'congestion' && station.congestion === 'high') return 0.3;
    if (viewMode === 'risk' && station.congestion === 'high') return 0.25;
    if (viewMode === 'delay' && station.congestion === 'medium') return 0.2;
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Network Visualization</h1>
          <p className="text-gray-600 mt-1">Real-time railway network monitoring</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('congestion')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'congestion'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Show Congestion
          </button>
          <button
            onClick={() => setViewMode('risk')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'risk'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Show Risk Zones
          </button>
          <button
            onClick={() => setViewMode('delay')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'delay'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Show Delay Spread
          </button>
        </div>
      </div>

      {/* Network Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-lg overflow-hidden">
          {/* Grid background */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="network-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#network-grid)" />
          </svg>

          {/* Track connections */}
          <svg className="absolute inset-0 w-full h-full">
            {connections.map((conn, index) => (
              <motion.line
                key={index}
                x1={`${conn.from.x}%`}
                y1={`${conn.from.y}%`}
                x2={`${conn.to.x}%`}
                y2={`${conn.to.y}%`}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            ))}
          </svg>

          {/* Heat zones */}
          {stations.map((station, index) => {
            const opacity = getHeatZoneOpacity(station);
            return opacity > 0 ? (
              <motion.div
                key={`heat-${index}`}
                className="absolute rounded-full blur-3xl"
                style={{
                  left: `${station.x}%`,
                  top: `${station.y}%`,
                  width: '200px',
                  height: '200px',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor:
                    viewMode === 'congestion'
                      ? 'rgba(239, 68, 68, 1)'
                      : viewMode === 'risk'
                      ? 'rgba(239, 68, 68, 1)'
                      : 'rgba(251, 146, 60, 1)',
                  opacity,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            ) : null;
          })}

          {/* Station nodes */}
          {stations.map((station, index) => (
            <motion.div
              key={station.id}
              className="absolute"
              style={{
                left: `${station.x}%`,
                top: `${station.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 }}
            >
              {/* Station marker */}
              <div className="relative">
                <div
                  className={`w-4 h-4 rounded-full ${getStationColor(
                    station.congestion
                  )} shadow-lg relative z-10`}
                >
                  <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-current"></div>
                </div>

                {/* Station label */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-900 shadow-md">
                  {station.name}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Moving trains */}
          {trains.map((train, index) => (
            <motion.div
              key={train.id}
              className="absolute"
              style={{
                left: `${train.position.x}%`,
                top: `${train.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                left: `${train.position.x}%`,
                top: `${train.position.y}%`,
              }}
              transition={{ duration: 2, ease: 'linear' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              <div className="relative group">
                <div
                  className={`w-3 h-3 rounded-full shadow-lg ${
                    train.status === 'Critical'
                      ? 'bg-red-400'
                      : train.status === 'Delayed'
                      ? 'bg-yellow-400'
                      : 'bg-green-400'
                  }`}
                ></div>

                {/* Hover tooltip */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-3 py-2 rounded text-xs whitespace-nowrap pointer-events-none z-20">
                  <div className="font-semibold">{train.id}</div>
                  <div className="text-gray-300">{train.route}</div>
                  <div className="text-gray-300">{train.speed.toFixed(0)} km/h</div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-white/95 rounded-lg p-4 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-700">
                  {viewMode === 'congestion'
                    ? 'Low Congestion'
                    : viewMode === 'risk'
                    ? 'Low Risk'
                    : 'Minimal Delay'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-700">
                  {viewMode === 'congestion'
                    ? 'Medium Congestion'
                    : viewMode === 'risk'
                    ? 'Medium Risk'
                    : 'Moderate Delay'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-700">
                  {viewMode === 'congestion'
                    ? 'High Congestion'
                    : viewMode === 'risk'
                    ? 'High Risk'
                    : 'Severe Delay'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
