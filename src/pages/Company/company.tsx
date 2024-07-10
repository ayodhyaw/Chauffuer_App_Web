import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import { vehicleConfig } from "../../configs/vehicleConfig";
import { DataGrid } from "@mui/x-data-grid";
import { StyledGridOverlay } from "../../configs/GlobalStyles/StyledComponents";
import NoRowsSVG from "../../configs/GlobalStyles/NoRowsSVG";
import { useForm, SubmitHandler } from "react-hook-form"
import url from "../../BackendUrl";
import agent from "../../api/agent";

interface Company {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

const useStyles = makeStyles(vehicleConfig);

const Company: React.FC = () => {
  const classes = useStyles();
  const [Companies, setCompanies] = useState<Company[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Partial<Company>>({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const {register,handleSubmit,reset,formState: { errors },} = useForm<Company>()
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false); 
  const [companyIdToDelete, setCompanyIdToDelete] = useState<number | null>(null);

  const onSubmit: SubmitHandler<Company> = async (data) => {
    console.log(data)
    try {

        if (selectedCompany) {
          if (selectedCompany.id) {
           const updateObj = {...data, id: selectedCompany.id}
           await agent.Company.updateCompany(updateObj);
          } else {
            await agent.Company.createCompany(data);
          }
          reset();
          fetchCompanies();
          setOpenDialog(false);
          setSelectedCompany({});
          toast.success("Company saved successfully");
        }
      } catch (error) {
        console.error("Error saving/editing company:", error);
        toast.error("Error saving/editing company");
      }
}


  useEffect(() => {
    fetchCompanies();
  }, []);

  // const fetchCompanies = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${url}/Company/GetAllCompany`
  //     );
  //     setCompanies(response.data);
  //     console.log(response.data)
  //   } catch (error) {
  //     console.error("Error fetching companies:", error);
  //   }
  // };

  const fetchCompanies = async () => {
    try {
     await agent.Company.GetALlCompany().then((response) => setCompanies(response))
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const deleteCompany = async (id: number) => {
    try {
      await agent.Company.deleteCompany(id);
      fetchCompanies();
      toast.success("Company deleted successfully");
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Error deleting company");
    }
  };

  const handleConfirmDelete = (id: number) => {
    setCompanyIdToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDelete = () => {
    if (companyIdToDelete !== null) {
      deleteCompany(companyIdToDelete);
      setCompanyIdToDelete(null);
      setConfirmDeleteDialog(false);
    }
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedCompany({});
    setOpenDialog(false);
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
      <Button
        variant="contained"
        color="primary"
        
        onClick={() => setOpenDialog(true)}
      >
        Create Company
      </Button>

      <Divider style={{ margin: "30px 0" }} />

      <Box sx={{ width: "100%", height: "calc(100% - 200px)" }}>
        <DataGrid
          rows={Companies}
          autoHeight
          columns={[
            { field: "name", headerName: "Name", flex: 1 },
            { field: "email", headerName: "Email", flex: 1 },
            { field: "phoneNumber", headerName: "phoneNumber", flex: 1 },

            {
              field: "actions",
              headerName: "Actions",
              width: 300, 
              renderCell: (params: { row: Company }) => (
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
                    onClick={() => handleEditCompany(params.row)}
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
            label="Name"
            type="text"
            defaultValue={selectedCompany?.name}
            {...register("name")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            defaultValue={selectedCompany?.email}
            {...register("email")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Phone Number"    
            type="number"
            {...register("phoneNumber")}
            defaultValue={selectedCompany?.phoneNumber}
            fullWidth
            variant="outlined"
            margin="normal"
          />
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

export default Company;
