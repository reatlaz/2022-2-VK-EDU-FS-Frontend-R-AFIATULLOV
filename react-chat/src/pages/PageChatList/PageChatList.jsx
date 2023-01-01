import React, {useState, useEffect, useRef} from 'react';
import {Link, useParams} from 'react-router-dom'
import { connect } from 'react-redux'

import './PageChatList.scss';
import {Button} from '../../components';
import vkfs from '../../images/vkfs.jpg';
import barsiq from '../../images/barsiq.png';
import notificationIcon from '../../images/notificationIcon.png';
import { getChats} from '../../actions';

function PageChatList (props) {
//  const [error, setError] = useState(null);
  const chats = props.chats;
  //const [polled, setPolled] = useState(false);
  const [lastMessageGeneral, setLastMessageGeneral] = useState(null);
  let { id } = useParams();
  
  const prevChats = useRef();
  const prevLastMessageGeneral = useRef();

  useEffect( () => {
    prevChats.current = chats;
    prevLastMessageGeneral.current = lastMessageGeneral;
    window.scrollTo(0, 0);
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
      console.log(prev[j], cur[i])
      console.log(prev[j].last_message.id, cur[i].last_message.id, Number(id))
      console.log(prev[j].last_message.id === cur[i].last_message.id)
      if (prev[j].last_message.id < cur[i].last_message.id && Number(id) !== cur[i].id) {
        notifyUser('Новое сообщение: ' + cur[i].name, {body: cur[i].last_message.sender + ': ' + cur[i].last_message.content, icon: notificationIcon});
        i++;
      }
    }
    prevChats.current = chats;
  }, [chats, id])

  useEffect(() => {
    const cur = lastMessageGeneral
    const prev = prevLastMessageGeneral.current

    if (prev && prev._id !== cur._id && id !== undefined) {
      notifyUser('Новое сообщение: Общий чат', {body: cur.author + ': ' + cur.text, icon: notificationIcon});
    }
    prevLastMessageGeneral.current = lastMessageGeneral;
  }, [lastMessageGeneral, id])


  function notifyUser(sender, content) {
    if (!('Notification' in window)) {
      alert('Browser does not support notifications');
    } else if (Notification.permission === 'granted') {
      new Notification(sender, content);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(sender, content);
        }
      })
    }
  }

  const pollChats = () => {
    props.getChats(id);

    fetch('https://tt-front.vercel.app/messages/', {
      mode: 'cors',
      headers: {'Access-Control-Allow-Origin': '*'}
    })
    .then(resp => resp.json())
    .then(data => {
      const last = data.at(-1)
      console.log('adding polled data to general chat state', last)
      setLastMessageGeneral(last);

      localStorage.setItem('lastMessageGeneral', JSON.stringify(last));
    }/*, (error) => {
        setError(error);
    }*/);
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
  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // } else {
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
//}

const mapStateToProps= (state) => ({
  chats: state.chats.chats,
})

export const ConnectedPageChatList = connect(mapStateToProps, {getChats})(PageChatList)

export function getTimeFromISOString(timestamp) {
  return new Date(timestamp).toLocaleTimeString('ru',
                 { timeStyle: 'short', hour12: false, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
}
