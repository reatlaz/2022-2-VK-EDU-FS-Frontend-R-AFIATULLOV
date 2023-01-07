import React from 'react';

import './EmojiKeyboard.scss'

export function EmojiKeyboard (props) {
  const emojiListJSX = props.emojiNames.map((name, index) => (
    <div
      key={index}
      className={name + ' emoji'}
      onClick={() => props.onEmojiClick(name)}
    />
  ))
  return (
    <div className={'emoji-container'}>
      {emojiListJSX}
    </div>
  );
}
