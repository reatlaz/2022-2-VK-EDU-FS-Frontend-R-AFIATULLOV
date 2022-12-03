import React from 'react';
import './Button.scss';
import { Icon } from '@mui/material';

export function Button(props) {
  return (
    <button
      className={props.type}
      onClick={props.onClick}
    >
      <Icon className="icon" fontSize='30px'>
        {props.value}
      </Icon>
    </button>
  );
}