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
  MenuItem, 
} from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import { vehicleConfig } from "../../configs/vehicleConfig";
import { DataGrid } from "@mui/x-data-grid";
import { StyledGridOverlay } from "../../configs/GlobalStyles/StyledComponents";
import NoRowsSVG from "../../configs/GlobalStyles/NoRowsSVG";
import { useForm, SubmitHandler } from "react-hook-form";
import agent from "../../api/agent";
import { Amenitydto } from "../../interfaces/AminityDto";
import { AmenityType } from "../../enum/amenityType";

// interface Amenity {
//   id: number;
//   name: string;
//   amenityType: AmenityType;
//   price: string;
// }

// enum AmenityType {
//   Champagne = "Champagne",
//   Snacks = "Snacks",
//   Beer = "Beer",
// }

const useStyles = makeStyles(vehicleConfig);

const Amenity: React.FC = () => {
  const classes = useStyles();
  const [amenities, setAmenities] = useState<Amenitydto[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Partial<Amenitydto>>({
    name: "",
    amenityType: AmenityType.Champagne,
    price: "",
  });
  const { register, handleSubmit, reset, formState: { errors }, trigger } = useForm<Amenitydto>();
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState<number | null>(null);

  const onSubmit: SubmitHandler<Amenitydto> = async (data) => {
    try {
      const amenityData = {
        ...data,
      };

      if (selectedAmenity) {

        if (selectedAmenity.id) {
          const updateObj = { ...amenityData, id: selectedAmenity.id };
          await agent.Aminity.updateAminity(updateObj);
        } else {
          const postData = {
            ...amenityData,
          };
          // await axios.post(`${url}/Amenities/CreateAmenities`, postData);
          await agent.Aminity.createAminity(postData);
        }
        reset();
        await fetchAmenities();
        setOpenDialog(false);
        setSelectedAmenity({});
        toast.success("Amenity saved successfully");
      }
    } catch (error) {
      console.error("Error saving/editing amenity:", error);
      toast.error("Error saving/editing amenity");
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      // const response = await axios.get(`${url}/Amenities/GetAllAmenities`);
      // setAmenities(response.data);
      await agent.Aminity.GetALlAminity().then((response) => setAmenities(response))
    } catch (error) {
      console.error("Error fetching amenities:", error);
      toast.error("Error fetching amenities");
    }
  };

  const deleteAmenity = async (id: number) => {
    try {
      await agent.Aminity.deleteAminity(id)
      fetchAmenities();
      toast.success("Amenity deleted successfully");
    } catch (error) {
      console.error("Error deleting amenity:", error);
      toast.error("Error deleting amenity");
    }
  };

  const handleConfirmDelete = (id: number) => {
    setAmenityToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDelete = () => {
    if (amenityToDelete !== null) {
      deleteAmenity(amenityToDelete);
      setAmenityToDelete(null);
      setConfirmDeleteDialog(false);
    }
  };

  const handleEditAmenity = (amenity: Amenitydto) => {
    setSelectedAmenity(amenity);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedAmenity({});
    setOpenDialog(false);
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
      >
        Create Amenity
      </Button>

      <Divider style={{ margin: "30px 0" }} />

      <Box sx={{ width: "100%", height: "calc(100% - 200px)" }}>
        <DataGrid
          rows={amenities}
          autoHeight
          columns={[
            { field: "name", headerName: "Name", flex: 1 },
            {
              field: "amenityType",
              headerName: "amenityType",
              flex: 1,
              renderCell: (params) => params.value,
            },
            { field: "price", headerName: "Price", flex: 1 },
            {
              field: "actions",
              headerName: "Actions",
              width: 300,
              renderCell: (params: { row: Amenitydto }) => (
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
                    onClick={() => handleEditAmenity(params.row)}
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
        <DialogTitle>
          {selectedAmenity.id ? "Edit Amenity" : "Create Amenity"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              label="Name"
              type="text"
              defaultValue={selectedAmenity.name}
              {...register("name")}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
              onFocus={() => {
                
                trigger("name");
              }}
              onChange={() => {
                
                trigger("name");
              }}
            />
            <TextField
              select
              label="Amenity Type"
              {...register("amenityType")}
              defaultValue={selectedAmenity.amenityType}
              fullWidth
              variant="outlined"
              margin="normal"
            >
              {Object.values(AmenityType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Price"
              type="number"
              defaultValue={selectedAmenity.price}
              {...register("price")}
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
          Are you sure you want to delete this amenity?
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

export default Amenity;
