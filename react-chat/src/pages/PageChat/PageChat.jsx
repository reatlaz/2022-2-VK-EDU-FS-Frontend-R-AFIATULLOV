import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { Icon } from '@mui/material';
import './PageChat.scss';
import { Message, Button, EmojiKeyboard } from '../../components';
import barsiq from '../../images/barsiq.png';
import { getTimeFromISOString, PageChatList } from '../'
import { getChats, getMessages, getLastMessageGeneral } from '../../actions';

function Messages (props) {
  const messages = props.messages;
  const user = props.user_id

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages.length]);
  let messagesJSX = null
  if (messages !== null) {
    messagesJSX = messages.map((msg, index) =>
      <Message
        key={index}
        emojiNames={props.emojiNames}
        text={msg.content}
        image={msg.image}
        audio={msg.audio}
        time={getTimeFromISOString(msg.created_at)}
        sender={msg.sender === user ? ' ' : msg.sender_name}
        isMine={msg.sender === user}
      />)
  }
  return (
    <div id="messages">
      {messagesJSX.reverse()}
    {/* <div ref={messagesEndRef} /> */}
    </div>
  )
}

function MessageInputForm (props) {
  const [text, setText] = useState('');
  const [audioBlob, setAudioBlob] = useState();
  const [audioURL, setAudioURL] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [vmIsQuick, setVmIsQuick] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [emojiKeyboardVisible, setEmojiKeyboardVisible] = useState(false);
  async function requestRecorder () {
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

    mediaRecorder.addEventListener('dataavailable', handleData);
    return () => mediaRecorder.removeEventListener('dataavailable', handleData);
  }, [mediaRecorder, isRecording]);

  useEffect(() => {
    console.log(audioBlob)
    if (audioBlob && vmIsQuick) {
      handleVoiceMessage();
    }
  }, [audioBlob, vmIsQuick]); // // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const inputElement = document.getElementById('file-input');
    inputElement.addEventListener('change', onImageChange, false);
  }, [])
  const handleChange = (event) => {
    setText(event.target.value);
  }

  const onEmojiClick = (emojiName) => {
    setText(text + ':' + emojiName + ':')
  }
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    console.log(name, cookieValue)
    return cookieValue;
  }
  const postMessage = (data, id) => {
    const csrftoken = getCookie('csrftoken');
    fetch('/api/chats/' + id + '/messages/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': csrftoken
        // 'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(data => {
        console.log('posted message response: ', data)
        props.getMessages(id); // get the newly sent message from server
        console.log('polling newly created message from server')
      })
      .catch(err => {
        console.log(err)
      })
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (imageURL !== '') {
      handleFiles();
    } else if (audioURL !== '') {
      handleVoiceMessage();
    } else if (text !== '') {
      const newMessage = {
        content: text
      }
      postMessage(newMessage, props.id);
      setText('');
      // props.changeState();
      setImageURL('');
    }
  }
  function handleFiles () {
    const formData = new FormData();
    const fileField = document.getElementById('file-input');
    formData.append('image', fileField.files[0]);
    let imgSrc = null;
    fetch('https://tt-front.vercel.app/upload/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: formData
    })
      .then(resp => resp.json())
      .then(responseJson => {
        console.log(responseJson.imgSrc)
        imgSrc = responseJson.imgSrc;
        const newMessage = {
          content: text,
          image: imgSrc
        }
        postMessage(newMessage, props.id);
        setText('');
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
        'Access-Control-Allow-Origin': '*'
      },
      body: formData
    })
      .then(resp => resp.json())
      .then(responseJson => {
        console.log(responseJson)
        const audioSrc = responseJson.audioSrc;
        const newMessage = {
          content: vmIsQuick ? '' : text,
          audio: audioSrc
        }
        console.log('new message', newMessage)
        postMessage(newMessage, props.id);
        props.getMessages(props.id);
        if (vmIsQuick) {
          setVmIsQuick(false);
        } else {
          setText('');
        }
        setAudioURL('');
        // props.changeState()
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
        content: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
      }
      props.postMessage(newMessage, props.id);
    });
    console.log('location sent');
  }

  const startRecording = () => {
    setIsRecording(true);
  }

  const quickSendVM = () => {
    setVmIsQuick(true);
    setIsRecording(false);
  }

  const stopRecording = () => {
    setIsRecording(false);
    setAudioURL('');
    setImageURL('');
  }
  return (
    <form className="form" onSubmit={handleSubmit}>
      {
        (imageURL || audioURL) && !vmIsQuick && <div className="attachments">
          {imageURL && <img className="attachment-preview" src={imageURL} alt="img attachment preview" />}
          {audioURL && <audio className="attachment-preview" src={audioURL} alt="audio attachment preview" controls/>}
          <Button
          value='close'
          className='attach-button'
          onClick={() => { setImageURL(''); setAudioURL('') }}
          />
        </div>
      }
      <div className={isOver ? 'over' : 'text-input'} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler}>
        <input className="message-input"
          placeholder="Cообщение"
          onChange={handleChange}
          value={text}
        />
        {emojiKeyboardVisible && <EmojiKeyboard

          onEmojiClick={onEmojiClick}
          emojiNames={props.emojiNames}

        />}
        {isRecording && <Button
          value='arrow_upward'
          className='voice-recording'
          onClick={quickSendVM}
        />}
        <Button
          value='mood'
          className='attach-button'
          onClick={() => setEmojiKeyboardVisible(!emojiKeyboardVisible)}
        />
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
        <input type="file" onChange={onImageChange} accept='image/*' id='file-input' hidden/>
        <Button
          value={isRecording ? 'stop' : 'mic'}
          className='attach-button'
          onClick={isRecording ? stopRecording : startRecording}
        />
      </div>
    </form>
  )
}

