import React, { useState,useEffect  } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Button,
  TextField,
  Typography,
  Divider,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonGroup
} from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios'; 
import { vehicleConfig } from '../../configs/vehicleConfig';
import { ToastContainer, toast } from "react-toastify";
import NoRowsSVG from '../../configs/GlobalStyles/NoRowsSVG';
import { StyledGridOverlay } from "../../configs/GlobalStyles/StyledComponents";
import url from '../../BackendUrl';
import { SubmitHandler, useForm } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Chauffuer {
  id: number;
  firstName:string;
  lastName:string;
  email: string;
  licenseNumber: string;
  phoneNumber: string;
  password: string;
  chauffeurVehicleId?: number;
  workingHours?: string;
  regionId?: number;
  companyId?: number;
  files?: File[];

}

const useStyles = makeStyles(vehicleConfig);

const Chauffuer: React.FC = () => {
  const classes = useStyles();
  const [chauffuer, setchauffuer] = useState<Chauffuer[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChauffeur, setSelectedChauffeur] =  useState<Partial<Chauffuer>>({
    
    firstName: '',
    lastName:'',
    email: '',
    licenseNumber: '',
    phoneNumber: '',
    password: '',
    workingHours:'',
    regionId:undefined ,
    companyId : undefined,
  });
  const {register,handleSubmit,reset,formState: { errors },} = useForm<Chauffuer>()
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false); 
  const [companyIdToDelete, setCompanyIdToDelete] = useState<number | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const fetchChauffuers = async () => {
    try {
      const response = await axios.get('https://localhost:7202/api/Chauffeur/GetAllChauffeurs'); 
      setchauffuer(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };
  console.log(chauffuer);
  useEffect(() => {
    fetchChauffuers();
  }, []);

  console.log(chauffuer);
  useEffect(() => {
  }, []);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const handlePreviewClose = () => {
    setPreviewDialogOpen(false);
  };

  const handlePreviewOpen = (image: string) => {
    setPreviewImage(image);
    setPreviewDialogOpen(true);
  };

  const onSubmit: SubmitHandler<Chauffuer> = async (data) => {
    console.log(data)
    try {

        if (selectedChauffeur) {
          if (selectedChauffeur.id) {
           const updateObj = {...data, id: selectedChauffeur.id}
            await axios.put(
              `${url}/Chauffeur/UpdateChauffeur?id=${selectedChauffeur.id}`,
              updateObj
            );
          } else {
            
            await axios.post(
              `${url}/Chauffeur/CreateChaufuer`,
              data
            );
          }
          reset();
          fetchChauffuers();
          setOpenDialog(false);
          setSelectedChauffeur({});
          toast.success("Company saved successfully");
        }
      } catch (error) {
        console.error("Error saving/editing company:", error);
        toast.error("Error saving/editing company");
      }
}

const deleteChauffuer = async (id: number) => {
  try {
    await axios.delete(
      `${url}/Chauffeur/DeleteChauffeur?id=${id}`
    );
    fetchChauffuers();
    toast.success("Chauffuer deleted successfully");
  } catch (error) {
    console.error("Error deleting Chauffuer:", error);
    toast.error("Error deleting Chauffuer");
  }
};

const handleConfirmDelete = (id: number) => {
  setCompanyIdToDelete(id);
  setConfirmDeleteDialog(true);
};

const handleDelete = () => {
  if (companyIdToDelete !== null) {
    deleteChauffuer(companyIdToDelete);
    setCompanyIdToDelete(null);
    setConfirmDeleteDialog(false);
  }
};

const handleEditCompany = (company: Chauffuer) => {
  setSelectedChauffeur(company);
  setOpenDialog(true);
};

const handleDialogClose = () => {
  setSelectedChauffeur({});
  setOpenDialog(false);
};

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files) {
    const filesArray = Array.from(event.target.files);
    setUploadedFiles(filesArray);
  }
};

const handleFileRemove = (index: number) => {
  const updatedFiles = [...uploadedFiles];
  updatedFiles.splice(index, 1);
  setUploadedFiles(updatedFiles);
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
      <ToastContainer />
      <Button
        variant="contained"
        color="primary"
        
        onClick={() => setOpenDialog(true)}
      >
        Create Chauffuer
      </Button>

     
      <Divider style={{ margin: '20px 0' }} />
      <Box sx={{ width: '100%', height: 'calc(100% - 200px)' }}>
      <DataGrid
  autoHeight
  columns={[
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'licenseNumber', headerName: 'License Number', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
    { field: 'workingHours', headerName: 'Working Hours', flex: 1 },
    { field: 'companyId', headerName: 'Company ID', flex: 1 },
    { field: 'regionId', headerName: 'Region ID', flex: 1 },
    
    { field: 'availabilityStatus', headerName: 'Availability', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params: { row: Chauffuer }) => (
        <>
        <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button
          // variant="contained"
          color="secondary"
          onClick={() => handleConfirmDelete(params.row.id)}
          // style={{ marginRight: 10 }}
        >
          <DeleteIcon/>
        </Button>
  
        <Button
        // variant="contained"
        // color="primary"
        onClick={() => handleEditCompany(params.row)}
      >
        <EditIcon/>
      </Button>
        </ButtonGroup>
      </>
      ),
    },
  ]}
  rows={chauffuer}
  slots={{ noRowsOverlay: CustomNoRowsOverlay }}
/>
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Company</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label="First Name"
            defaultValue={selectedChauffeur?.firstName}
            {...register("firstName")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
           <TextField
            label="Last Name"
            defaultValue={selectedChauffeur?.lastName}
            {...register("lastName")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Email"
            defaultValue={selectedChauffeur?.email}
            {...register("email")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
            <TextField
            label="phone Number"
            defaultValue={selectedChauffeur?.phoneNumber}
            {...register("phoneNumber")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="licenseNumber"
            defaultValue={selectedChauffeur?.licenseNumber}
            {...register("licenseNumber")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="workingHours"
            defaultValue={selectedChauffeur?.workingHours}
            {...register("workingHours")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
           <TextField
            label="workingHours"
            defaultValue={selectedChauffeur?.workingHours}
            {...register("workingHours")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
              <TextField
            label="companyId"
            defaultValue={selectedChauffeur?.companyId}
            {...register("companyId")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="regionId"
            defaultValue={selectedChauffeur?.regionId}
            {...register("regionId")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="password"
            defaultValue={selectedChauffeur?.password}
            {...register("password")}
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

      <Dialog open={previewDialogOpen} onClose={handlePreviewClose}>
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <img src={previewImage} alt="Preview" style={{ maxWidth: '100%' }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Chauffuer;