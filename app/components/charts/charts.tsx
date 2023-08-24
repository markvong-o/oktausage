'use client';
import React from 'react';
import styles from './charts.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface IData {
  chartData: {
    num_of_unique_users: number;
    num_of_m2m_tokens: number;
    num_of_days: number;
  };
}
export default function Charts({ chartData }: IData) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  let { num_of_unique_users, num_of_m2m_tokens, num_of_days } = chartData;

  const userOptions = {
    responsive: true,
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 50,
        ticks: {
          font: {
            size: 23,
          },
        },
      },
      x: {
        suggestedMin: 0,
        suggestedMax: 50,
        ticks: {
          font: {
            size: 23,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 23,
          },
        },
      },
      title: {
        display: true,
        text: `Number of Unique Users Past ${num_of_days} Days`,
        font: {
          size: 30,
        },
      },
    },
  };
  const tokenOptions = {
    responsive: true,
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 50,
        ticks: {
          font: {
            size: 23,
          },
        },
      },
      x: {
        suggestedMin: 0,
        suggestedMax: 50,
        ticks: {
          font: {
            size: 23,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 23,
          },
        },
      },
      title: {
        display: true,
        text: `Number of M2M Tokens Past ${num_of_days} Days`,
        font: {
          size: 30,
        },
      },
    },
  };

  const userLabels = ['Unique Users'];
  const userLabelData = [num_of_unique_users];

  const m2mLabels = ['M2M Tokens'];
  const m2mLabelData = [num_of_m2m_tokens];

  const userData = {
    labels: userLabels,
    datasets: [
      {
        label: `Unique Users`,
        data: userLabelData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  const m2mData = {
    labels: m2mLabels,
    datasets: [
      {
        label: `M2M Tokens`,
        data: m2mLabelData,
        backgroundColor: 'rgba(255, 255, 255, 1)',
      },
    ],
  };
  const refresh = () => {
    window.location.href = '/';
  };
  return (
    <div className={styles.chartContainer}>
      <p className={styles.text}>
        Number of Unique Users over {num_of_days} days: {chartData.num_of_unique_users}
      </p>
      <p className={styles.text}>
        Number of M2M Tokens over {num_of_days} days: {chartData.num_of_m2m_tokens}
      </p>
      <button onClick={refresh} className={styles.refreshButton}>Refresh</button>
      <Bar
        options={userOptions}
        data={userData}
        className={styles.barContainer}
      />
      <Bar
        options={tokenOptions}
        data={m2mData}
        className={styles.barContainer}
      />
    </div>
  );
}
