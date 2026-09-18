import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  TrendingUp,
  Coins,
  Clock,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
  Search,
  Download,
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
  Copy,
  Check,
  Zap,
  DollarSign,
  ShieldAlert,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import { getROIHistory, runROI } from "../../services/roi.service";
import { getInvestments } from "../../services/investment.service";

const ROIHistory = () => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({
    totalROIEarned: 0,
    todayROI: 0,
    activeInvestmentTotal: 0,
    activeInvestmentsCount: 0,
    expectedDailyROI: 0,
    totalReturnsCount: 0,
  });
  const [activeInvestments, setActiveInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [triggeringROI, setTriggeringROI] = useState(false);

  // Filters & Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("history"); // 'history' | 'active_plans'
  const [selectedItem, setSelectedItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [roiRes, invRes] = await Promise.all([
        getROIHistory(),
        getInvestments(),
      ]);

      const rawHistory = roiRes.data.data || [];
      setHistory(rawHistory);

      const allInvs = invRes.data.data || [];
      const activeInvs = allInvs.filter((inv) => inv.status === "Active");
      setActiveInvestments(activeInvs);

      // Extract or calculate summary
      if (roiRes.data.summary) {
        setSummary(roiRes.data.summary);
      } else {
        const totalROIEarned = rawHistory.reduce(
          (sum, item) => sum + (item.amount || 0),
          0
        );
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todayROI = rawHistory
          .filter((h) => new Date(h.createdAt || h.date) >= startOfToday)
          .reduce((sum, h) => sum + (h.amount || 0), 0);

        const activeTotal = activeInvs.reduce(
          (sum, inv) => sum + (inv.amount || 0),
          0
        );
        const expectedDaily = activeInvs.reduce(
          (sum, inv) =>
            sum + ((inv.amount * inv.dailyROIPercentage) / 100),
          0
        );

        setSummary({
          totalROIEarned,
          todayROI,
          activeInvestmentTotal: activeTotal,
          activeInvestmentsCount: activeInvs.length,
          expectedDailyROI: expectedDaily,
          totalReturnsCount: rawHistory.length,
        });
      }

      if (isRefresh) {
        toast.success("ROI data updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ROI data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTriggerROI = async () => {
    try {
      setTriggeringROI(true);
      const res = await runROI();
      toast.success(res.data.message || "Daily ROI processed successfully!");
      await fetchData(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to trigger ROI");
    } finally {
      setTriggeringROI(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Get unique plan names for filtering
  const uniquePlans = useMemo(() => {
    const plans = new Set();
    history.forEach((item) => {
      const name = item.investment?.planName || item.planName;
      if (name) plans.add(name);
    });
    return Array.from(plans);
  }, [history]);

  // Filtered and sorted history
  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        const planName = item.investment?.planName || item.planName || "Investment";
        const id = item._id || "";

        // Search match
        const matchesSearch =
          planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          id.toLowerCase().includes(searchTerm.toLowerCase());

        // Plan filter
        const matchesPlan =
          selectedPlan === "ALL" || planName === selectedPlan;

        // Time filter
        let matchesTime = true;
        const itemDate = new Date(item.createdAt || item.date);
        const now = new Date();

        if (timeFilter === "TODAY") {
          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);
          matchesTime = itemDate >= startOfToday;
        } else if (timeFilter === "WEEK") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          matchesTime = itemDate >= sevenDaysAgo;
        } else if (timeFilter === "MONTH") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          matchesTime = itemDate >= thirtyDaysAgo;
        }

        return matchesSearch && matchesPlan && matchesTime;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") {
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        } else if (sortBy === "OLDEST") {
          return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
        } else if (sortBy === "AMOUNT_HIGH") {
          return (b.amount || 0) - (a.amount || 0);
        } else if (sortBy === "AMOUNT_LOW") {
          return (a.amount || 0) - (b.amount || 0);
        }
        return 0;
      });
  }, [history, searchTerm, selectedPlan, timeFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, currentPage, pageSize]);

  // Total amount in current filtered view
  const filteredTotalAmount = useMemo(() => {
    return filteredHistory.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [filteredHistory]);

  // Export CSV function
  const exportToCSV = () => {
    if (filteredHistory.length === 0) {
      toast.error("No ROI records to export");
      return;
    }

    const headers = [
      "ROI ID",
      "Plan Name",
      "Investment Amount (INR)",
      "Daily ROI (%)",
      "ROI Return Credited (INR)",
      "Credit Date & Time",
      "Status",
    ];

    const rows = filteredHistory.map((item) => [
      `"${item._id}"`,
      `"${item.investment?.planName || item.planName || "Investment"}"`,
      item.investment?.amount || "0",
      `${item.percentage}%`,
      item.amount || "0",
      `"${new Date(item.createdAt || item.date).toLocaleString()}"`,
      "Credited",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ROI_History_Export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("ROI History downloaded as CSV");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <TrendingUp size={24} />
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  ROI History & Daily Earnings
                </h1>
              </div>
              <p className="text-sm text-slate-600 mt-1 pl-11">
                Complete breakdown of all daily Return on Investment (ROI) returns credited automatically to your wallet.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => fetchData(true)}
                disabled={refreshing || loading}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin text-blue-600" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleTriggerROI}
                disabled={triggeringROI || activeInvestments.length === 0}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-white shadow-sm transition-all ${
                  activeInvestments.length === 0
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 active:scale-95"
                }`}
                title={
                  activeInvestments.length === 0
                    ? "Requires an active investment plan"
                    : "Instantly process today's daily ROI"
                }
              >
                <Zap
                  size={16}
                  className={triggeringROI ? "animate-bounce" : ""}
                />
                <span>
                  {triggeringROI ? "Processing..." : "Trigger Daily ROI (Instant)"}
                </span>
              </button>
            </div>
          </div>

          {/* Daily Schedule Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Clock size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Daily ROI Automation</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 size={12} /> Active & Daily
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Automated distribution runs daily at midnight (12:00 AM). Returns are deposited directly into your Wallet Balance.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm self-stretch sm:self-auto justify-between sm:justify-start">
              <span>Expected Daily Rate:</span>
              <span className="text-emerald-400 font-bold text-sm">
                +₹{(summary.expectedDailyROI || 0).toFixed(2)} / day
              </span>
            </div>
          </div>

          {/* Stats Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Total ROI Earned */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total ROI Earned
                </span>
                <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Coins size={20} />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  ₹{(summary.totalROIEarned || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 font-semibold">
                  <TrendingUp size={14} />
                  <span>All-time credited returns</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            </div>

            {/* Today's ROI */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Today's ROI Return
                </span>
                <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Sparkles size={20} />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  +₹{(summary.todayROI || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-blue-600 font-semibold">
                  <Calendar size={14} />
                  <span>Credited today</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            </div>

            {/* Active Capital */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active Capital
                </span>
                <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                  <DollarSign size={20} />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  ₹{(summary.activeInvestmentTotal || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-indigo-600 font-semibold">
                  <Layers size={14} />
                  <span>Across {activeInvestments.length} active plan(s)</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            </div>

            {/* Total Payouts Count */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total ROI Payouts
                </span>
                <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={20} />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {history.length}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-700 font-semibold">
                  <span>Daily payouts credited</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "history"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <TrendingUp size={16} />
              <span>All ROI Returns ({history.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("active_plans")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "active_plans"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Layers size={16} />
              <span>Active Plans Generating ROI ({activeInvestments.length})</span>
            </button>
          </div>

          {/* TAB 1: ALL ROI RETURNS HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {/* Search, Filter and Actions Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 min-w-[240px]">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by plan name or ROI ID..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Plan Filter */}
                  {uniquePlans.length > 0 && (
                    <select
                      value={selectedPlan}
                      onChange={(e) => {
                        setSelectedPlan(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ALL">All Plans</option>
                      {uniquePlans.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Time Filter */}
                  <select
                    value={timeFilter}
                    onChange={(e) => {
                      setTimeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Time</option>
                    <option value="TODAY">Today Only</option>
                    <option value="WEEK">Last 7 Days</option>
                    <option value="MONTH">Last 30 Days</option>
                  </select>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NEWEST">Date: Newest First</option>
                    <option value="OLDEST">Date: Oldest First</option>
                    <option value="AMOUNT_HIGH">Amount: High to Low</option>
                    <option value="AMOUNT_LOW">Amount: Low to High</option>
                  </select>

                  {/* Export Button */}
                  <button
                    onClick={exportToCSV}
                    disabled={filteredHistory.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
                    title="Export CSV"
                  >
                    <Download size={15} />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left divide-y divide-slate-200">
                    <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <tr>
                        <th className="py-3.5 px-4">ROI ID / Date</th>
                        <th className="py-3.5 px-4">Investment Plan</th>
                        <th className="py-3.5 px-4">Capital Amount</th>
                        <th className="py-3.5 px-4">Daily Rate</th>
                        <th className="py-3.5 px-4">Return Credited</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Details</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="text-center py-16">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <RefreshCw
                                size={28}
                                className="animate-spin text-blue-600"
                              />
                              <p className="text-sm font-medium text-slate-600">
                                Loading all ROI returns...
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : paginatedHistory.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-16 px-4 text-center">
                            <div className="max-w-md mx-auto space-y-4">
                              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                                <TrendingUp size={28} />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                  No ROI Returns Found
                                </h3>
                                <p className="text-sm text-slate-600 mt-1">
                                  {searchTerm || selectedPlan !== "ALL" || timeFilter !== "ALL"
                                    ? "No ROI records matched your filter criteria. Try resetting the filters."
                                    : activeInvestments.length > 0
                                    ? "Daily ROI is credited automatically every day at 12:00 AM midnight. You can also trigger an instant payout test below."
                                    : "You don't have any active investment plans yet. Purchase a plan to start earning daily returns."}
                                </p>
                              </div>

                              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                                {activeInvestments.length > 0 ? (
                                  <button
                                    onClick={handleTriggerROI}
                                    disabled={triggeringROI}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                                  >
                                    <Zap size={16} />
                                    <span>
                                      {triggeringROI
                                        ? "Processing ROI..."
                                        : "Trigger Daily ROI Now"}
                                    </span>
                                  </button>
                                ) : (
                                  <Link
                                    to="/investments"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                                  >
                                    <span>View Investment Plans</span>
                                    <ChevronRight size={16} />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedHistory.map((item) => {
                          const planName =
                            item.investment?.planName ||
                            item.planName ||
                            "Investment";
                          const investAmount =
                            item.investment?.amount !== undefined
                              ? item.investment.amount
                              : item.investmentAmount || 0;
                          const id = item._id || "";

                          return (
                            <tr
                              key={item._id}
                              className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                              onClick={() => setSelectedItem(item)}
                            >
                              {/* ID & Date */}
                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  <div className="font-semibold text-slate-900">
                                    {formatDateTime(item.createdAt || item.date)}
                                  </div>
                                  <div
                                    className="inline-flex items-center gap-1 font-mono text-xs text-slate-500 hover:text-blue-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopy(id, id);
                                    }}
                                  >
                                    <span>#{id.slice(-8)}</span>
                                    {copiedId === id ? (
                                      <Check size={12} className="text-emerald-600" />
                                    ) : (
                                      <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Plan Name */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                    {planName.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-900">
                                      {planName}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {item.investment?.status ? (
                                        <span className={`font-medium ${
                                          item.investment.status === "Active"
                                            ? "text-emerald-600"
                                            : "text-slate-500"
                                        }`}>
                                          Plan: {item.investment.status}
                                        </span>
                                      ) : (
                                        "Automated Daily Plan"
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Capital Amount */}
                              <td className="py-4 px-4 font-medium text-slate-700">
                                ₹{Number(investAmount).toLocaleString("en-IN")}
                              </td>

                              {/* Daily Rate */}
                              <td className="py-4 px-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                  {item.percentage}% / day
                                </span>
                              </td>

                              {/* Return Credited */}
                              <td className="py-4 px-4">
                                <div className="inline-flex items-center gap-1 font-bold text-emerald-600 text-base">
                                  <span>+₹</span>
                                  <span>
                                    {Number(item.amount).toLocaleString("en-IN", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </span>
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                  <CheckCircle2 size={12} />
                                  <span>Credited</span>
                                </span>
                              </td>

                              {/* View Action */}
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(item);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View ROI Details"
                                >
                                  <Eye size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer & Pagination */}
                {filteredHistory.length > 0 && (
                  <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                      <span>
                        Showing{" "}
                        <span className="font-bold text-slate-800">
                          {Math.min(
                            (currentPage - 1) * pageSize + 1,
                            filteredHistory.length
                          )}
                        </span>{" "}
                        to{" "}
                        <span className="font-bold text-slate-800">
                          {Math.min(
                            currentPage * pageSize,
                            filteredHistory.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-slate-800">
                          {filteredHistory.length}
                        </span>{" "}
                        returns
                      </span>

                      <span className="hidden md:inline-block text-slate-300">|</span>

                      <span className="hidden md:inline-block font-semibold text-emerald-700">
                        Total Filtered: ₹
                        {filteredTotalAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:outline-none"
                      >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-100 disabled:opacity-40"
                        >
                          Prev
                        </button>
                        <span className="px-2 font-medium text-xs">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage >= totalPages}
                          className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-100 disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE PLANS & DAILY ROI SCHEDULE */}
          {activeTab === "active_plans" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeInvestments.length === 0 ? (
                  <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                      <ShieldAlert size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        No Active Investment Plans
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                        To earn daily ROI returns, choose from our high-yield investment plans.
                      </p>
                    </div>
                    <Link
                      to="/investments"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      <span>Explore Plans</span>
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                ) : (
                  activeInvestments.map((inv) => {
                    const dailyYield =
                      (inv.amount * inv.dailyROIPercentage) / 100;
                    const startDate = new Date(inv.startDate);
                    const endDate = new Date(inv.endDate);
                    const today = new Date();
                    const totalDays = Math.max(
                      1,
                      Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))
                    );
                    const daysPassed = Math.min(
                      totalDays,
                      Math.max(
                        0,
                        Math.round((today - startDate) / (1000 * 60 * 60 * 24))
                      )
                    );
                    const progressPercent = Math.min(
                      100,
                      Math.round((daysPassed / totalDays) * 100)
                    );

                    return (
                      <div
                        key={inv._id}
                        className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4 relative overflow-hidden group hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                              Active Plan
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                              {inv.planName}
                            </h3>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Active
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1 bg-slate-50 p-3 rounded-xl">
                          <div>
                            <span className="text-xs text-slate-500">Invested Capital</span>
                            <p className="font-bold text-slate-900 text-base">
                              ₹{Number(inv.amount).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500">Daily Return</span>
                            <p className="font-bold text-emerald-600 text-base">
                              +₹{dailyYield.toFixed(2)}
                              <span className="text-xs font-medium text-slate-500"> ({inv.dailyROIPercentage}%)</span>
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Plan Timeline</span>
                            <span className="font-semibold text-slate-700">
                              {daysPassed} of {totalDays} Days ({progressPercent}%)
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <div>
                            <span>Starts: </span>
                            <span className="font-medium text-slate-700">
                              {formatDate(inv.startDate)}
                            </span>
                          </div>
                          <div>
                            <span>Expires: </span>
                            <span className="font-medium text-slate-700">
                              {formatDate(inv.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ROI DETAILS MODAL */}
          {selectedItem && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
                <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">ROI Payout Details</h3>
                      <p className="text-xs text-slate-400">
                        Transaction Verification Record
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-emerald-700 uppercase">
                        ROI Credited Amount
                      </span>
                      <div className="text-2xl font-bold text-emerald-800">
                        +₹{Number(selectedItem.amount).toFixed(2)}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                      <CheckCircle2 size={14} /> Credited
                    </span>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Plan Name</span>
                      <span className="font-semibold text-slate-900">
                        {selectedItem.investment?.planName || selectedItem.planName || "Investment Plan"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Invested Capital</span>
                      <span className="font-semibold text-slate-900">
                        ₹{Number(selectedItem.investment?.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Daily Return Rate</span>
                      <span className="font-semibold text-blue-600">
                        {selectedItem.percentage}% / Day
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Credit Date & Time</span>
                      <span className="font-semibold text-slate-900">
                        {formatDateTime(selectedItem.createdAt || selectedItem.date)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">ROI Record ID</span>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <span>{selectedItem._id}</span>
                        <button
                          onClick={() => handleCopy(selectedItem._id, selectedItem._id)}
                          className="text-slate-500 hover:text-blue-600"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                    >
                      Close
                    </button>
                    <Link
                      to="/wallet"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Check Wallet</span>
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ROIHistory;