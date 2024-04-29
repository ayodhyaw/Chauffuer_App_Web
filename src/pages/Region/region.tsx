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

interface Region {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  zipCode: number;
}

const useStyles = makeStyles(vehicleConfig);

const Region: React.FC = () => {
  const classes = useStyles();
  const [regions, setRegions] = useState<Region[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Partial<Region>>({
    name: "",
    latitude: "",
    longitude:"",
    zipCode:0
  });
  const {register,handleSubmit,reset,formState: { errors },} = useForm<Region>()
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false); 
  const [RegionToDelete, setRegionToDelete] = useState<number | null>(null);

  const onSubmit: SubmitHandler<Region> = async (data) => {
    console.log(data)
    try {

        if (selectedRegion) {
          if (selectedRegion.id) {
           const updateObj = {...data, id: selectedRegion.id}
           await agent.Region.updateRegion(updateObj);
          } else {
            
           await agent.Region.createRegion(data);
          }
          reset();
         await fetchRegion();
          setOpenDialog(false);
          setSelectedRegion({});
          toast.success("Region saved successfully");
        }
      } catch (error) {
        console.error("Error saving/editing Region:", error);
        toast.error("Error saving/editing Region");
      }
}


  useEffect(() => {
    fetchRegion();
  }, []);

  const fetchRegion = async () => {
    try {
      await agent.Region.GetALlRegion().then((response) =>setRegions(response));
    } catch (error) {
      console.error("Error fetching Regions:", error);
    }
  };
  const deleteRegion = async (id: number) => {
    try {
      await agent.Region.deleteRegion(id);
      fetchRegion();
      toast.success("Region deleted successfully");
    } catch (error) {
      console.error("Error deleting Region:", error);
      toast.error("Error deleting Region");
    }
  };

  const handleConfirmDelete = (id: number) => {
    setRegionToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDelete = () => {
    if (RegionToDelete !== null) {
      deleteRegion(RegionToDelete);
      setRegionToDelete(null);
      setConfirmDeleteDialog(false);
    }
  };

  const handleEditCompany = (region: Region) => {
    setSelectedRegion(region);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedRegion({});
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
        Create Region
      </Button>

      <Divider style={{ margin: "30px 0" }} />

      <Box sx={{ width: "100%", height: "calc(100% - 200px)" }}>
        <DataGrid
          rows={regions}
          autoHeight
          columns={[
            { field: "name", headerName: "Name", flex: 1 },
            { field: "latitude", headerName: "Latitude", flex: 1 },
            { field: "longitude", headerName: "Longitude", flex: 1 },
            { field: "zipCode", headerName: "ZipCode", flex: 1 },

            {
              field: "actions",
              headerName: "Actions",
              width: 300, 
              renderCell: (params: { row: Region }) => (
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
        <DialogTitle>Edit Company</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label="Name"
            defaultValue={selectedRegion?.name}
            {...register("name")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="latitude"
            
            defaultValue={selectedRegion?.latitude}
            {...register("latitude")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="longitude"
            
            defaultValue={selectedRegion?.latitude}
            {...register("longitude")}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="zipCode"
            
            defaultValue={selectedRegion?.latitude}
            {...register("zipCode")}
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
          Are you sure you want to delete this Brand?
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

export default Region;
