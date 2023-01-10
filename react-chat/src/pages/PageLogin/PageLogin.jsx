import React from 'react';
import googleLogo from '../../images/google.png';
// import githubLogo from '../../images/github.png';
import './PageLogin.scss';

export function PageLogin (props) {
  return (
    <div className='page-login'>
      <div className='login-heading'>
        Messenger
      </div>
      <div className='login-button-container'>
        <a className='login-button google-auth' href='/social-auth/login/google-oauth2/'>
          <img
            alt='oauth provider icon'
            src={googleLogo}
          />
          <div className='login-button-text'>
            Login with Google
          </div>
        </a>
        {/* {error ? <div className='error'>Error: Authentication failed</div> : null} */}
      </div>
    </div>
  );
}
