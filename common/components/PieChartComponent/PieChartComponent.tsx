"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  chartData: number[] | undefined;
  label: string[];
}

const PieChartComponent: React.FC<PieChartProps> = ({ chartData, label }) => {
  const data = {
    labels: label,
    datasets: [
      {
        data: chartData,
        backgroundColor: [
          "rgb(37,99,235)", // Blue
          "rgba(54, 162, 235, 0.2)", // Light Blue
          "rgba(255, 206, 86, 0.2)", // Yellow
          "rgb(75, 192, 192)", // Teal
          "rgb(153, 102, 255)", // Purple
          "rgb(255, 159, 64)", // Orange
          "rgb(255, 99, 132)", // Red
          "rgb(255, 193, 7)", // Yellow-Green
          "rgb(0, 123, 255)", // Navy Blue
          "rgb(40, 167, 69)", // Green
        ],
        borderColor: [
          "rgb(37,99,235)", // Blue
          "rgba(54, 162, 235, 1)", // Light Blue
          "rgba(255, 206, 86, 1)", // Yellow
          "rgb(75, 192, 192)", // Teal
          "rgb(153, 102, 255)", // Purple
          "rgb(255, 159, 64)", // Orange
          "rgb(255, 99, 132)", // Red
          "rgb(255, 193, 7)", // Yellow-Green
          "rgb(0, 123, 255)", // Navy Blue
          "rgb(40, 167, 69)", // Green
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
