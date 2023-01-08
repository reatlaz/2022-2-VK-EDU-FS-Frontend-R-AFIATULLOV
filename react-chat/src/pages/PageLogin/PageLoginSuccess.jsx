import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
// import githubLogo from '../../images/github.png';
import './PageLogin.scss';
// import {Button} from '../../components';

export function PageLoginSuccess (props) {
  const redirect = useNavigate();
  const [error, setError] = useState(false)
  const getCredentials = async () => {
    try {
      const data = await fetch('/social-auth/login/google-oauth2/', {
        mode: 'no-cors',
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000/',
          'Access-Control-Allow-Credentials': true
        },
        credentials: 'include'
      })
      console.log(data);
      // setting the session expiration date a year from now
      // won't work if cookies were to be cleared and localstorage wouldn't
      const aYearFromNow = new Date();
      aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
      localStorage.setItem('sessionExpires', JSON.stringify(aYearFromNow));
      redirect('/');
    } catch (err) {
      console.log(err);
      // вывести 404 или ошибку аутентификации
      // catch пока не ловит ошибку аутентификации
      setError(true);
    }
  }
  getCredentials();

  return (
    <div className='page-login'>
      <div className='login-heading'>
        Login successful
      </div>
      <div className='login-button-container'>
        {error ? <div className='error'>Error: Authentication failed</div> : null}
      </div>
    </div>
  );
}
