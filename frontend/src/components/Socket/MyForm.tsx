import React, { useState } from 'react';
import { io } from 'socket.io-client';

// const socket = io();

const MyForm = () => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // socket.timeout(5000).emit('create-something', value, () => {
    //   setIsLoading(false);
    // });
  };

  return (
    <form onSubmit={ onSubmit }>
      <input onChange={ e => setValue(e.target.value) } />

      <button type="submit" disabled={ isLoading }>Submit</button>
    </form>
  );
};

export default MyForm;