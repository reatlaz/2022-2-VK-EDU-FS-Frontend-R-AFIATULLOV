import React, {useState, useEffect} from 'react';
import './PageChatList.scss';
import {Button} from '../../components';
import vkfs from '../../images/vkfs.jpg';
import barsiq from '../../images/barsiq.png';
import { Link } from 'react-router-dom';

export function PageChatList () {
  const [error, setError] = useState(null);
  const [chats, setChats] = useState([]);
  const [lastMessageGeneral, setLastMessageGeneral] = useState(null);
  //const API_URL = 'https://reatlaz.pythonanywhere.com/chats/'
  //const API_URL = '/chats/'
  
  useEffect( () => {
    const localStorageChats = JSON.parse(localStorage.getItem('chats'));
    if (localStorageChats != null) {
      setChats(localStorageChats);
    }
    const localStorageLastMessageGeneral = JSON.parse(localStorage.getItem('lastMessageGeneral'));
    if (localStorageLastMessageGeneral != null) {
      setLastMessageGeneral(localStorageLastMessageGeneral);
    }
    pollChats();
    const t = setInterval(() => pollChats(), 10000);
    return () => clearInterval(t)
  }, []);
  
  const pollChats = () => {
    fetch('https://reatlaz.pythonanywhere.com/chats/', {
      mode: 'cors',
    })
    .then(resp => resp.json())
    .then(newChats => {
      setChats(newChats.data);
      console.log(newChats.data)
      localStorage.setItem('chats', JSON.stringify(newChats.data));
    },
    (error) => {
          // setIsLoaded(true);
          setError(error);
        });

    fetch('https://tt-front.vercel.app/messages/', {
      mode: 'cors',
      headers: {'Access-Control-Allow-Origin': '*'}
    })
    .then(resp => resp.json())
    .then(data => {
      const last = data.at(-1)
      console.log(last);
      setLastMessageGeneral(last);
      localStorage.setItem('lastMessageGeneral', JSON.stringify(last));
    }, (error) => {
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
                        {chat.last_message ? (chat.last_message.sender + ': ' + chat.last_message.content) : 'Нет сообщений'}
                    </div>
                </div>
                <div className="delivered">
                    <div className="last-message-time">
                        {chat.last_message && getTimeFromISOString(chat.last_message.created_at)}
                    </div>
                    <div className="material-icons read-icons">
                        {chat.last_message && chat.last_message.is_read ? 'done_all' : 'done'}
                    </div>
                </div>
            </div>
        </Link>
)
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
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
                          {lastMessageGeneral ? (lastMessageGeneral.author + ': ' + lastMessageGeneral.text) : 'Нет сообщений'}
                      </div>
                  </div>
                  <div className="delivered">
                      <div className="last-message-time">
                          {lastMessageGeneral && getTimeFromISOString(lastMessageGeneral.timestamp)}
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
}

export function getTimeFromISOString(timestamp) {
  return new Date(timestamp).toLocaleTimeString('ru',
                 { timeStyle: 'short', hour12: false, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
}