function PageChat (props) {
  // import for notifications support
  PageChatList(props);
  const { id } = useParams();
  const [chat, setChat] = useState({ name: '' });
  const [lastLogin, setLastLogin] = useState('');

  const emojiNames = [
    'angry-face',
    'anguished-face',
    'anxious-face-with-sweat',
    'astonished-face',
    'eyes',
    'video-game'
  ]

  useEffect(() => {
    // getting chat info
    fetch('/api/chats/' + id + '/', {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/',
        'Access-Control-Allow-Credentials': true
      },
      credentials: 'include'
    })
      .then(resp => resp.json())
      .then(chatInfo => {
        localStorage.setItem('chat' + id, JSON.stringify({ chat: chatInfo.data.chat, last_login: chatInfo.data.last_login }));
        console.log(chatInfo.data);
        setChat(chatInfo.data.chat);
        setLastLogin(chatInfo.data.last_login);
      });
  }, [id]) // // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    props.getMessages(id);
    const localStorageChatInfo = JSON.parse(localStorage.getItem('chat' + id));
    if (localStorageChatInfo != null) {
      setChat(localStorageChatInfo.chat);
      setLastLogin(localStorageChatInfo.last_login);
    }

    const t = setInterval(() => props.getMessages(id), 10000);
    return () => clearInterval(t)
  }, [id]); // // eslint-disable-line react-hooks/exhaustive-deps

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
        <Messages
          messages={props.messages}
          user_id={props.user_id}
          emojiNames={emojiNames}
        />
        <MessageInputForm
          emojiNames={emojiNames}
          id={id}
          postMessage={props.postMessage}
          getMessages={props.getMessages}
        />
    </div>
  );
}

const mapStateToProps = (state) => ({
  messages: state.messages.messages,
  user_id: state.messages.user_id,
  chats: state.chats.chats,
  lastMessageGeneral: state.lastMessageGeneral.lastMessageGeneral
})

export const ConnectedPageChat = connect(mapStateToProps, { getMessages, getChats, getLastMessageGeneral })(PageChat)

function timeSince (isoString) {
  const date = new Date(isoString);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

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
