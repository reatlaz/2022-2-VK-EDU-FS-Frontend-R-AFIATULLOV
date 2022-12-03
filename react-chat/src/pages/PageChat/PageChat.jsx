import React from 'react';
import './PageChat.scss';


import {Message, Button} from '../../components';
import { grey } from '@mui/material/colors';

function Messages(props) {
  return (
    <div id="messages">
      <Message
        isMine={false}
        text={'Я вазу уронил'}
        time='11:30'
      />
      <Message
        isMine={true}
        text={'Я вазу уронил'}
        time='11:30'
      />
    </div>
  )
}

export class PageChat extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='page-chat'>
        <nav>
          <Button type='nav-button' value='arrow_back'/>
          <div className="heading">
          <img
            src="src/static/barsiq.png"
            className="user-avatar"
            alt="Not found"
            />
            <div className="receiver-text">
              <div id="username">
                Барсик
              </div>
              <div id="last-seen">
                был 2 часа назад
              </div>
            </div> 
          </div>
          <Button type='nav-button' value='search'/>
          <Button type='nav-button' value='more_vert'/>
        </nav>

        <Messages/>
        <form className="form" action="/">
          <div id="text-input">
            <input className="form-input" name="message-text" placeholder="Cообщение" type="text"/>
              <Button value='attachment' type='attach-button'/>
          </div>
        </form>
    </div>
    );
  }
}
