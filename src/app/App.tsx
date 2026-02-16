import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Lightbulb,
  FlaskConical,
  Network,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { AIRecommendations } from "./components/AIRecommendations";
import { WhatIfSimulator } from "./components/WhatIfSimulator";
import { NetworkVisualization } from "./components/NetworkVisualization";
import { PerformanceAnalytics } from "./components/PerformanceAnalytics";

type Page =
  | "dashboard"
  | "ai-recommendations"
  | "simulator"
  | "network"
  | "analytics"
  | "settings";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(
      () => setCurrentTime(new Date()),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      id: "dashboard" as Page,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "ai-recommendations" as Page,
      label: "AI Recommendations",
      icon: Lightbulb,
    },
    {
      id: "simulator" as Page,
      label: "What-If Simulator",
      icon: FlaskConical,
    },
    {
      id: "network" as Page,
      label: "Network Visualization",
      icon: Network,
    },
    {
      id: "analytics" as Page,
      label: "Performance Analytics",
      icon: BarChart3,
    },
    {
      id: "settings" as Page,
      label: "Settings",
      icon: Settings,
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "ai-recommendations":
        return <AIRecommendations />;
      case "simulator":
        return <WhatIfSimulator />;
      case "network":
        return <NetworkVisualization />;
      case "analytics":
        return <PerformanceAnalytics />;
      case "settings":
        return (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Settings
            </h1>
            <p className="text-gray-600">
              System configuration and preferences will be
              available here.
            </p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-64 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col shadow-2xl"
          >
            {/* Logo Section */}
            <div className="p-6 border-b border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">OnTrack</h1>
                  <p className="text-xs text-blue-300">
                    AI Traffic Intelligence
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-blue-800">
              <div className="text-xs text-blue-300 text-center">
                <p>© 2026 OnTrack System</p>
                <p className="mt-1">v2.0.1</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {menuItems.find(
                    (item) => item.id === currentPage,
                  )?.label || "Dashboard"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Live Status Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-sm font-medium text-green-700">
                  System Active
                </span>
              </div>

              {/* Time Display */}
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}