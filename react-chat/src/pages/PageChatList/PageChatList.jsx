import React, {useState, useEffect} from 'react';
import './PageChatList.scss';
import {Button} from '../../components';
import vkfs from '../../images/vkfs.jpg';
import barsiq from '../../images/barsiq.png';
import billy from '../../images/billy.jpeg';
import smesh from '../../images/смешнявкин.JPG';
import { Link } from 'react-router-dom';

export function PageChatList () {
  const [error, setError] = useState(null);
  const [chats, setChats] = useState([]);
  //const API_URL = 'https://reatlaz.pythonanywhere.com/chats/'
  //const API_URL = '/chats/'

  useEffect( () => {
    const localStorageChats = JSON.parse(localStorage.getItem('chats'));
    if (localStorageChats != null) {
      setChats(localStorageChats);
    }
    pollChats();
    const t = setInterval(() => pollChats(), 10000);
    return () => clearInterval(t)
  }, []);

  const pollChats = () => { fetch('https://reatlaz.pythonanywhere.com/chats/', {
    mode: 'cors',
    })
    .then(resp => resp.json())
    .then(newChats => {
      // setIsLoaded(true);
      console.log(newChats.data)
      // let sorted_data = []
      // if (data != null) {
      //   sorted_data = data.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      // }
      // setChats(newChats.data.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
      setChats(newChats.data);
      
      localStorage.setItem('chats', JSON.stringify(newChats.data));
    },
    (error) => {
          // setIsLoaded(true);
          setError(error);
        });
  }

  let chatsJSX = null
  if (chats !== null) {
    chatsJSX = chats.map((chat, index) =>
    <Link className="chat" to={"/im/" + chat.id} key={index}>
            <img src={barsiq} className="chat-picture" alt="Not found"/>
            <div className="chat-info">
                <div className="chat-text-info" >
                    <div className="chat-name">
                        {chat.name}
                    </div>
                    <div className="last-message">
                        {chat.last_message.sender + ' : ' + chat.last_message.content}
                    </div>
                </div>
                <div className="delivered">
                    <div className="last-message-time">
                        {/* {getTimeFromISOString(chat.last_message.time)} */}
                        {chat.last_message.time}
                    </div>
                    <div className="material-icons read-icons">
                        {chat.last_message.is_read && 'done_all'}
                    </div>
                </div>
            </div>
        </Link>
)
  }

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
      <Link className="chat" to="/im/general">
            <img src={vkfs} className="chat-picture" alt="Not found"/>
            <div className="chat-info">
                <div className="chat-text-info" >
                    <div className="chat-name">
                        Общий чат
                    </div>
                    <div className="last-message">
                        Blank
                    </div>
                </div>
                <div className="delivered">
                    <div className="last-message-time">
                        Blank
                    </div>
                    <div className="material-icons read-icons">
                        done
                    </div>
                </div>
            </div>
        </Link>
        {chatsJSX}
        <Button value='edit' className="create-chat"/>
      </div>
    </div>
  );
}
