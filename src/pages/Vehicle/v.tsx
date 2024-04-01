import React, { useState,useEffect  } from 'react';
import { makeStyles } from '@mui/styles';
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
} from '@mui/material';
import Box from '@mui/material/Box';
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import { vehicleConfig } from '../../configs/vehicleConfig';
import { DataGrid } from '@mui/x-data-grid';
import { StyledGridOverlay } from "../../configs/GlobalStyles/StyledComponents";
import NoRowsSVG from "../../configs/GlobalStyles/NoRowsSVG";

interface Vehicle {
  id: number;
  name: string;
  seatingCapacity: number;
  vehicleNumber: string;
  costPerKm: string;
  costPerHour: string;
  costPerDay: string;
  brand: { 
    name: string;
    id:number;
  };
  vehicleType: {
    name : string;
    id:number;
    
    
  },
}
const useStyles = makeStyles(vehicleConfig);

const V: React.FC = () => {
  const classes = useStyles();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Vehicle[]>([]);
  const[vehicleType, setVhicleType] = useState<Vehicle[]>([]);
  const {register,handleSubmit,reset,formState: { errors },} = useForm<Vehicle>()
  const [selectedVehicle, setSelectedVehicle] = useState<Partial<Vehicle>>({
    name: "",
    seatingCapacity: 0,
    vehicleNumber: "",
    costPerKm: "",
    costPerHour: "",
    costPerDay: "",
    brand: { 
      name: "",
      id:0,
    },
    vehicleType: {
      name : "",
      id:0,
    },
  });
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false); 
  const [companyIdToDelete, setCompanyIdToDelete] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  
  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <NoRowsSVG/>
        <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('https://localhost:7202/api/Brand/GetAllBrands');
        setBrands(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchVehicleType = async () => {
      try {
        const response = await axios.get('https://localhost:7202/api/VehicleType/GetAllVehicleType');
        setVhicleType(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching vehicleType:', error);
      }
    };
    fetchVehicleType();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('https://localhost:7202/api/Vehicle/GetAllVehicles'); 
      setVehicles(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };
  console.log(vehicles);
  useEffect(() => {
    fetchVehicles();
  }, []);

  const onSubmit: SubmitHandler<Vehicle> = async (data) => {
    console.log(data)
    try {

        if (selectedVehicle) {
          if (selectedVehicle.id) {
           const updateObj = {...data, id: selectedVehicle.id}
            await axios.put(
              `https://localhost:7202/api/Vehicle/UpdateVehicle?id=${selectedVehicle.id}`,
              updateObj
            );
          } else {
            
            await axios.post(
              "https://localhost:7202/api/Vehicle/CreateVehicle",
              data
            );
          }
          reset();
          fetchVehicles();
          setOpenDialog(false);
          setSelectedVehicle({});
          toast.success("vehicle saved successfully");
        }
      } catch (error) {
        console.error("Error saving/editing company:", error);
        toast.error("Error saving/editing company");
      }
}

  const handleDialogClose = () => {
    setSelectedVehicle({});
    setOpenDialog(false);
  };

  const handleConfirmDelete = (id: number) => {
    setCompanyIdToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDelete = () => {
    if (companyIdToDelete !== null) {
      deleteVehicle(companyIdToDelete);
      setCompanyIdToDelete(null);
      setConfirmDeleteDialog(false);
    }
  };

  const deleteVehicle = async (id: number) => {
    try {
      await axios.delete(
        `https://localhost:7202/api/Vehicle/DeleteVehicle?id=${id}`
      );
      fetchVehicles();
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      console.error("Error deleting Vehicle:", error);
      toast.error("Error deleting Vehicle");
    }
  };

  const handleEditCompany = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenDialog(true);
  };


  return (
    <div className={classes.root}>
      <Typography variant="h5" align="center" gutterBottom>
        Add/Remove/Edit View Vehicle
      </Typography>
      <Button
        variant="contained"
        color="primary"  
        onClick={() => setOpenDialog(true)}>
        Create Vehicle
      </Button>

      <Divider style={{ margin: "30px 0" }} />
      <Box sx={{ width: '100%', height: 'calc(100% - 200px)' }}>
        <DataGrid
         rows={vehicles}
          autoHeight
          columns={[
            { field: 'name', headerName: 'Name', flex: 1 },
            { field: 'seatingCapacity', headerName: 'Seating Capacity', flex: 1 },
            { field: 'vehicleNumber', headerName: 'Vehicle Number', flex: 1 },
            { field: 'costPerKm', headerName: 'Cost Per Km', flex: 1 },
            { field: 'costPerHour', headerName: 'Cost Per Hour', flex: 1 },
            { field: 'costPerDay', headerName: 'Cost Per Day', flex: 1 },
            { field: 'brand', headerName: 'Brand Name', flex: 1, valueGetter: (params) => params.row.brand.name },
            { field: 'vehicleType', headerName: 'Vehicle Type ID', flex: 1 , valueGetter: (params) => params.row.vehicleType.name },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 300,
              renderCell: (params: { row: Vehicle }) => (
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
                    // onClick={() => handleEdit(params.row)}
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
            defaultValue={selectedVehicle?.name}
            {...register("name")}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <TextField
          label="Seating Capacity"
          defaultValue={selectedVehicle?.seatingCapacity}
          {...register("seatingCapacity")}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Vehicle Number"
          defaultValue={selectedVehicle?.vehicleNumber}
          {...register("vehicleNumber")}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Cost Per Km"
          defaultValue={selectedVehicle?.costPerKm}
          {...register("costPerKm")}
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Cost Per Hour"
          defaultValue={selectedVehicle?.costPerHour}
          {...register("costPerHour")} 
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Cost Per Day"
          defaultValue={selectedVehicle?.costPerDay}
          {...register("costPerDay")} 
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
          <TextField
          select
          label="Brand"
          defaultValue={selectedVehicle.brand?.name}
          onChange={(e) =>
            setSelectedVehicle((prevState) => ({
              ...prevState,
              brand: {
                ...prevState.brand,
                name: e.target.value,
                id: parseInt(e.target.value)
              },
            }))
          }
          fullWidth
          sx={{ marginBottom: '20px' }}
        >
          {brands.map((brand) => (
            <MenuItem key={brand.id} value={brand.name}>
              {brand.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="VehicleType"
          defaultValue={selectedVehicle.vehicleType?.name}
          onChange={(e) =>
            setSelectedVehicle((prevState) => ({
              ...prevState,
              vehicleType: {
                ...prevState.vehicleType,
                name: e.target.value,
                id: parseInt(e.target.value)
              },
            }))
          }
          fullWidth
          sx={{ marginBottom: '20px' }}
        >
          {vehicleType.map((vehicleType) => (
            <MenuItem key={vehicleType.id} value={vehicleType.name}>
              {vehicleType.name}
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
    </div>
  );
};

export default V;
