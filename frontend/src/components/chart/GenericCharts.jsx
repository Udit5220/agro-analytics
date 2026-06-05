import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// 1. Reusable Donut / Pie Chart Component
export const GenericDonutChart = ({
  data,
  dataKey = "value",
  innerRadius = 55,
  outerRadius = 70,
  paddingAngle = 3,
  centerTitle = "Major",
  centerSubtitle = "Cluster",
}) => {
  return (
    <div className="h-44 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || "#cbd5e1"} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute text-center">
        <span className="text-lg font-black text-gray-955 block tracking-tight">
          {centerTitle}
        </span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
          {centerSubtitle}
        </span>
      </div>
    </div>
  );
};

// 2. Reusable Stacked Bar Chart Component
export const GenericStackedBarChart = ({
  data,
  xAxisKey = "month",
  bars = [],
  height = 224,
}) => {
  return (
    <div className="w-full pt-2" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 0, right: 5, left: -25, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
          />
          <Tooltip cursor={{ fill: "#f8fafc" }} />
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.key}
              stackId={bar.stackId || "stack"}
              fill={bar.color}
              radius={bar.radius || [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
