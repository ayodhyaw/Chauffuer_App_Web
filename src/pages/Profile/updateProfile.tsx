import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Button,
  TextField,
  Divider,
} from '@mui/material';
import axios from 'axios'; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import url from '../../BackendUrl';

const backgroundImageUrl = 'your_background_image_url_here';

const useStyles = makeStyles({
  // root: {
  //   margin: '20px',
  //   backgroundImage: `url(${backgroundImageUrl})`,
  //   backgroundSize: 'cover',
  //   minHeight: '100vh',
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  root: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 0,
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(#2171d1, #364597, #222222)',
    zIndex: 9999, 
  },
  form: {
    textAlign: 'center',
    maxWidth: '600px', // Adjust the width as needed
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust the opacity as needed
    borderRadius: '8px',
  },
});

const UpdateProfile: React.FC = () => {
  const classes = useStyles();

  const [selectedProfile, setSelectedProfile] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    gender: 0,
    role: 0,
    chauffuerId: 0,
    passengerId: 0,
    companyUserId: 0
  });

  useEffect(() => {
    const userFromStorage = localStorage.getItem('userDetails');
    const userSubject = userFromStorage ? JSON.parse(userFromStorage) : null;
    if (userSubject) {
      setSelectedProfile(userSubject);
    }
  }, []);

  const handleUpdateProfile = () => {
    axios.put(`${url}/updateProfile/${selectedProfile.id}`, selectedProfile)
      .then(response => {
        console.log(response.data); // Assuming the response contains updated user details
        toast.success('Profile updated successfully');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
      });
  };

  return (
    <div className={classes.root}>
      <ToastContainer />
      <form className={classes.form}>
        <TextField
          label="First Name"
          value={selectedProfile.firstName}
          onChange={e => setSelectedProfile({ ...selectedProfile, firstName: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={selectedProfile.lastName}
          onChange={e => setSelectedProfile({ ...selectedProfile, lastName: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={selectedProfile.email}
          onChange={e => setSelectedProfile({ ...selectedProfile, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          value={selectedProfile.phoneNumber}
          onChange={e => setSelectedProfile({ ...selectedProfile, phoneNumber: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfile;
