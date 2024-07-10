import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginConfigs from '../../configs/loginConfigs';

const defaultTheme = createTheme();

export default function SignUpWithOTP() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createPassenger();
  };
  // http://localhost:5051/api/Auth/LoginWith2FA?phoneNumber=456123&code=123456'
  const createPassenger = () => {
    const url = `http://localhost:5051/api/Auth/LoginWith2FA?phoneNumber=${encodeURIComponent(phoneNumber)}&code=${otp}`;

    axios.post(url)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          navigate("/login");
          toast.success('Login Successful');
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error Login passenger');
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: loginConfigs.gridItems.backgroundImage,
            backgroundRepeat: loginConfigs.gridItems.backgroundRepeat,
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: loginConfigs.gridItems.backgroundSize,
            backgroundPosition: loginConfigs.gridItems.backgroundPosition,
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: loginConfigs.box.display,
              flexDirection: loginConfigs.box.flexDirection,
              alignItems: loginConfigs.box.alignItems,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
             
              <TextField
                margin="normal"
                required
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="otp"
                label="OTP"
                id="otp"
                autoComplete="email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </ThemeProvider>
  );
}
