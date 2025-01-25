"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

interface LineChartProps {
  datas: { label: string; data: number[] }[] | undefined;
  label: string[] | undefined;
}

const colorPalette = [
  "rgb(37,99,235)", // Blue
  "#ee6c4d", // Red
  "#3f51b5", // Indigo
  "#4caf50", // Green
  "#00bcd4", // Cyan
  "#ff9800", // Orange
  "#9c27b0", // Purple
  "#ff5722", // Deep Orange
  "#607d8b", // Blue Grey
  "#8bc34a", // Light Green
  "#f44336", // Red
];

const LineChartComponent: React.FC<LineChartProps> = ({ datas, label }) => {
  const defaultData = [
    { label: "Default Data", data: [10, 20, 30, 40, 50, 60] },
  ];

  const data = {
    labels: label,
    datasets: (datas || defaultData).map((item, i: number) => {
      const colorIndex = i % colorPalette.length;
      const color = colorPalette[colorIndex];

      return {
        label: item.label || "Default Label",
        data: item.data || [0, 0, 0, 0, 0, 0],
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: color,
      };
    }),
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        beginAtZero: false,
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="w-full h-[50vh] flex items-center justify-center">
      <div className="w-full h-full bg-white rounded-xl flex items-center justify-center p-3">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChartComponent;
