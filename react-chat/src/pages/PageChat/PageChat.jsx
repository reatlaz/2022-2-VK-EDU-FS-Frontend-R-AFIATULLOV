import React from 'react';
import './PageChat.scss';

import { Icon } from '@mui/material';
import {Message, Button} from '../../components';


export class PageChat extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <nav>
          <div>
            <a className="material-icons" href="chats.html">
              arrow_back
            </a>
          </div>
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
          <div className="material-icons">
              search
          </div>
          <div className="material-icons">
              more_vert
          </div>
        </nav>

        <div id="messages">
          <Message
            isMine={false}
            text={'Я вазу уронил'}
            time='11:30'
          />
        </div>
        <form className="form" action="/">
          <div id="text-input">
            <input className="form-input" name="message-text" placeholder="Cообщение" type="text"/>
            <div className="material-icons"
            style={{
              alignSelf: 'center',
              color: 'grey',
              transform: [{ rotate: '90deg'}]}}
              >{'attach_file'}</div>
            </div>
        </form>
    </div>
    );
  }
}
