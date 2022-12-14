import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Link} from 'react-router-dom'
import './PageChat.scss';
import {Message, Button} from '../../components';
import vkfs from '../../images/vkfs.jpg';

function Messages(props) {
  const messages = props.messages;
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);
  var messagesJSX = null
  if (messages !== null) {
    messagesJSX = messages.map((msg, index) =>
      <Message
        key={index}
        text={msg.text}
        time={getTimeFromISOString(msg.timestamp)}
        sender={msg.author === 'ReAtlaz' ? '' : msg.author}
        isMine={msg.author==='ReAtlaz'}
      />)
  }
  return (
    <div className="messages">
      {messagesJSX}
    <div ref={messagesEndRef} />
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
        author: 'ReAtlaz',
        text: value,
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

export function PageGeneralChat () {
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const postMessage = (data) => {
    //console.log(JSON.stringify(data));
    fetch('https://tt-front.vercel.app/message/', {
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
  () => { fetch('https://tt-front.vercel.app/messages/', {
    mode: 'cors',
    headers: {'Access-Control-Allow-Origin': '*'}
    })
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
      setMessages(data);
      localStorage.setItem('messagesGeneral', JSON.stringify(data));
    },
  (error) => {
        setError(error);
      });
  }, [])
  useEffect( () => {
    const localStorageMessages = JSON.parse(localStorage.getItem('messagesGeneral'));
    if (localStorageMessages != null) {
      setMessages(localStorageMessages);
    }
    pollCallback();
    const t = setInterval(() => pollCallback(), 10000);
    return () => clearInterval(t)
  }, [pollCallback]);
  const changeState = (props) => {
  setMessages(JSON.parse(localStorage.getItem('messagesGeneral')))
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
        // to={'/user/' + id}
        >
          <img
            src={vkfs}
            className="user-avatar"
            alt="Not found"
          />
          <div className="receiver-text">
            <div className="username">
                Общий чат
            </div>
            <div className="last-seen"></div>
          </div> 
        </Link>
        <Button className='nav-button' value='search'/>
        <Button className='nav-button' value='more_vert'/>
      </nav>
      <Messages messages={messages}/>
      <MessageInputForm
        changeState={changeState}

        postMessage={postMessage}
        pollCallback={pollCallback}
      />
  </div>
  );
  }
}

function getTimeFromISOString(timestamp) {
  return new Date(timestamp).toLocaleTimeString('ru',
                 { timeStyle: 'short', hour12: false, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
}
