import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const Logout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true); 
  }, []);

  const handleLogout = () => {

    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('loggedInUserName');


    navigate("/");
  };

  const handleClose = () => {
 
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLogout} color="primary" autoFocus>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Logout;
