import React, { FC, useEffect, useState } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "./AdminReport.module.scss";
import axios from "axios";
import { VacationType } from "../../models/Vacation";
import { FaFileCsv } from "react-icons/fa";

interface AdminReportProps {}

const AdminReport: FC<AdminReportProps> = () => {
  ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);
  ChartJS.defaults.font.size = 14;
  ChartJS.defaults.aspectRatio = 16 / 9;
  ChartJS.defaults.layout.padding = 48;
  ChartJS.defaults.datasets.bar.categoryPercentage = 0.4;

  console.log(ChartJS.defaults.aspectRatio);

  const [userData, setUserData] = useState<any[]>([]);

  const getData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/like/all`);
      console.log(response.data);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const vacationLikesCounts = userData.reduce((counts, vacation) => {
    const { destination } = vacation;
    console.log(counts[destination]);
    
    counts[destination] = (counts[destination] || 0) + 1;
    return counts;
  }, {});

  const uniqueUserData = userData.filter((vacation) => vacationLikesCounts[vacation.destination] === 1);

  console.log("Unique User Data:", uniqueUserData);

  const likesCounts = Object.values(vacationLikesCounts);
  // 
  const vacationsDestination = userData.map((vacation: VacationType) => {return (vacation.destination)});
  console.log(vacationsDestination);
  
  const chartData = {
    type: `bar`,
    labels: vacationsDestination,
    datasets: [
      {
        label: "Likes",
        data: likesCounts,
        borderRadius: 12,
        backgroundColor: `#4361ee`,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          color: "#5F7681",
        },
      },
      y: {
        ticks: {
          color: "#4361ee",
          precision: 0,
        },
      },
    },
  };

  const exportCSV = async () => {
    const response = await axios.get(`http://localhost:5000/api/vacations/csv/export`)
    console.log(response);
    
  }

  return (
    <div className={styles.AdminReport}>
      <div className={styles.header}>
        <div className={styles.filterBar}>
          <h2>Admin Reports Dashboard</h2>
          <button className={styles.secondary} onClick={exportCSV}><FaFileCsv /> Export CSV</button>
        </div>
      </div>
      <div className={styles.brief}></div>
      <div className={styles.main}>
        <Bar className={styles.vacationsReportTable} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminReport;
