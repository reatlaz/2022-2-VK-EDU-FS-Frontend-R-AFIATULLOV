import React, {useState} from 'react';
import './PageChatList.scss';
import {Button} from '../../components';


export class PageChatList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state ={
      
      }
  };
  changeState() {
    this.setState({
      
      })
  }
  render() {
    return (
      <div className='page-chat-list'>
        <nav>
            <Button value='menu' className="nav-button"/>
            <div className="heading">
                Messenger
            </div>
            <Button value='search' className="nav-button"/>
        </nav>
        <div className="chats"> 
          <div className="chat" onClick={() => this.props.goToPage('PageChat')}>
              <img src="src/static/barsiq.png" className="chat-picture" alt="No picture found"/>
              <div className="chat-info">
                  <div className="chat-text-info" >
                      <div className="chat-name">
                          Барсик
                      </div>
                      <div className="last-message">
                          Я вазу уронил
                      </div>
                  </div>
                  <div className="delivered">
                      <div className="last-message-time">
                          15:43
                      </div>
                      <div className="material-icons read-icons">
                          done_all
                      </div>
                  </div>
              </div>
          </div>
          

          <div className="chat">
            <img src="src/static/billy.jpeg" className="chat-picture" alt="No picture found"/>
            <div className="chat-info">
              <div className="chat-text-info">
                <div className="chat-name">
                  Billy
                </div>
                <div className="last-message">
                  Do you like what you see?
                </div>
              </div>
              <div className="delivered">
                <div className="last-message-time">
                  15:43
                </div>
                <div className="unread">
                  11
                </div>
              </div>
            </div>
          </div>

          <div className="chat">
            <img src="src/static/смешнявкин.JPG" className="chat-picture" alt="No picture found"/>
            <div className="chat-info">
                <div className="chat-text-info">
                    <div className="chat-name">
                        Беседа классаааааааааааааааааааааааааааааааааааааааааааааааааааааааааа
                    </div>
                    <div className="last-message">
                        FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFf
                    </div>

                </div>

                <div className="delivered">
                    <div className="last-message-time">
                        15:43
                    </div>
                    <div className="unread-pinged">
                        @99
                    </div>

                </div>
            </div>
          </div>
          <Button value='edit' className="create-chat"/>
        </div>
      </div>
    );
  }
}
