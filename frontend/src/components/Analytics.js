import React from 'react'
import '../css/Analytics.css'
import AnalyticsLineChart from './AnalyticsLineChart';
import AnalyticsBarChart from './AnalyticsBarChart';
import AnalyticsCard from './AnalyticsCard';

function Analytics() {

  return (
    <div className='main-section analytics'>
        <div className="">
        <div className="row">
        <AnalyticsCard 
          heading='Balance Status'
          subHeading= 'Current Balance'
          money= '$50,500.00'
          />

          <AnalyticsCard 
          heading='Revenue'
          subHeading= 'Last 2 months'
          money= '$25,900.00'
          />

          <AnalyticsCard 
          heading='Savings'
          subHeading= 'Last 2 months'
          money= '$7,800.00'
          />
        </div>
        <div className='charts-div'>
        <div className='chart'><AnalyticsBarChart /></div>
        <div className='chart'><AnalyticsLineChart /></div>
        
        
        </div>
    </div>
    
  </div>
)
}

export default Analytics
