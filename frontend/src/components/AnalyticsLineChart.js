import React from 'react'
import {Chart as ChartJS,CategoryScale,Title,Tooltip,Legend} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {Chart, ArcElement, PointElement, LineController, LineElement} from 'chart.js'
Chart.register(ArcElement);
ChartJS.register(CategoryScale, PointElement, LineController, LineElement, Title, Tooltip, Legend);


function AnalyticsLineChart() {

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: "Net Worth",
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(131,138,133,0.4)",
            borderColor: "rgba(131,138,133,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(131,138,133,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(131,138,133,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [100, 80, 130, 125, 150, 200, 190, 210, 170, 190, 220, 200]
          }
        ]
      };
      
      const options = {
        title: {
          display: true,
          text: "Statistics",
          fontSize: 20
        },
        legend: {
          display: true,
          position: "bottom"
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function(value, index, values) {
                  return value + "K";
                }
              }
            }
          ]
        }
      };
  return (
    <div><Line data={data} options={options} /></div>
  )
}

export default AnalyticsLineChart