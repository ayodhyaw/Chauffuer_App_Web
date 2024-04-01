import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        'https://localhost:7202/api/Auth/ForgotPassword',
        { email }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error occurred:', error);   
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <Box
      sx={{
        width: 500,
        maxWidth: '100%',
      }}
    >
      <TextField
        fullWidth
        label="Email"
        id="email"
        value={email}
        onChange={handleChange}
      />
      <button onClick={handleForgotPassword}>Forgot Password</button>
    </Box>
  );
}
