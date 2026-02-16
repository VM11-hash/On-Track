import { motion, AnimatePresence } from 'motion/react';
import { Play, AlertTriangle, TrendingUp, Save, GitCompare, Trash2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { mockTrains } from './TrainData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PredefinedScenario {
  id: string;
  title: string;
  description: string;
  delayMinutes: number;
  affectedScope: string;
  trainId?: string;
}

interface SavedScenario {
  id: string;
  name: string;
  affectedTrains: number;
  networkDelay: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  timestamp: Date;
  type: 'predefined' | 'custom';
  description?: string;
}

export function WhatIfSimulator() {
  const [scenarioMode, setScenarioMode] = useState<'predefined' | 'custom'>('predefined');
  const [selectedTrain, setSelectedTrain] = useState(mockTrains[0].id);
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [trackBlockage, setTrackBlockage] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [affectedTrains, setAffectedTrains] = useState(0);
  const [networkDelay, setNetworkDelay] = useState(0);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [currentScenarioType, setCurrentScenarioType] = useState<'predefined' | 'custom'>('custom');

  const [chartData, setChartData] = useState([
    { time: '0 min', delay: 0 },
    { time: '15 min', delay: 0 },
    { time: '30 min', delay: 0 },
    { time: '45 min', delay: 0 },
    { time: '60 min', delay: 0 },
  ]);

  const predefinedScenarios: PredefinedScenario[] = [
    {
      id: 'track-maintenance',
      title: 'Track Maintenance Emergency',
      description: 'Sudden track maintenance requirement on main line',
      delayMinutes: 60,
      affectedScope: 'All',
    },
    {
      id: 'monsoon-impact',
      title: 'Heavy Monsoon Impact',
      description: 'Heavy rainfall affecting multiple routes',
      delayMinutes: 30,
      affectedScope: 'All',
    },
    {
      id: 'vip-priority',
      title: 'VIP Train Priority',
      description: 'Special train requiring immediate priority',
      delayMinutes: 0,
      affectedScope: 'T005',
      trainId: 'TRN-5678',
    },
  ];

  const runPredefinedScenario = (scenario: PredefinedScenario) => {
    const baseAffected = scenario.affectedScope === 'All' ? mockTrains.length : 2;
    const baseNetworkDelay = scenario.delayMinutes * 1.8;

    setAffectedTrains(baseAffected);
    setNetworkDelay(baseNetworkDelay);
    setCurrentScenarioType('predefined');

    // Determine risk level
    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    if (baseNetworkDelay > 50) {
      risk = 'High';
    } else if (baseNetworkDelay > 25) {
      risk = 'Medium';
    }
    setRiskLevel(risk);

    // Generate chart data
    const newChartData = [
      { time: '0 min', delay: 0 },
      { time: '15 min', delay: scenario.delayMinutes * 0.3 },
      { time: '30 min', delay: scenario.delayMinutes * 0.6 },
      { time: '45 min', delay: scenario.delayMinutes * 0.85 },
      { time: '60 min', delay: scenario.delayMinutes },
    ];

    setChartData(newChartData);
    setSimulated(true);
  };

  const runCustomSimulation = () => {
    // Simulate impact based on inputs
    const baseAffected = Math.floor(delayMinutes / 5) + (trackBlockage ? 3 : 0);
    const baseNetworkDelay = delayMinutes * 1.5 + (trackBlockage ? 20 : 0);

    setAffectedTrains(Math.min(baseAffected, mockTrains.length));
    setNetworkDelay(baseNetworkDelay);
    setCurrentScenarioType('custom');

    // Determine risk level
    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    if (baseNetworkDelay > 30 || trackBlockage) {
      risk = 'High';
    } else if (baseNetworkDelay > 15) {
      risk = 'Medium';
    }
    setRiskLevel(risk);

    // Generate chart data
    const newChartData = [
      { time: '0 min', delay: 0 },
      { time: '15 min', delay: delayMinutes * 0.3 },
      { time: '30 min', delay: delayMinutes * 0.6 },
      { time: '45 min', delay: delayMinutes * 0.85 },
      { time: '60 min', delay: delayMinutes },
    ];

    if (trackBlockage) {
      newChartData.forEach(point => {
        point.delay = point.delay * 1.5;
      });
    }

    setChartData(newChartData);
    setSimulated(true);
  };

  const saveCurrentScenario = () => {
    if (!scenarioName.trim()) {
      alert('Please enter a scenario name');
      return;
    }

    const newScenario: SavedScenario = {
      id: `scenario-${Date.now()}`,
      name: scenarioName,
      affectedTrains,
      networkDelay,
      riskLevel,
      timestamp: new Date(),
      type: currentScenarioType,
      description:
        currentScenarioType === 'custom'
          ? `Custom: ${selectedTrain}, ${delayMinutes}min delay${trackBlockage ? ', Track blocked' : ''}`
          : undefined,
    };

    setSavedScenarios([...savedScenarios, newScenario]);
    setShowSavePrompt(false);
    setScenarioName('');
  };

  const deleteScenario = (id: string) => {
    setSavedScenarios(savedScenarios.filter(s => s.id !== id));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskBorderColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'border-red-500';
      case 'Medium':
        return 'border-yellow-500';
      case 'Low':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  // Prepare comparison data
  const comparisonData = savedScenarios.map(scenario => ({
    name: scenario.name.length > 15 ? scenario.name.substring(0, 15) + '...' : scenario.name,
    'Affected Trains': scenario.affectedTrains,
    'Network Delay': scenario.networkDelay,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">What-If Scenario Simulator</h1>
          <p className="text-gray-600 mt-1">Test different scenarios and predict their impact</p>
        </div>
        {savedScenarios.length >= 2 && (
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <GitCompare className="w-5 h-5" />
            {showComparison ? 'Hide' : 'Compare'} Scenarios
          </button>
        )}
      </div>

      {/* Comparison View */}
      <AnimatePresence>
        {showComparison && savedScenarios.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Scenario Comparison</h2>

            {/* Comparison Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Scenario
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Affected Trains
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Network Delay
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Risk Level
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {savedScenarios.map(scenario => (
                    <tr key={scenario.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{scenario.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{scenario.affectedTrains}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {scenario.networkDelay.toFixed(1)} min
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(scenario.riskLevel)}`}>
                          {scenario.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 capitalize">{scenario.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Affected Trains Comparison</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Affected Trains" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Network Delay Comparison</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Network Delay" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Best Scenario Indicator */}
            {savedScenarios.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Best Scenario</p>
                    <p className="text-sm text-green-700">
                      {
                        [...savedScenarios].sort((a, b) => a.networkDelay - b.networkDelay)[0]
                          .name
                      }{' '}
                      has the lowest network delay impact
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Scenario Configuration</h2>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setScenarioMode('predefined')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                scenarioMode === 'predefined'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Predefined
            </button>
            <button
              onClick={() => setScenarioMode('custom')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                scenarioMode === 'custom'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Predefined Scenarios */}
          {scenarioMode === 'predefined' ? (
            <div className="space-y-4">
              {predefinedScenarios.map(scenario => (
                <div
                  key={scenario.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                  onClick={() => runPredefinedScenario(scenario)}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{scenario.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {scenario.delayMinutes}min delay
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {scenario.affectedScope}
                    </span>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const randomScenario =
                    predefinedScenarios[Math.floor(Math.random() * predefinedScenarios.length)];
                  runPredefinedScenario(randomScenario);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mt-4"
              >
                <Play className="w-5 h-5" />
                Run Simulation
              </button>
            </div>
          ) : (
            /* Custom Scenario Controls */
            <div className="space-y-6">
              {/* Select Train */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Train</label>
                <select
                  value={selectedTrain}
                  onChange={e => setSelectedTrain(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {mockTrains.map(train => (
                    <option key={train.id} value={train.id}>
                      {train.id} - {train.route}
                    </option>
                  ))}
                </select>
              </div>

              {/* Adjust Delay */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjust Delay: {delayMinutes} minutes
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={delayMinutes}
                  onChange={e => setDelayMinutes(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 min</span>
                  <span>15 min</span>
                  <span>30 min</span>
                </div>
              </div>

              {/* Track Blockage Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Track Blockage</p>
                  <p className="text-sm text-gray-600">Simulate a blocked track scenario</p>
                </div>
                <button
                  onClick={() => setTrackBlockage(!trackBlockage)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    trackBlockage ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      trackBlockage ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Simulate Button */}
              <button
                onClick={runCustomSimulation}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Play className="w-5 h-5" />
                Run Simulation
              </button>
            </div>
          )}
        </motion.div>

        {/* Right Panel - Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Predicted Impact</h2>
              {simulated && (
                <button
                  onClick={() => setShowSavePrompt(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              )}
            </div>

            {simulated ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Affected Trains</p>
                    <p className="text-2xl font-semibold text-gray-900">{affectedTrains}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Estimated Network Delay</p>
                    <p className="text-2xl font-semibold text-gray-900">{networkDelay.toFixed(1)} min</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(
                        riskLevel
                      )}`}
                    >
                      {riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Run a simulation to see predicted impact</p>
              </div>
            )}
          </div>

          {/* Impact Chart */}
          {simulated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delay Propagation</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="delay"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Saved Scenarios */}
      {savedScenarios.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedScenarios.map(scenario => (
              <div
                key={scenario.id}
                className={`p-4 border-l-4 rounded-lg bg-gray-50 ${getRiskBorderColor(
                  scenario.riskLevel
                )}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                  <button
                    onClick={() => deleteScenario(scenario.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {scenario.description && (
                  <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
                )}
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Trains:</span> {scenario.affectedTrains}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Delay:</span> {scenario.networkDelay.toFixed(1)} min
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(scenario.riskLevel)}`}>
                    {scenario.riskLevel} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Save Scenario Modal */}
      <AnimatePresence>
        {showSavePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSavePrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Save Scenario</h3>
              <input
                type="text"
                value={scenarioName}
                onChange={e => setScenarioName(e.target.value)}
                placeholder="Enter scenario name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={saveCurrentScenario}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSavePrompt(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
