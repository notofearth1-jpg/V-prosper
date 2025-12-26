import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Yoga", "Meditation", "Mermu"],
  datasets: [
    {
      label: "# of Sessions",
      data: [50, 25, 25],
      backgroundColor: ["#00E096", "#0095FF", "#7A6DCD"],
      borderWidth: 1,
    },
  ],
};
const PieChart = () => {
  return (
    <div className='w-full md:flex md:justify-center pie'>
      <Pie data={data} />
    </div>
  )
};

export default PieChart;
