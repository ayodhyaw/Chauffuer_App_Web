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
import { vehicleConfig } from "../../configs/vehicleConfig";
import { DataGrid } from "@mui/x-data-grid";
import { StyledGridOverlay } from "../../configs/GlobalStyles/StyledComponents";
import NoRowsSVG from "../../configs/GlobalStyles/NoRowsSVG";
import { useForm, SubmitHandler } from "react-hook-form";
import agent from "../../api/agent";

interface VehicleType {
  id: number;
  name: string;
  features: string;

}

const useStyles = makeStyles(vehicleConfig);

const VehicleType: React.FC = () => {
  const classes = useStyles();
  const [vehicleTypes, setVehicleType] = useState<VehicleType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<
    Partial<VehicleType>
  >({
    name: "",
    features: "",

  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleType>();
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [VehicleTypeToDelete, setVehicleTypeToDelete] = useState<number | null>(
    null
  );

  const onSubmit: SubmitHandler<VehicleType> = async (data) => {
    console.log(data);
    try {
      if (selectedVehicleType) {
        if (selectedVehicleType.id) {
          const updateObj = { ...data, id: selectedVehicleType.id };
     
          await agent.VehicleType.updateVehicleType(updateObj);
        } else {
          
          await agent.VehicleType.createVehicleType(data);
        }
        reset();
        await fetchVehicleTypes();
        setOpenDialog(false);
        setSelectedVehicleType({});
        toast.success("VehicleType saved successfully");
      }
    } catch (error) {
      console.error("Error saving/editing VehicleType:", error);
      toast.error("Error saving/editing VehicleType");
    }
  };

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  // const fetchCompanies = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${url}/VehicleType/GetAllVehicleType`
  //     );
  //     setVehicleType(response.data);
  //     console.log(response.data)
  //   } catch (error) {
  //     console.error("Error fetching VehicleType:", error);
  //   }
  // };

  const fetchVehicleTypes = async () => {
    try {
      await agent.VehicleType.GetALlVehicleType().then((response) =>
        setVehicleType(response)
      );
    } catch (error) {
      console.error("Error fetching VehicleType:", error);
    }
  };

  const deleteVehicleType = async (id: number) => {
    try {
      // await axios.delete(
      //   `${url}/VehicleType/DeleteVehicleType?id=${id}`
      // );
      await agent.VehicleType.deleteVehicleType(id);
      fetchVehicleTypes();
      toast.success("VehicleType deleted successfully");
    } catch (error) {
      console.error("Error deleting VehicleType:", error);
      toast.error("Error deleting VehicleType");
    }
  };

  const handleConfirmDelete = (id: number) => {
    setVehicleTypeToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDelete = () => {
    if (VehicleTypeToDelete !== null) {
      deleteVehicleType(VehicleTypeToDelete);
      setVehicleTypeToDelete(null);
      setConfirmDeleteDialog(false);
    }
  };

  const handleEditVehicleType = (VehicleType: VehicleType) => {
    setSelectedVehicleType(VehicleType);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedVehicleType({});
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
        Create VehicleType
      </Button>

      <Divider style={{ margin: "30px 0" }} />

      <Box sx={{ width: "100%", height: "calc(100% - 200px)" }}>
        <DataGrid
          rows={vehicleTypes}
          autoHeight
          columns={[
            { field: "name", headerName: "Name", flex: 1 },
            { field: "features", headerName: "Features", flex: 1 },
            {
              field: "actions",
              headerName: "Actions",
              width: 300,
              renderCell: (params: { row: VehicleType }) => (
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
                    onClick={() => handleEditVehicleType(params.row)}
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
        <DialogTitle>Edit VehicleType</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              label="Name"
              defaultValue={selectedVehicleType?.name}
              {...register("name")}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Features"
              defaultValue={selectedVehicleType?.features}
              {...register("features")}
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
          Are you sure you want to delete this VehicleType?
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

export default VehicleType;
