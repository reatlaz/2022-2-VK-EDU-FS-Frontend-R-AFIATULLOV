import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Link, useParams} from 'react-router-dom'
import { Icon } from '@mui/material';
import './PageChat.scss';
import {Message, Button} from '../../components';
import barsiq from '../../images/barsiq.png';
import {getTimeFromISOString} from '../'
function Messages(props) {
  const messages = props.messages;
  const messagesEndRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages.length]);
  var messagesJSX = null
  if (messages !== null) {
    messagesJSX = messages.map((msg, index) =>
      <Message
        key={index}
        text={msg.content}
        image={msg.image}
        audio={msg.audio}
        time={getTimeFromISOString(msg.created_at)}
        sender={msg.sender === 'guest' ? ' ' : msg.sender}
        isMine={msg.sender === 'guest'}
      />)
  }
  return (
    <div id="messages">
      {messagesJSX.reverse()}

    <div ref={messagesEndRef} />
    </div>
  )
}

function MessageInputForm(props) {
  const [text, setText] = useState('');
  const [audioBlob, setAudioBlob] = useState();
  const [audioURL, setAudioURL] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [quickSent, setQuickSent] = useState(false);
  const [isOver, setIsOver] = useState(false);
  
  async function requestRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
  }
  useEffect(() => {
    if (mediaRecorder === null) {
      if (isRecording) {
        requestRecorder().then(setMediaRecorder, console.error);
      }
      return;
    }

    if (isRecording) {
      mediaRecorder.start();
    } else {
      mediaRecorder.stop();
    }

    const handleData = event => {
      setAudioBlob(event.data);
      setAudioURL(URL.createObjectURL(event.data));
    };

    mediaRecorder.addEventListener("dataavailable", handleData);
    return () => mediaRecorder.removeEventListener("dataavailable", handleData);
  }, [mediaRecorder, isRecording]);

  useEffect(() => {
    const inputElement = document.getElementById('file-input');
    inputElement.addEventListener("change", onImageChange, false);
  }, [])
  const handleChange = (event) => {
    setText(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (imageURL !== '') {
      handleFiles();
    } else if (audioURL !== '') {
      handleVoiceMessage();
    } else if (text !== '') {
      const newMessage = {
        content: text,
      }
      props.postMessage(newMessage);
      props.pollCallback();
      setText('');
      props.changeState()
      setImageURL('');
    }
  }
  function handleFiles() {
    const formData = new FormData();
    const fileField = document.getElementById('file-input');
    formData.append('image', fileField.files[0]);
    let imgSrc = null;
    fetch('https://tt-front.vercel.app/upload/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: formData,
    })
    .then(resp => resp.json())
    .then(responseJson => {
      console.log(responseJson.imgSrc)
      imgSrc = responseJson.imgSrc;
      const newMessage = {
        content: text,
        image: imgSrc
      }
      props.postMessage(newMessage);
      props.pollCallback();
      setText('');
      props.changeState()
      setImageURL('');
    })
  }

  const handleVoiceMessage = () => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    fetch('https://tt-front.vercel.app/upload/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: formData,
    })
    .then(resp => resp.json())
    .then(responseJson => {
      console.log(responseJson)
      const audioSrc = responseJson.audioSrc;
      const newMessage = {
        content: quickSent ? '' : text,
        audio: audioSrc
      }
      console.log('new message', newMessage)
      props.postMessage(newMessage);
      props.pollCallback();
      if (quickSent){
        setQuickSent(false);
      } else {
        setText('');
      }
      setAudioURL('');
      props.changeState()
    })
  }

  const dropHandler = (event) => {
    event.preventDefault();
    console.log('File(s) dropped');
    const inputElement = document.getElementById('file-input');
    inputElement.files = event.dataTransfer.files;
    setImageURL(URL.createObjectURL(event.dataTransfer.files[0]));
    setAudioURL('');
    setIsOver(false);
  }
  const dragOverHandler = (event) => {
    event.preventDefault();
    setIsOver(true);
  }
  const dragLeaveHandler = (event) => {
    event.preventDefault();
    setIsOver(false);
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0])
      setImageURL(URL.createObjectURL(event.target.files[0]));
      setAudioURL('');
    }
  }

  const sendLocation = () => {
    console.log('trying to send location');
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const newMessage = {
        content: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
      }
      props.postMessage(newMessage);
      props.pollCallback();
    });
    console.log('location sent');
  }

  const startRecording = (() => {
    setIsRecording(true);
  })

  const quickSendVM = () => {
    setQuickSent(true);
    setIsRecording(false);
  }

  const cancelVM = () => {
    setIsRecording(false);
    setAudioURL('');
    setImageURL('');
  }
  return(
    <form className="form" onSubmit={handleSubmit}>
      {
        (imageURL || audioURL) && <div className="attachments">
          {imageURL && <img className="attachment-preview" src={imageURL} alt="img attachment preview" />}
          {audioURL && <audio className="attachment-preview" src={audioURL} alt="audio attachment preview" controls/>}
          <Button
          value='close'
          className='attach-button'
          onClick={() => {setImageURL(''); setAudioURL('')}}
          />
        </div>
      }
      <div className={isOver ? 'over' : 'text-input'} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler}>
        <input className="message-input"
          placeholder="Cообщение"
          onChange={handleChange}
          value={text}
        />
        {isRecording && <Button
          value='arrow_upward'
          className='voice-recording'
          onClick={quickSendVM}
        />}
        <Button
          value='location_on'
          className='attach-button'
          onClick={sendLocation}
        />

        <label
          htmlFor="file-input"
          className='attach-file-button attach-button'
          >
          <Icon className='icon' fontSize='30px'>
            attach_file
          </Icon>
        </label>
        <input type="file" onChange={onImageChange}  accept='image/*' id='file-input' hidden/>

        <Button
          value={isRecording ? 'stop' :'mic'}
          className='attach-button'
          onClick={isRecording ? cancelVM : startRecording}
        />
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
      localStorage.setItem('chat' + id, JSON.stringify({chat: chatInfo.data.chat, last_login: chatInfo.data.last_login}));
      console.log(chatInfo.data);
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
    const localStorageChatInfo = JSON.parse(localStorage.getItem("chat" + id));
    if (localStorageChatInfo != null) {
      setChat(localStorageChatInfo.chat);
      setLastLogin(localStorageChatInfo.last_login);
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
    return 'был(а) ' + Math.floor(interval) + ' лет назад';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return 'был(а) ' + Math.floor(interval) + ' месяцев назад';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return 'был(а) ' + Math.floor(interval) + ' дней назад';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return 'был(а) ' + Math.floor(interval) + ' часов назад';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return 'был(а) ' + Math.floor(interval) + ' минут назад';
  }
  return 'был(а) ' + Math.floor(seconds) + ' секунд назад';
}
