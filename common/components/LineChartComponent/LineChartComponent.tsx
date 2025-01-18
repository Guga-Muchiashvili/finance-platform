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

// Define types for the props
interface LineChartProps {
  datas: { label: string; data: number[] }[] | undefined;
  label: string[] | undefined;
}

const LineChartComponent: React.FC<LineChartProps> = ({ datas, label }) => {
  const defaultData = [
    { label: "Default Data", data: [10, 20, 30, 40, 50, 60] },
  ];

  const data = {
    labels: label,
    datasets: (datas || defaultData).map((item, i: number) => ({
      label: item.label || "Default Label",
      data: item.data || [0, 0, 0, 0, 0, 0],
      borderColor: i == 0 ? "rgb(37,99,235)" : "#ee6c4d",
      backgroundColor: i == 0 ? "rgb(37,99,235)" : "#ee6c4d",
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: i == 0 ? "rgb(37,99,235)" : "#ee6c4d",
    })),
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
