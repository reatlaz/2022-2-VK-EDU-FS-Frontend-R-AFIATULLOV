import React, {useState, useEffect, useCallback} from 'react';
import {Link, useParams} from 'react-router-dom'
import './PageChat.scss';
import {Message, Button} from '../../components';
import barsiq from '../../images/barsiq.png';

function Messages(props) {
  const messages = props.messages;
  var messagesJSX = null
  if (messages !== null) {
    messagesJSX = messages.map((msg, index) =>
      <Message
        key={index}
        text={msg.text}
        time={getTimeFromISOString(msg.timestamp)}
        sender={msg.author}
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
        author: 'ReAtlaz',
        text: value,
      }
      props.postData(newMessage);
      props.pollItems();
      
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
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  // const [isLoaded, setIsLoaded] = useState(false);
  const pollItems = () => { fetch('https://reatlaz.pythonanywhere.com/chats/' + id, {
    mode: 'cors',
    headers: {'Access-Control-Allow-Origin': '*'}
    })
    .then(resp => resp.json())
    .then(data => {
      // setIsLoaded(true);
      setMessages(data.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
      console.log(data)
      localStorage.setItem('messages' + id, JSON.stringify(data));
    },
    (error) => {
          // setIsLoaded(true);
          setError(error);
        });
  }
  const postData = (data) => {
    console.log(JSON.stringify(data));
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
        // setIsLoaded(true);
        setMessages(data.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
        console.log(data)
        localStorage.setItem('messages' + id, JSON.stringify(data));
      },
      (error) => {
      // setIsLoaded(true);
      setError(error);
    });
  }
  const pollCallback = useCallback(
    () => { fetch('https://reatlaz.pythonanywhere.com/chats/' + id, {
      mode: 'cors',
      headers: {'Access-Control-Allow-Origin': '*'}
      })
      .then(resp => resp.json())
      .then(data => {
        // setIsLoaded(true);
        setMessages(data.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
        console.log(data)
        localStorage.setItem('messages' + id, JSON.stringify(data));
      },
      (error) => {
            // setIsLoaded(true);
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
        <Link className="chat-heading" to={'/user/' + id}>
          <img
            src={barsiq}
            className="user-avatar"
            alt="Not found"
          />
          <div className="receiver-text">
            <div className="username">
              {
                (id === '0' && 'Общий чат') ||
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
        id={id}
        postData={postData}
        pollItems={pollItems}
      />
  </div>
  );
  }
}


function getTimeFromISOString(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en',
                 { timeStyle: 'short', hour12: false, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
}
