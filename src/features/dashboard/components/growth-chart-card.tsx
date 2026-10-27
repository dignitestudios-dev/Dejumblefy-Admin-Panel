"use client";

import { useState } from "react";
import { TrendingUp, Users, DollarSign, BarChart2, LineChart, Calendar } from "lucide-react";
import { DashboardUserStatistics, DashboardRevenue } from "../types/dashboard.types";

interface GrowthChartCardProps {
  userStats?: DashboardUserStatistics;
  revenue?: DashboardRevenue;
}

export default function GrowthChartCard({ userStats, revenue }: GrowthChartCardProps) {
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [hoveredUserIdx, setHoveredUserIdx] = useState<number | null>(null);
  const [hoveredRevIdx, setHoveredRevIdx] = useState<number | null>(null);

  const userGrowth = userStats?.growth ?? [];
  const revenueGrowth = revenue?.growth ?? [];

  // If userGrowth has points, use them; if < 2 points, ensure reasonable display
  const userPoints = userGrowth.length > 0 ? userGrowth : [];
  const revenuePoints = revenueGrowth.length > 0 ? revenueGrowth : [];

  const maxUserCount = Math.max(...userPoints.map((p) => p.count), 1);
  const totalUserCount = userPoints.reduce((acc, p) => acc + (p.count || 0), 0);
  const avgUserCount = userPoints.length > 0 ? (totalUserCount / userPoints.length).toFixed(1) : "0";

  const maxRevenueAmount = Math.max(...revenuePoints.map((p) => p.revenue), 1);
  const totalRevenueAmount = revenuePoints.reduce((acc, p) => acc + (p.revenue || 0), 0);

  // SVG Chart dimensions
  const svgWidth = 500;
  const svgHeight = 160;
  const paddingX = 24;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartInnerWidth = svgWidth - paddingX * 2;
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom;

  // Generate SVG coordinates for user growth
  const getUserCoordinates = () => {
    if (userPoints.length === 0) return [];
    if (userPoints.length === 1) {
      return [{ x: svgWidth / 2, y: paddingTop + chartInnerHeight / 2, ...userPoints[0] }];
    }
    const step = chartInnerWidth / (userPoints.length - 1);
    return userPoints.map((pt, idx) => {
      const x = paddingX + idx * step;
      const ratio = pt.count / maxUserCount;
      const y = paddingTop + chartInnerHeight - ratio * chartInnerHeight;
      return { x, y, ...pt };
    });
  };

  const userCoords = getUserCoordinates();

  // Create smooth SVG cubic bezier path
  const createSmoothPath = (coords: Array<{ x: number; y: number }>) => {
    if (coords.length <= 1) return "";
    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = i > 0 ? coords[i - 1] : coords[i];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = i != coords.length - 2 ? coords[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const userLinePath = createSmoothPath(userCoords);
  const userAreaPath =
    userCoords.length > 1
      ? `${userLinePath} L ${userCoords[userCoords.length - 1].x} ${paddingTop + chartInnerHeight} L ${userCoords[0].x} ${paddingTop + chartInnerHeight} Z`
      : "";

  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr.slice(5) || dateStr;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr.slice(5) || dateStr;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* User Growth Interactive Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#000072]/10 text-[#000072]">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">User Registration Growth</h4>
                <p className="text-xs text-slate-500">Interactive trend and new user acquisition</p>
              </div>
            </div>

            {/* View switch & metric */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                <button
                  type="button"
                  onClick={() => setChartType("area")}
                  title="Line / Area View"
                  className={`rounded-md p-1 transition-colors ${
                    chartType === "area"
                      ? "bg-white text-[#000072] shadow-xs"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <LineChart className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setChartType("bar")}
                  title="Bar View"
                  className={`rounded-md p-1 transition-colors ${
                    chartType === "bar"
                      ? "bg-white text-[#000072] shadow-xs"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <TrendingUp className="h-3 w-3" />
                <span>+{userStats?.newUsers ?? totalUserCount} new</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-center">
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Total in Period</div>
              <div className="text-sm font-bold text-slate-900">{totalUserCount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Referred Users</div>
              <div className="text-sm font-bold text-purple-700">{(userStats?.referredUsers ?? 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Peak Daily</div>
              <div className="text-sm font-bold text-[#000072]">{maxUserCount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Daily Average</div>
              <div className="text-sm font-bold text-slate-900">{avgUserCount}</div>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="mt-4 relative">
            {userPoints.length === 0 ? (
              <div className="flex h-44 items-center justify-center text-xs text-slate-400 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                No user registrations recorded in the selected date range.
              </div>
            ) : chartType === "area" ? (
              <div className="relative">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-44 overflow-visible select-none"
                >
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#000072" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#000072" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = paddingTop + chartInnerHeight * (1 - ratio);
                    return (
                      <g key={ratio}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={svgWidth - paddingX}
                          y2={y}
                          stroke="#E2E8F0"
                          strokeDasharray="3 3"
                          strokeWidth="1"
                        />
                        <text
                          x={paddingX - 6}
                          y={y + 3}
                          textAnchor="end"
                          fontSize="9"
                          fill="#94A3B8"
                          className="font-mono font-medium"
                        >
                          {Math.round(maxUserCount * ratio)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area fill */}
                  {userAreaPath && (
                    <path d={userAreaPath} fill="url(#userGrad)" className="transition-all duration-300" />
                  )}

                  {/* Stroke line */}
                  {userLinePath && (
                    <path
                      d={userLinePath}
                      fill="none"
                      stroke="#000072"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Active Hover Crosshair Line */}
                  {hoveredUserIdx !== null && userCoords[hoveredUserIdx] && (
                    <line
                      x1={userCoords[hoveredUserIdx].x}
                      y1={paddingTop}
                      x2={userCoords[hoveredUserIdx].x}
                      y2={paddingTop + chartInnerHeight}
                      stroke="#000072"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Data Points / Interactive Circles */}
                  {userCoords.map((pt, idx) => {
                    const isHovered = hoveredUserIdx === idx;
                    return (
                      <g
                        key={idx}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredUserIdx(idx)}
                        onMouseLeave={() => setHoveredUserIdx(null)}
                      >
                        {/* Transparent hit area */}
                        <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" />

                        {/* Outer pulse when active */}
                        {isHovered && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={8}
                            fill="#000072"
                            fillOpacity="0.2"
                            className="animate-ping"
                          />
                        )}

                        {/* Visible node point */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 5 : 3.5}
                          fill={isHovered ? "#FB7C20" : "#000072"}
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 2.5 : 2}
                          className="transition-all duration-150"
                        />

                        {/* X-axis date labels */}
                        {(idx === 0 ||
                          idx === userCoords.length - 1 ||
                          idx % Math.ceil(userCoords.length / 5) === 0) && (
                          <text
                            x={pt.x}
                            y={paddingTop + chartInnerHeight + 16}
                            textAnchor="middle"
                            fontSize="9"
                            fill="#64748B"
                            className="font-medium"
                          >
                            {formatDateLabel(pt.date)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Tooltip */}
                {hoveredUserIdx !== null && userCoords[hoveredUserIdx] && (
                  <div
                    className="pointer-events-none absolute -top-3 z-10 -translate-x-1/2 transform rounded-xl border border-slate-200 bg-slate-900/95 px-3 py-2 text-white shadow-xl backdrop-blur-xs transition-all duration-150"
                    style={{
                      left: `${(userCoords[hoveredUserIdx].x / svgWidth) * 100}%`,
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-medium border-b border-slate-700/80 pb-1">
                      <Calendar className="h-3 w-3 text-[#FB7C20]" />
                      <span>
                        {userCoords[hoveredUserIdx].date
                          ? new Date(userCoords[hoveredUserIdx].date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : `Point #${hoveredUserIdx + 1}`}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-4">
                      <span className="text-[11px] text-slate-400">Registrations:</span>
                      <span className="text-xs font-bold text-emerald-400">
                        {userCoords[hoveredUserIdx].count.toLocaleString()} users
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Bar Chart View */
              <div className="flex h-44 items-end gap-2 pt-6 px-2">
                {userPoints.map((item, idx) => {
                  const heightPercent = Math.max(Math.round((item.count / maxUserCount) * 100), 8);
                  const isHovered = hoveredUserIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="group relative flex flex-1 flex-col items-center gap-1.5 h-full justify-end cursor-pointer"
                      onMouseEnter={() => setHoveredUserIdx(idx)}
                      onMouseLeave={() => setHoveredUserIdx(null)}
                    >
                      {/* Bar hover tooltip */}
                      {isHovered && (
                        <div className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-md">
                          {item.count} signups ({formatDateLabel(item.date)})
                        </div>
                      )}

                      <span
                        className={`text-[10px] font-semibold transition-colors ${
                          isHovered ? "text-[#000072] font-bold" : "text-slate-500"
                        }`}
                      >
                        {item.count}
                      </span>
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isHovered ? "bg-[#FB7C20]" : "bg-[#000072] hover:bg-[#00005C]"
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="truncate text-[9px] text-slate-400 max-w-[42px]">
                        {formatDateLabel(item.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
          <span>Hover data points to inspect daily registration breakdown</span>
          <span className="font-semibold text-slate-700">Live Telemetry</span>
        </div>
      </div>

      {/* Revenue Growth Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FB7C20]/10 text-[#FB7C20]">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Token Pack Sales</h4>
                <p className="text-xs text-slate-500">Store purchase revenue progression</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-900 rounded-lg bg-slate-100 px-2.5 py-1">
              ${revenue?.total?.toFixed(2) ?? totalRevenueAmount.toFixed(2)} Total
            </span>
          </div>

          {/* Quick Revenue Strip */}
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-center">
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Monthly Revenue</div>
              <div className="text-sm font-bold text-slate-900">${(revenue?.monthly ?? 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Peak Day Revenue</div>
              <div className="text-sm font-bold text-[#FB7C20]">${maxRevenueAmount.toFixed(2)}</div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="mt-4">
            {revenuePoints.length === 0 ? (
              <div className="flex h-44 items-center justify-center text-xs text-slate-400 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                No token package purchases recorded in this period.
              </div>
            ) : (
              <div className="flex h-44 items-end gap-2 pt-6 px-2">
                {revenuePoints.map((item, idx) => {
                  const heightPercent = Math.max(
                    Math.round((item.revenue / maxRevenueAmount) * 100),
                    8
                  );
                  const isHovered = hoveredRevIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="group relative flex flex-1 flex-col items-center gap-1.5 h-full justify-end cursor-pointer"
                      onMouseEnter={() => setHoveredRevIdx(idx)}
                      onMouseLeave={() => setHoveredRevIdx(null)}
                    >
                      {isHovered && (
                        <div className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-md">
                          ${item.revenue.toFixed(2)} ({formatDateLabel(item.date)})
                        </div>
                      )}

                      <span
                        className={`text-[10px] font-semibold transition-colors ${
                          isHovered ? "text-[#FB7C20] font-bold" : "text-slate-500"
                        }`}
                      >
                        ${item.revenue}
                      </span>
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isHovered ? "bg-[#000072]" : "bg-[#FB7C20] hover:bg-[#E86B12]"
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="truncate text-[9px] text-slate-400 max-w-[42px]">
                        {formatDateLabel(item.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
          <span>Purchases from digital token packages</span>
          <span className="font-semibold text-slate-700">Monetization</span>
        </div>
      </div>
    </div>
  );
}

