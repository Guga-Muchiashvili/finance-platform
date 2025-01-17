"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  chartData: number[] | undefined;
}

const PieChartComponent: React.FC<PieChartProps> = ({ chartData }) => {
  const data = {
    labels: ["Models", "Discord", "Dropshipping"],
    datasets: [
      {
        data: chartData,
        backgroundColor: [
          "rgb(37,99,235)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgb(37,99,235)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="w-full h-[50vh] flex items-center justify-center">
      <div className="w-full h-full bg-white rounded-xl flex items-center justify-center p-3">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChartComponent;
