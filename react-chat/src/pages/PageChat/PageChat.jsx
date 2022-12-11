import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom'
import './PageChat.scss';
import {Message, Button} from '../../components';
import barsiq from '../../images/barsiq.png';
import billy from '../../images/billy.jpeg';
import smesh from '../../images/смешнявкин.JPG';
function Messages(props) {
  const messages = props.messages;
  var messagesJSX = null
  if (messages !== null) {
    messagesJSX = messages.map((msg, index) =>
      <Message
        key={index}
        isMine={msg.isMine}
        text={msg.text}
        time={msg.time}
      />)
  }
  return (
    <div className="messages">
      {messagesJSX}
    </div>
  )
}

function MessageInputForm(props) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if(value !== '') {
      const textString = value;
      const timeString = getCurrentTime();
      const newMessage = {
        isMine: true,
        text: textString,
        time: timeString,
      }
      let localStorageMessages = JSON.parse(localStorage.getItem('messages' + props.userId));
      if(localStorageMessages === null) {
          localStorageMessages = [];
      }
      localStorageMessages.push(newMessage)
      localStorage.setItem('messages' + props.userId, JSON.stringify(localStorageMessages));
      setValue('');
      props.changeState()
    }
  }

  return(
    <form className="form" onSubmit={handleSubmit}>
      <div className="text-input">
        <input className="message-input"
          placeholder="Cообщение"
          onChange={handleChange}
          value={value}
        />
        <Button value='attach_file' className='attach-button'/>
      </div>
    </form>
  )
}

export function PageChat () {
  let { id } = useParams();
  const [messages, setMessages] = useState([]);
  useEffect( () => {
    let localStorageMessages = JSON.parse(localStorage.getItem("messages" + id));
    if(localStorageMessages === null) {
      if (id === '1') {
        localStorageMessages = [{
        isMine: false,
        text: 'Я вазу уронил',
        time: '00:01',
        }];
        localStorage.setItem('messages1', JSON.stringify(localStorageMessages));
      } else if (id === '2') {
        localStorageMessages = [{
        isMine: false,
        text: 'Do you like what you see?',
        time: '00:03',
        }];
        localStorage.setItem('messages2', JSON.stringify(localStorageMessages));
      } else if (id === '3') {
        localStorageMessages = [{
        isMine: false,
        text: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
        time: '00:04',
        }];
        localStorage.setItem('messages3', JSON.stringify(localStorageMessages));
      }
      
    }
    setMessages(localStorageMessages);
  }, [id]);
  const changeState = (props) => {
    setMessages(JSON.parse(localStorage.getItem("messages" + id)))
  }

  return (
    <div className='page-chat'>
      <nav>
        <Button
          className='nav-button'
          value='arrow_back'
          goTo={'/im'}
        />
        <Link className="chat-heading" to={'/user/' + id}>
          <img
            src={
              (id === '1' && barsiq) ||
              (id === '2' && billy) ||
              (id === '3' && smesh)
              }
            className="user-avatar"
            alt="Not found"
          />
          <div className="receiver-text">
            <div className="username">
              {
                (id === '1' && 'Барсик') ||
                (id === '2' && 'Billy') ||
                (id === '3' && 'Беседа классааааааааааааааааааааа')
              }
            </div>
            <div className="last-seen">
              был 2 часа назад
            </div>
          </div> 
        </Link>
        <Button className='nav-button' value='search'/>
        <Button className='nav-button' value='more_vert'/>
      </nav>
      <Messages messages={messages}/>
      <MessageInputForm
        changeState={changeState}
        userId={id}
      />
  </div>
  );
}


function getCurrentTime() {
  const currentDate = new Date();
    let hours = String(currentDate.getHours());
    if (hours.length === 1) {
        hours = '0' + hours
    }
    let minutes = String(currentDate.getMinutes());

    if (minutes.length === 1) {
        minutes = '0' + minutes
    }
    return hours + ":" + minutes;
}
