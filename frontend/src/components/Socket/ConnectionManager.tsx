import React from 'react';
import { io } from 'socket.io-client';

const socket = io();

export const ConnectionManager = () => {
  const connect = () => {
    socket.connect();
  }

  const disconnect = () => {
    socket.disconnect();
  }

  return (
    <>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>
    </>
  );
}