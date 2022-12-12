import React from "react";
import './Message.scss';

export function Message(props) {
  return (
    <div className={props.isMine ? "my-message" : "message"}>
      <div className="message-text">
        {props.text}
      </div>
      <div className="message-time">
        {props.sender + ' ' + props.time}
      </div>
    </div>
  )
}