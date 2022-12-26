import React, {useState, useEffect, useRef} from 'react';
import './PageChatList.scss';
import {Button} from '../../components';
import vkfs from '../../images/vkfs.jpg';
import barsiq from '../../images/barsiq.png';
import { Link } from 'react-router-dom';

export function PageChatList () {
  const [error, setError] = useState(null);
  const [chats, setChats] = useState([]);
  //const [polled, setPolled] = useState(false);
  const [lastMessageGeneral, setLastMessageGeneral] = useState(null);
  
  //const API_URL = 'https://reatlaz.pythonanywhere.com/chats/'
  //const API_URL = '/chats/'
  
  const prevChats = useRef();

  useEffect( () => {
    prevChats.current = chats;
    window.scrollTo(0, 0);
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
    return () => clearInterval(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  
  
  useEffect(() => {
    const cur = chats
    const prev = prevChats.current
    for (let i = 0, j = 0; i < prev.length; i++, j++){
      console.log(prev[j].last_message.id, cur[i].last_message.id)
      console.log(prev[j].last_message.id === cur[i].last_message.id)
      if (prev[j].last_message.id !== cur[i].last_message.id) {
        notifyUser('Новое сообщение', {body: cur[i].last_message.sender + ': ' + cur[i].last_message.content, icon: '../../images/message.png'});
        
        i++;
      }
    
    }
    prevChats.current = chats;
  }, [chats])

  function notifyUser(sender, content) {
    if (!('Notification' in window)) {
      alert('Browser does not support notifications');
    } else if (Notification.permission === 'granted') {
      new Notification(sender, content);
      // console.log('notification sent');
      //const notification = new Notification(chats.cur[i].last_message.sender, {body: chats.cur[i].last_message.content});
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(sender, content);
          // console.log('notification sent');
        }
      })
    }
  }

  const pollChats = () => {
    fetch('https://reatlaz.pythonanywhere.com/chats/', {
      mode: 'cors',
    })
    .then(resp => resp.json())
    .then(newChats => {
      const data = newChats.data
      console.log('adding polled data to chats state', data)
      setChats(data);

      localStorage.setItem('chats', JSON.stringify(data));
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
                      <div className='material-icons read-icons'>
                          done_all
                      </div>
                  </div>
              </div>
          </Link>
          {chatsJSX}
          <Button value='edit' className='create-chat'/>
        </div>
      </div>
    );
  }
}

export function getTimeFromISOString(timestamp) {
  return new Date(timestamp).toLocaleTimeString('ru',
                 { timeStyle: 'short', hour12: false, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
}
