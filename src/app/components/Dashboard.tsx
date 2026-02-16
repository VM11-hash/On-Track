import { motion } from 'motion/react';
import { Train, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { mockTrains } from './TrainData';
import { useEffect, useState } from 'react';

export function Dashboard() {
  const [trains, setTrains] = useState(mockTrains);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prevTrains =>
        prevTrains.map(train => ({
          ...train,
          speed: Math.max(40, Math.min(100, train.speed + (Math.random() - 0.5) * 10)),
          position: {
            x: (train.position.x + Math.random() * 2) % 100,
            y: (train.position.y + Math.random() * 2) % 100,
          },
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeTrains = trains.length;
  const delayedTrains = trains.filter(t => t.status === 'Delayed' || t.status === 'Critical').length;
  const criticalAlerts = trains.filter(t => t.status === 'Critical').length;
  const avgDelay = trains.reduce((sum, t) => sum + t.delay, 0) / trains.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
        return 'bg-green-500';
      case 'Delayed':
        return 'bg-yellow-500';
      case 'Critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Network Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Active Trains</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{activeTrains}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Train className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Delayed Trains</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{delayedTrains}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">High-Risk Alerts</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{criticalAlerts}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Delay Time</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{avgDelay.toFixed(1)} min</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Live Train Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Live Train Status</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Speed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delay (mins)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trains.map((train, index) => (
                <motion.tr
                  key={train.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {train.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{train.route}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {train.speed.toFixed(0)} km/h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(train.status)}`}></div>
                      <span className="text-sm text-gray-700">{train.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {train.delay > 0 ? train.delay : '—'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Network Grid Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Network Status Map</h2>
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg overflow-hidden">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Animated train dots */}
          {trains.map(train => (
            <motion.div
              key={train.id}
              className="absolute w-4 h-4 rounded-full shadow-lg"
              style={{
                left: `${train.position.x}%`,
                top: `${train.position.y}%`,
              }}
              animate={{
                left: `${train.position.x}%`,
                top: `${train.position.y}%`,
              }}
              transition={{ duration: 3, ease: 'linear' }}
            >
              <div
                className={`w-full h-full rounded-full ${
                  train.status === 'Critical'
                    ? 'bg-red-500'
                    : train.status === 'Delayed'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              >
                <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-current"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
