import React from 'react'
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import faker from 'faker';
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AnalyticsBarChart() {

  const options =  {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Yearly Expense',
      },
    },
  };

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels,
    datasets: [
      {
        label: '2020',
        data: labels.map(() => Math.random()*1000),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '2021',
        data: labels.map(() => Math.random()*1000),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: '2022',
        data: labels.map(() => Math.random()*1000),
        backgroundColor: 'rgba(200,250,2,0.5)',
      }
    ],
  };

  return (
    <div><Bar options={options} data={data} /></div>
  )
}

export default AnalyticsBarChart