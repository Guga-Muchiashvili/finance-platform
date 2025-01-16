"use client";
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

const LineChartComponent: React.FC = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [150, 200, 180, 220, 250, 300],
        borderColor: "rgb(37,99,235)",
        backgroundColor: "rgb(37,99,235)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "rgb(37,99,235)",
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
