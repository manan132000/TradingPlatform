import React from 'react'

function AnalyticsCard(props) {
  return (
    <div class="col">
        <p><h3>{props.heading}</h3></p>
        <p><h6>{props.subHeading}</h6></p>
        <p className='money'><h2>{props.money}</h2></p>
            
        <div className='dot-div'>
            <span class="dot dot1"></span>70% Used
            <span class="dot dot2"></span>25% Remained
        </div>
    </div>
  )
}

export default AnalyticsCard