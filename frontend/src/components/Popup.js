import React from "react";
import '../css/Popup.css';

function Popup(props) {
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="popup-submit-btn" onClick={() => props.setTrigger(false)}>
          Submit
        </button>
        <button className="popup-close-btn" onClick={() => props.setTrigger(false)}>
            <i class="far fa-times-circle"></i>
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;