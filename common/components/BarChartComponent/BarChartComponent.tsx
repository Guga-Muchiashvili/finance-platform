"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChartComponent: React.FC = () => {
  const data = {
    labels: ["Models", "Discord", "Dropshipping"],
    datasets: [
      {
        data: [3434, 280, 0],
        backgroundColor: ["rgb(37,99,235)", "rgb(37,99,235)", "rgb(37,99,235)"],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-[50vh] flex items-center justify-center rounded-lg">
      <div className="w-full h-full px-2 bg-white rounded-xl flex items-center justify-center p-3">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChartComponent;
