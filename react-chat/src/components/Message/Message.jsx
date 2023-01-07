import React from 'react';
import './Message.scss';

export function Message (props) {
  const parseMessage = (message) => {
    const messageSplit = message.split(':')
    let lastFragmentWasEmoji = true
    const messageJSX = messageSplit.map((fragment, index) => {
      if (props.emojiNames.includes(fragment)) {
        lastFragmentWasEmoji = true
        return <div
          key={index}
          className={fragment + ' emoji'}
        />
      } else {
        const res = <span key={index}>{lastFragmentWasEmoji ? '' : ':'}{fragment}</span>
        lastFragmentWasEmoji = false
        return res
      }
    })
    return messageJSX
  }
  return (
    <div className={props.isMine ? 'my-message' : 'message'}>
      <div className='message-text'>
        {props.text && parseMessage(props.text)}
      </div>
      {props.image && <img className='attachment' src={props.image} alt='img attachment preview' />}
      {props.audio && <audio className='attachment' src={props.audio} alt='audio attachment preview' controls/>}
      <div className='message-time'>
        {props.sender + ' ' + props.time}
      </div>
    </div>
  )
}
