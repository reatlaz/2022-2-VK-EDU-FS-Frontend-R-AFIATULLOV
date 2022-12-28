import React from "react";
import './Message.scss';

export function Message(props) {
  return (
    <div className={props.isMine ? "my-message" : "message"}>
      <div className="message-text">
        {props.text}
      </div>
      {props.image && <img className="attachment" src={props.image} alt="img attachment preview" />}
      {props.audio && <audio className="attachment" src={props.audio} alt="audio attachment preview" controls/>}
      <div className="message-time">
        {props.sender + ' ' + props.time}
      </div>
    </div>
  )
}