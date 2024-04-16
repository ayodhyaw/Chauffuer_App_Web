import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { vehicleConfig } from '../../configs/vehicleConfig';
import { ToastContainer, toast } from "react-toastify";
import NoRowsSVG from '../../configs/GlobalStyles/NoRowsSVG';
import { StyledGridOverlay } from "../../configs/GlobalStyles/StyledComponents";
import url from '../../BackendUrl';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface Chauffeur {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  phoneNumber: string;
  password: string;
  chauffeurVehicleId?: number;
  workingHours?: string;
  regionId?: number;
  companyId?: number;
  images: Image[]; 
}

interface Image{
  id: number;
  url:string;

}

const useStyles = makeStyles(vehicleConfig);

const ChauffuerImagesUpload: React.FC = () => {
  const classes = useStyles();
  const [chauffuer, setchauffuer] = useState<Chauffeur[]>([]);
  const [selectedChauffeur, setSelectedChauffeur] = useState<Chauffeur | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const fetchChauffuers = async () => {
    try {
      const response = await axios.get('https://localhost:7202/api/Chauffeur/GetAllChauffeurs');
      setchauffuer(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchChauffuers();
    
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleImageUpload = async (id: number, image: File) => {
    
    const formData = new FormData();
    formData.append('image', image);
    console.log(formData)
    console.log(image)
    

    try {
    await axios.post(`https://localhost:7202/api/Chauffeur/UploadImage?chauffuerId=${id}`, formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleDocumentUpload = async (id: number, document: File) => {
    const formData = new FormData();
    formData.append('document', document);
    try {
      await axios.post(`https://localhost:7202/api/Chauffeur/${id}/uploadDocument`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };
  const handleImageRemove = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7202/api/Chauffeur/RemoveImage?imageId=${id}`);
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };
  const handleOpenDialog = (chauffeur: Chauffeur) => {
    setSelectedChauffeur(chauffeur);
    setOpenDialog(true);
  };
  const handleDocumentRemove = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7202/api/Chauffeur/${id}/removeDocument`);
      toast.success('Document removed successfully');
    } catch (error) {
      console.error('Error removing document:', error);
      toast.error('Failed to remove document');
    }
  };
  const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(id, file);
    }
  };

  const handleDocumentInputChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = event.target.files?.[0];
    if (file) {
      handleDocumentUpload(id, file);
    }
  };
 
  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <NoRowsSVG />
        <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  return (
    <div className={classes.root}>
      <ToastContainer />
    
      <Box sx={{ width: '100%', height: 'calc(100% - 20px)' }}>
        <DataGrid
          autoHeight
          columns={[
            { field: 'firstName', headerName: 'First Name', },
            { field: 'lastName', headerName: 'Last Name', },
            { field: 'email', headerName: 'Email', flex: 0.2 },
            { field: 'phoneNumber', headerName: 'Phone Number', flex: 0.2 },
            { field: 'companyId', headerName: 'Company ID',  },
            { field: 'availabilityStatus', headerName: 'Availability',  },
            {
              field: 'actions',
              headerName: 'Actions',
              flex: 1,
              width: 600,
              renderCell: (params) => (
                <>
                  <input
                  id=''
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageInputChange(event, params.row.id)}
                  />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => handleDocumentInputChange(event, params.row.id)}
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleImageRemove(params.row.id)}
                  >
                    Remove Image
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDocumentRemove(params.row.id)}
                  >
                    Remove Document
                  </Button>
                  <Button
                    variant="outlined"
                 
                    onClick={() => handleOpenDialog(params.row)}
                  >
                    <AddPhotoAlternateIcon/>
                  </Button>
                </>
              ),
            },
          ]}
          rows={chauffuer}
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        />
      </Box>
          

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Remove Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the document?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleImageRemove(selectedChauffeur?.id || 0)} color="secondary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};


export default ChauffuerImagesUpload;