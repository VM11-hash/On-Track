import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, XCircle, X, Brain, Clock, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { mockRecommendations, AIRecommendation } from './TrainData';

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRec, setSelectedRec] = useState<AIRecommendation | null>(null);

  const handleApprove = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, approved: true } : rec))
    );
    setSuccessMessage('Optimization Applied Successfully');
    setShowSuccess(true);
    setSelectedRec(null);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleOverride = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
    setSuccessMessage('Recommendation Dismissed');
    setShowSuccess(true);
    setSelectedRec(null);
    setTimeout(() => setShowSuccess(false), 3000);
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

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High':
        return <XCircle className="w-5 h-5" />;
      case 'Medium':
        return <AlertCircle className="w-5 h-5" />;
      case 'Low':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-700 bg-red-50';
      case 'Medium':
        return 'text-yellow-700 bg-yellow-50';
      case 'Low':
        return 'text-green-700 bg-green-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">AI-Powered Recommendations</h1>
        <p className="text-gray-600 mt-1">Smart suggestions to optimize railway operations</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
        </motion.div>
      )}

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
              rec.risk === 'High'
                ? 'border-red-500'
                : rec.risk === 'Medium'
                ? 'border-yellow-500'
                : 'border-green-500'
            } ${rec.approved ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{rec.issue}</h3>
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(
                      rec.risk
                    )}`}
                  >
                    {getRiskIcon(rec.risk)}
                    {rec.risk} Risk
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Suggested Action:</span> {rec.action}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Expected Impact:</span> {rec.impact}
                </p>
              </div>
            </div>

            {!rec.approved ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedRec(rec)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  View Analysis
                </button>
                <button
                  onClick={() => handleApprove(rec.id)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleOverride(rec.id)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Override
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Applied</span>
              </div>
            )}
          </motion.div>
        ))}

        {recommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-12 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Clear!</h3>
            <p className="text-gray-600">No recommendations at the moment. System running optimally.</p>
          </motion.div>
        )}
      </div>

      {/* Analysis Modal */}
      <AnimatePresence>
        {selectedRec && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRec(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Brain className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold">Recommendation Analysis</h2>
                  </div>
                  <button
                    onClick={() => setSelectedRec(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedRec.action}</h3>
                  <p className="text-gray-600">{selectedRec.issue}</p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Impact:</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedRec.detailedImpact}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Time to Implement:</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedRec.timeToImplement}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Confidence:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-gray-900">{selectedRec.confidence}%</p>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${selectedRec.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Priority:</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
                        selectedRec.priority
                      )}`}
                    >
                      {selectedRec.priority}
                    </span>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">AI Reasoning</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedRec.reasoning.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Affected Trains */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Affected Trains</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRec.affectedTrains.map(train => (
                      <span
                        key={train}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {train}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedRec.id)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Approve Recommendation
                  </button>
                  <button
                    onClick={() => handleOverride(selectedRec.id)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Override
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
