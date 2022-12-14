import React, {useState, useEffect, useCallback} from 'react';
import {Link, useParams} from 'react-router-dom'
import './PageChat.scss';
import {Message, Button} from '../../components';
import barsiq from '../../images/barsiq.png';
import {getTimeFromISOString} from '../'
function Messages(props) {
  const messages = props.messages;
  var messagesJSX = null
  if (messages !== null) {
    messagesJSX = messages.map((msg, index) =>
      <Message
        key={index}
        text={msg.content}
        time={getTimeFromISOString(msg.created_at)}
        sender={msg.sender === 'guest' ? ' ' : msg.sender}
        isMine={msg.sender === 'guest'}
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
      const newMessage = {
        content: value,
      }
      props.postMessage(newMessage);
      props.pollCallback();
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
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState({name: ''});
  const [lastLogin, setLastLogin] = useState('');

  useEffect(() => {
    fetch('https://reatlaz.pythonanywhere.com/chats/' + id, {
    mode: 'cors',
    })
    .then(resp => resp.json())
    .then(chatInfo => {
      console.log(chatInfo.data)
      setChat(chatInfo.data.chat);
      setLastLogin(chatInfo.data.last_login);
    },
    (error) => setError(error));
  }, [id])

  const postMessage = (data) => {
    console.log(JSON.stringify(data));
    fetch('https://reatlaz.pythonanywhere.com/chats/' + id + '/messages/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        },
      body: JSON.stringify(data),
      })
      .then(resp => resp.json())
      .then(data => {
        pollCallback(); // get the newly sent message from server
        console.log(data)
      },
      (error) => setError(error));
  }
const pollCallback = useCallback(
    () => { fetch('https://reatlaz.pythonanywhere.com/chats/' + id + '/messages/', {
      mode: 'cors',
      headers: {'Access-Control-Allow-Origin': '*'}
      })
      .then(resp => resp.json())
      .then(newMessages => {
        console.log(newMessages.data)
        setMessages(newMessages.data);
        localStorage.setItem('messages' + id, JSON.stringify(newMessages.data));
      },
      (error) => {
            setError(error);
          });
    }, [id]);
  useEffect( () => {
    const localStorageMessages = JSON.parse(localStorage.getItem("messages" + id));
    if (localStorageMessages != null) {
      setMessages(localStorageMessages);
    }
    pollCallback();
    const t = setInterval(() => pollCallback(), 10000);
    return () => clearInterval(t)
  }, [id, pollCallback]);
  const changeState = (props) => {
  setMessages(JSON.parse(localStorage.getItem("messages" + id)))
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div className='page-chat'>
        <nav>
          <Button
            className='nav-button'
            value='arrow_back'
            goTo={'/im'}
          />
          <Link className="chat-heading"
          to={'/user/' + id}
          >
            <img
              src={barsiq}
              className="user-avatar"
              alt="Not found"
            />
            <div className="receiver-text">
              <div className="username">
                {chat.name}
              </div>
              {chat.is_private && <div className="last-seen">{timeSince(lastLogin)}</div>}
            </div> 
          </Link>
          <Button className='nav-button' value='search'/>
          <Button className='nav-button' value='more_vert'/>
        </nav>
        <Messages messages={messages}/>
        <MessageInputForm
          changeState={changeState}
          id={id}
          postMessage={postMessage}
          pollCallback={pollCallback}
        />
    </div>
    );
  }
}

function timeSince(isoString) {
  const date = new Date(isoString);
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return 'был(а) в сети ' + Math.floor(interval) + ' лет назад';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return 'был(а) в сети ' + Math.floor(interval) + ' месяцев назад';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return 'был(а) в сети ' + Math.floor(interval) + ' дней назад';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return 'был(а) в сети ' + Math.floor(interval) + ' часов назад';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return 'был(а) в сети ' + Math.floor(interval) + ' минут назад';
  }
  return 'был(а) в сети ' + Math.floor(seconds) + ' секунд назад';
}
