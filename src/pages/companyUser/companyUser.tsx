import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  TextField,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import { vehicleConfig } from "../../configs/vehicleConfig";
import { StyledGridOverlay } from "../../configs/GlobalStyles/StyledComponents";
import { DataGrid } from "@mui/x-data-grid";
import NoRowsSVG from "../../configs/GlobalStyles/NoRowsSVG";


interface CompanyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  password: string;
  gender: string;
  company: {
    name: string;
    id: number;
  };
}

const useStyles = makeStyles(vehicleConfig);

const CompanyUser: React.FC = () => {
  const classes = useStyles();
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false); 
  const [companyUserToDelete, setCompanyUserToDelete] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompanyUser, setselectedCompanyUser] = useState<Partial<CompanyUser>>({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    city: "",
    password: "",
    gender: "",
    company: {
      name: "",
      id: 0,
    },
  });

  useEffect(() => {
    fetchCompanyUsers();
  }, []);

  const fetchCompanyUsers = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7202/api/CompanyUser/GetAllCompanyUsers"
      );
      setCompanyUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching companyUsers:", error);
    }
  };

  const deleteCompanyUser = async (id: number) => {
    try {
      await axios.delete(
        `https://localhost:7202/api/CompanyUser/DeleteCompanyUser?id=${id}`
      );
      fetchCompanyUsers();
      toast.success("CompanyUser deleted successfully");
    } catch (error) {
      console.error("Error deleting companyUser:", error);
      toast.error("Error deleting companyUser");
    }
  };
  const handleConfirmDelete = (id: number) => {
    setCompanyUserToDelete(id);
    setConfirmDeleteDialog(true);
  };
  
  const handleEditCompanyUser = (companyUser: CompanyUser) => {
    setselectedCompanyUser(companyUser);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setselectedCompanyUser({});
    setOpenDialog(false);
  };

  const handleDelete = () => {
    if (companyUserToDelete !== null) {
        deleteCompanyUser(companyUserToDelete);
        setCompanyUserToDelete(null);
      setConfirmDeleteDialog(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (selectedCompanyUser) {
        if (selectedCompanyUser.id) {
          console.log(selectedCompanyUser);
          // Update existing company
          await axios.put(
            `https://localhost:7202/api/CompanyUser/UpdateCompanyUser?Id=${selectedCompanyUser.id}`,
            selectedCompanyUser
          );
        } else {
          // Save newly added company
          await axios.post(
            "https://localhost:7202/api/CompanyUser/RegisterCompanyUsers",
            selectedCompanyUser
          );
        }
        fetchCompanyUsers();
        setOpenDialog(false);
        setselectedCompanyUser({});
        toast.success("Company saved successfully");
      }
    } catch (error) {
      console.error("Error saving/editing company:", error);
      toast.error("Error saving/editing company");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setselectedCompanyUser((prevState) => ({
      ...(prevState as CompanyUser),
      [name]: value,
    }));
  };

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
      <NoRowsSVG/>
        <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5" align="center" gutterBottom>
        Add/Remove/Edit Company
      </Typography>

      <Button
        variant="contained"
        color="primary"
        
        onClick={() => setOpenDialog(true)}
      >
        Create Company User
      </Button>

      
      <Divider style={{ margin: "20px 0" }} />

      <Box sx={{ width: "100%", height: "calc(100% - 200px)" }}>
        <DataGrid
          rows={companyUsers}
          autoHeight
          columns={[
            { field: "firstName", headerName: "FirstName", flex: 1 },
            { field: "lastName", headerName: "lastName", flex: 1 },
            { field: "email", headerName: "Email", flex: 1 },
            { field: "contactNumber", headerName: "ContactNumber", flex: 1 },
            { field: "address", headerName: "address", flex: 1 },
            { field: "address", headerName: "address", flex: 1 },
            { field: "gender", headerName: "gender", flex: 1 },
            {
              field: "company",
              headerName: "Company Name",
              flex: 1,
              valueGetter: (params) => params.row.company.name,
            },
            {
              field: "actions",
              headerName: "Actions",
              width: 300,
              renderCell: (params: { row: CompanyUser }) => (
                <>
                   <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleConfirmDelete(params.row.id)} // Changed to handleConfirmDelete
                    style={{ marginRight: 10 }}
                  >
                    Remove
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditCompanyUser(params.row)}
                  >
                    Edit
                  </Button>
                </>
              ),
            },
          ]}
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit CompanyUser</DialogTitle>
        <DialogContent>
          <TextField
            label="firstName"
            name="firstName"
            defaultValue={selectedCompanyUser?.firstName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="lastName"
            name="lastName"
            defaultValue={selectedCompanyUser?.lastName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Email"
            name="Email"
            defaultValue={selectedCompanyUser?.email}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="PhoneNumber"
            name="PhoneNumber"
            defaultValue={selectedCompanyUser?.contactNumber}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="address"
            name="address"
            defaultValue={selectedCompanyUser?.address}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="city"
            name="city"
            defaultValue={selectedCompanyUser?.city}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="password"
            name="password"
            defaultValue={selectedCompanyUser?.password}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Gender"
            name="Gender"
            defaultValue={selectedCompanyUser?.gender}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Company"
            name="Company"
            defaultValue={selectedCompanyUser?.company?.name}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={confirmDeleteDialog}
        onClose={() => setConfirmDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this company?
        </DialogContent>
        <DialogActions>
        <Button onClick={handleDelete} color="secondary">
            Yes
          </Button>
          <Button onClick={() => setConfirmDeleteDialog(false)} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>


      <ToastContainer />
    </div>
  );
};

export default CompanyUser;
