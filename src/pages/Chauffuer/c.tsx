import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
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
  ButtonGroup,
  Grid,
  Modal,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { vehicleConfig } from "../../configs/vehicleConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoRowsSVG from "../../configs/GlobalStyles/NoRowsSVG";
import { StyledGridOverlay } from "../../configs/GlobalStyles/StyledComponents";
import url from "../../BackendUrl";
import { SubmitHandler, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface Chauffeur {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  phoneNumber: string;
  password: string;
  workingHours?: string;
  regionId?: number;
  companyId?: number;
  files?: File[];
  images: Image[];
}

interface Image {
  id: number;
  url: string;
}

const useStyles = makeStyles(vehicleConfig);

const C: React.FC = () => {
  const classes = useStyles();
  const [chauffeur, setChauffeur] = useState<Chauffeur[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(0);
  const [selectedChauffeur, setSelectedChauffeur] = useState<
    Partial<Chauffeur>
  >({});
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [companyIdToDelete, setCompanyIdToDelete] = useState<number | null>(
    null
  );
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Chauffeur>();

  const fetchChauffeurImages = async (chauffeurId: number) => {
    try {
      const response = await axios.get(
        `https://localhost:7202/api/Chauffeur/GetChauffeurImages?id=${chauffeurId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching chauffeur images:", error);
      return [];
    }
  };

  const fetchChauffeurs = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7202/api/Chauffeur/GetAllChauffeurs"
      );
      setChauffeur(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching chauffeurs:", error);
    }
  };

  useEffect(() => {
    fetchChauffeurs();
  }, []);
  const onSubmit: SubmitHandler<Chauffeur> = async (data) => {
    try {
      if (selectedChauffeur) {
        if (selectedChauffeur.id) {
          const updateObj = { ...data, id: selectedChauffeur.id };
          await axios.put(
            `${url}/Chauffeur/UpdateChauffeur?id=${selectedChauffeur.id}`,
            updateObj
          );
        } else {
          await axios.post(`${url}/Chauffeur/CreateChaufuer`, data);
        }
        reset();
        fetchChauffeurs();
        setOpenDialog(false);
        setSelectedChauffeur({});
        toast.success("Chauffeur saved successfully");
      }
    } catch (error) {
      console.error("Error saving/editing chauffeur:", error);
      toast.error("Error saving/editing chauffeur");
    }
  };

  const deleteChauffeur = async (id: number) => {
    try {
      await axios.delete(`${url}/Chauffeur/DeleteChauffeur?id=${id}`);
      fetchChauffeurs();
      toast.success("Chauffeur deleted successfully");
    } catch (error) {
      console.error("Error deleting Chauffeur:", error);
      toast.error("Error deleting Chauffeur");
    }
  };

  const handleConfirmDelete = (id: number) => {
    setCompanyIdToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDelete = () => {
    if (companyIdToDelete !== null) {
      deleteChauffeur(companyIdToDelete);
      setCompanyIdToDelete(null);
      setConfirmDeleteDialog(false);
    }
  };

  const handleEditCompany = (company: Chauffeur) => {
    setSelectedChauffeur(company);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedChauffeur({});
    setOpenDialog(false);
  };

  const handleImageUpload = async (id: number, image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    try {
      await axios.post(
        `https://localhost:7202/api/Chauffeur/UploadImage?chauffuerId=${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleImageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    console.log("id", id);
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(id, file);
    }
  };

  const handleImageRemove = async (id: number) => {
    try {
      await axios.delete(
        `https://localhost:7202/api/Chauffeur/RemoveImage?imageId=${id}`
      );
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  const openPreviewDialog = (url: string) => {
    setPreviewImage(url);
    setPreviewDialogOpen(true);
  };

  const openImageModal = (id: number) => {
    setSelectedVehicleId(id);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
  };

  const CustomNoRowsOverlay = () => (
    <StyledGridOverlay>
      <NoRowsSVG />
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
  );


  return (
    <div className={classes.root}>
      <ToastContainer />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
      >
        Create Chauffeur
      </Button>
      <Divider style={{ margin: "20px 0" }} />
      <Box sx={{ width: "100%", height: "calc(100% - 200px)" }}>
        <DataGrid
          autoHeight
          columns={[
            { field: "firstName", headerName: "First Name", flex: 1 },
            { field: "lastName", headerName: "Last Name", flex: 1 },
            { field: "email", headerName: "Email", flex: 1 },
            { field: "licenseNumber", headerName: "License Number", flex: 1 },
            { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
            { field: "workingHours", headerName: "Working Hours", flex: 1 },
            { field: "companyId", headerName: "Company ID", flex: 1 },
            { field: "regionId", headerName: "Region ID", flex: 1 },
            {
              field: "availabilityStatus",
              headerName: "Availability",
              flex: 1,
            },
            {
              field: "actions",
              headerName: "Actions",
              width: 250,
              renderCell: (params: { row: Chauffeur }) => (
                <>
                  <ButtonGroup
                    variant="contained"
                    aria-label="Basic button group"
                  >
                    <Button
                      color="secondary"
                      onClick={() => handleConfirmDelete(params.row.id)}
                    >
                      <DeleteIcon />
                    </Button>
                    <Button onClick={() => handleEditCompany(params.row)}>
                      <EditIcon />
                    </Button>
                    <Button onClick={() => openImageModal(params.row.id)}>
                      <AddPhotoAlternateIcon />
                    </Button>
                  </ButtonGroup>
                </>
              ),
            },
          ]}
          rows={chauffeur}
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        />
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Company</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>{/* Form fields */}</DialogContent>
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

      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
      >
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <img src={previewImage} alt="Preview" style={{ maxWidth: "10%" }} />
        </DialogContent>
      </Dialog>
      <Modal open={imageModalOpen} onClose={closeImageModal}>
        <Paper className={classes.modalPaper}>
          {" "}
          {/* Apply custom styles using makeStyles */}
          <Box p={2}>
            <Typography variant="h6">Upload Image</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleImageInputChange(event, selectedVehicleId)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                {/* Display previously uploaded images here */}
                <img src="" alt="" />
                <img
                  src={
                    "https://localhost:7202/Uploads/Docuemnts/Chauffuer/0897654321/0897654321-e56c6fc0-4e53-4387-9028-753a690c6fa0.jpg"
                  }
                  alt=""
                ></img>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Modal>
    </div>
  );
};

export default C;
