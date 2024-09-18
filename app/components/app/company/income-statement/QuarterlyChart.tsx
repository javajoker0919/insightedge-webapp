import { Bar } from "react-chartjs-2";

const QuarterlyChart = () => {
  const data = {
    labels: ["Apr 2023", "Jul 2023", "Sep 2023", "Dec 2023", "Mar 2024"],
    datasets: [
      {
        label: "Revenue",
        data: [95, 85, 95, 120, 100],
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        barPercentage: 0.5, // Makes the bars thinner
        borderRadius: 5, // Rounds the corners of the bars
      },
      {
        label: "Net Income",
        data: [30, 25, 30, 40, 30],
        backgroundColor: "rgba(255, 206, 86, 0.8)",
        barPercentage: 0.5, // Makes the bars thinner
        borderRadius: 5, // Rounds the corners of the bars
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false, // Removes the x-axis dividing lines
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        max: 150,
        ticks: {
          callback: function (value: any) {
            return value + "B";
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false,
      },
    },
    barThickness: 20, // Sets a fixed width for the bars
    categoryPercentage: 0.8, // Adjusts the space between groups of bars
  };

  return (
    <div style={{ height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default QuarterlyChart;
