import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import './PageChatList.scss';
import { Button } from '../../components';
import vkfs from '../../images/vkfs.jpg';
import barsiq from '../../images/barsiq.png';
import notificationIcon from '../../images/notificationIcon.png';
import { getChats, getLastMessageGeneral } from '../../actions';

export function PageChatList (props) {
  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
  const chats = props.chats;
  const lastMessageGeneral = props.lastMessageGeneral;
  const { id } = useParams();
  const prevChats = useRef();
  const prevLastMessageGeneral = useRef();

  const emojiNames = [
    'angry-face',
    'anguished-face',
    'anxious-face-with-sweat',
    'astonished-face',
    'eyes',
    'video-game'
  ]
  const parseMessage = (message) => {
    const messageSplit = message.split(':')
    let lastFragmentWasEmoji = true
    const messageJSX = messageSplit.map((fragment, index) => {
      if (emojiNames.includes(fragment)) {
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

  useEffect(() => {
    prevChats.current = chats;
    prevLastMessageGeneral.current = lastMessageGeneral;
    window.scrollTo(0, 0);
    pollChats();
    const t = setInterval(() => pollChats(), 10000);
    return () => clearInterval(t);
  }, []); // // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const cur = chats
    const prev = prevChats.current
    for (let i = 0, j = 0; i < prev.length; i++, j++) {
      if (prev[j].last_message === null || cur[i].last_message == null) {
        continue
      }
      console.log(prev[j], cur[i])
      console.log(prev[j].last_message.id, cur[i].last_message.id, Number(id))
      console.log(prev[j].last_message.id === cur[i].last_message.id)
      if (prev[j].last_message.id < cur[i].last_message.id && Number(id) !== cur[i].id) {
        notifyUser('Новое сообщение: ' + cur[i].name, { body: cur[i].last_message.sender + ': ' + cur[i].last_message.content, icon: notificationIcon });
        i++;
      }
    }
    prevChats.current = chats;
  }, [chats, id])

  useEffect(() => {
    const cur = lastMessageGeneral
    const prev = prevLastMessageGeneral.current

    if (prev && prev._id !== cur._id && id !== undefined) {
      notifyUser('Новое сообщение: Общий чат', { body: cur.author + ': ' + cur.text, icon: notificationIcon });
    }
    prevLastMessageGeneral.current = lastMessageGeneral;
  }, [lastMessageGeneral, id])

  function notifyUser (sender, content) {
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
    props.getLastMessageGeneral();
  }

  let chatsJSX = null
  if (chats !== [null]) {
    chatsJSX = chats.map((chat, index) =>
      <Link className='chat' to={'/im/' + chat.id} key={index}>
        <img src={barsiq} className="chat-picture" alt="Not found"/>
          <div className="chat-info">
              <div className="chat-text-info" >
                  <div className="chat-name">
                      {chat.name}
                  </div>
                  {chat.last_message
                    ? <div className="last-message">
                      <span>
                        {chat.is_private ? '' : chat.last_message.sender + ': '}
                      </span>
                      {parseMessage(chat.last_message.content)}
                    </div>
                    : <div className="last-message">
                      Нет сообщений
                    </div>}
              </div>
              <div className="delivered">
                  <div className="last-message-time">
                      {chat.last_message && getTimeFromISOString(chat.last_message.created_at)}
                  </div>
                  <div className="material-icons read-icons">
                      {chat.last_message ? (chat.last_message.is_read ? 'done_all' : 'done') : ''}
                  </div>
              </div>
          </div>
      </Link>
    )
  }
  const openSideBar = () => {
    document.getElementById('chatListSidebar').style.width = '250px';
    setSideBarIsOpen(true);
  }

  const closeSideBar = () => {
    document.getElementById('chatListSidebar').style.width = '0';
    setSideBarIsOpen(false);
  }

  const logOut = () => {
    localStorage.setItem('sessionExpires', JSON.stringify(null));
    // window.location.replace('https://reatlaz.pythonanywhere.com/logout/')
    fetch('/logout/')
    window.location.replace('https://reatlaz.pythonanywhere.com')
  }
  return (
    <div id='main' className='page-chat-list'>
      <div id="chatListSidebar" className="sidebar">
        {/* <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Clients</a> */}
        <div onClick={logOut}>Log out</div>
      </div>
      <nav>
          <Button value={sideBarIsOpen ? 'close' : 'menu'} onClick={sideBarIsOpen ? closeSideBar : openSideBar} className="nav-button"/>
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

                    {lastMessageGeneral
                      ? <div className="last-message">
                        <span>
                          {lastMessageGeneral.author + ': '}
                        </span>
                        {lastMessageGeneral.text && parseMessage(lastMessageGeneral.text)}
                      </div>
                      : <div className="last-message">
                        Нет сообщений
                      </div>}

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

const mapStateToProps = (state) => ({
  chats: state.chats.chats,
  lastMessageGeneral: state.lastMessageGeneral.lastMessageGeneral
})

export const ConnectedPageChatList = connect(mapStateToProps, { getChats, getLastMessageGeneral })(PageChatList)

export function getTimeFromISOString (timestamp) {
  return new Date(timestamp).toLocaleTimeString('ru',
    { timeStyle: 'short', hour12: false, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
}
