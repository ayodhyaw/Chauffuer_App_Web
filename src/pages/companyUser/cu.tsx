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
  MenuItem,
} from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import { vehicleConfig } from "../../configs/vehicleConfig";
import { StyledGridOverlay } from "../../configs/GlobalStyles/StyledComponents";
import { DataGrid } from "@mui/x-data-grid";
import NoRowsSVG from "../../configs/GlobalStyles/NoRowsSVG";
import agent from "../../api/agent";
import { SubmitHandler, useForm } from "react-hook-form";
import { CompanyDto } from "../../interfaces/CompanyDto";
import { CompanyUserDto } from "../../interfaces/CompanyUserDto";


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

enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}


const useStyles = makeStyles(vehicleConfig);

const CU: React.FC = () => {
  const classes = useStyles();
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false); 
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const { register, handleSubmit, reset } = useForm<CompanyUser>();
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
    gender: Gender.Male,
    company: {
      name: "",
      id: 0,
    },
  });

  useEffect(() => {
    fetchCompanyUsers();
  }, []);

  // const fetchCompanyUsers = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://localhost:7202/api/CompanyUser/GetAllCompanyUsers"
  //     );
  //     setCompanyUsers(response.data);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Error fetching companyUsers:", error);
  //   }
  // };

  const fetchCompanyUsers = async () => {
    try {
      const response = await agent.CompanyUser.GetAllCompanyUsers();
      // Convert CompanyUserDto[] to CompanyUser[]
      const convertedResponse = response.map((user: CompanyUserDto) => ({
        ...user,
        gender: mapGender(user.gender), // Map string gender to Gender enum
      }));
      setCompanyUsers(convertedResponse);
    
    } catch (error) {
      console.error("Error fetching companyUsers:", error);
    }
  };

  const mapGender = (gender: string): Gender => {
    switch (gender) {
      case "Male":
        return Gender.Male;
      case "Female":
        return Gender.Female;
      case "Other":
        return Gender.Other;
      default:
        return Gender.Male; // Default value
    }
  };

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        await agent.Company.GetALlCompany().then((response) => setCompanies(response))
      } catch (error) {
        console.error(" fetching Company:", error);
      }
    };
    fetchCompany();
  }, []);


  // const deleteCompanyUser = async (id: number) => {
  //   try {
  //     await axios.delete(
  //       `https://localhost:7202/api/CompanyUser/DeleteCompanyUser?id=${id}`
  //     );
  //     fetchCompanyUsers();
  //     toast.success("CompanyUser deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting companyUser:", error);
  //     toast.error("Error deleting companyUser");
  //   }
  // };

  const deleteCompanyUser = async (id: number) => {
    try {
      await agent.CompanyUser.deleteCompanyUser(id);
      await fetchCompanyUsers();
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


  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
      <NoRowsSVG/>
        <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  const onSubmit: SubmitHandler<CompanyUser> = async (data) => {
    console.log(data);
    try {
      if (selectedCompanyUser) {
        if (selectedCompanyUser.id) {
          const updateObj = {
            ...data,
            id: selectedCompanyUser.id,
            companyId: data.company.id,
          };
          await agent.CompanyUser.updateCompanyUser(updateObj)
        } else {
          const saveObj = {
            ...data,
            companyId: data.company.id,
          };
          await agent.CompanyUser.RegisterCompanyUsers(saveObj)
        }
        reset();
        await fetchCompanyUsers();
        setOpenDialog(false);
        setselectedCompanyUser({});
        
        toast.success("CompanyUser saved successfully");
      }
    } catch (error) {
      console.error("Error saving/editing CompanyUser:", error);
      toast.error("Error saving/editing CompanyUser");
    }
  };


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
              headerName: "CompanyName",
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
                    onClick={() => handleConfirmDelete(params.row.id)} 
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
        <DialogTitle></DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              label="firstName"
              type="text"
              defaultValue={selectedCompanyUser?.firstName}
              {...register("firstName")}
              fullWidth
              variant="outlined"
              margin="normal"
            />

            <TextField
              label="lastName"
             
              defaultValue={selectedCompanyUser?.lastName}
              {...register("lastName")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="email"
              defaultValue={selectedCompanyUser?.email}
              {...register("email")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="contactNumber"
            
              defaultValue={selectedCompanyUser?.contactNumber}
              {...register("contactNumber")}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="address"
              
              defaultValue={selectedCompanyUser?.address}
              {...register("address")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="city"
              defaultValue={selectedCompanyUser?.city}
              {...register("city")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
                  <TextField
              label="Cost Per Day"
              defaultValue={selectedCompanyUser?.city}
              {...register("city")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
             <TextField
              label="password"
              defaultValue={selectedCompanyUser?.password}
              {...register("password")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
                    <TextField
              select
              label="Gender"
              defaultValue={selectedCompanyUser?.gender}
              {...register("gender")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            >
              {Object.values(Gender).map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Company"
              defaultValue={selectedCompanyUser.company?.name}
              {...register("company.id")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>

          <DialogActions>
            <Button color="primary" type="submit">
              Save
            </Button>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </form>
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

export default CU;
