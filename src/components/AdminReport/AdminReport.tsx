import React, { FC, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "./AdminReport.module.scss";
import { FaFileCsv } from "react-icons/fa";
import instance from "../../api/AxiosInstance";
import { useResponsive } from "../../styles/responsive/useResponsive";

interface AdminReportProps {}

const AdminReport: FC<AdminReportProps> = () => {
  ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);
  const responsive = useResponsive();
  const { isMobile } = responsive;


  const [userData, setUserData] = useState<any[]>([]);

  const getData = async () => {
    try {
      const response = await instance.get(`/like/all`);
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

    counts[destination] = (counts[destination] || 0) + 1;
    return counts;
  }, {});

  const likesCounts = Object.values(vacationLikesCounts);
  const keysArray = Object.keys(vacationLikesCounts);

  const data = {
    labels: keysArray,
    datasets: [
      {
        label: "Likes",
        data: likesCounts,
      },
    ],
  };

  const options = {
    // aspectRatio: 4 / 3,
    type: `bar`,
    responsive: true,
    maintainAspectRatio: isMobile ? false : true,
    indexAxis: isMobile ? (`y` as const) : (`x` as const),
    borderRadius: 12,
    barThickness: isMobile ? 24 : 32,
    backgroundColor: `#4361ee`,
    scales: {
      x: {
        position: isMobile ? ("top" as const) : ("bottom" as const),
        color: "#5F7681",
      },
      y: {
        position: "left" as const,
        color: "#4361ee",
      },
    },
    layout: {
      padding: 0,

      display: "flex" as const,
    },
  };

  const exportCSV = async () => {
    try {
      const response = await instance.get(`vacations/csv/export`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.AdminReport}>
      <div className={styles.header}>
        <div className={styles.filterBar}>
          <h2>Admin Reports Dashboard</h2>
          <button className={styles.secondary} onClick={exportCSV}>
            <FaFileCsv /> Export CSV
          </button>
        </div>
      </div>
      <div className={styles.brief}></div>
      <div className={styles.main}>
        <div className={styles.container}>

        <Bar className={styles.vacationsReportTable} data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default AdminReport;
