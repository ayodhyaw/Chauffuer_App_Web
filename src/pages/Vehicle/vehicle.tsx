import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
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
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { vehicleConfig } from "../../configs/vehicleConfig";
import { DataGrid } from "@mui/x-data-grid";
import { StyledGridOverlay } from "../../configs/GlobalStyles/StyledComponents";
import NoRowsSVG from "../../configs/GlobalStyles/NoRowsSVG";
import url from "../../BackendUrl";
import ButtonGroup from "@mui/material/ButtonGroup";

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
    id: number;
  };
  vehicleType: {
    name: string;
    id: number;
  };
  company: {
    name: string;
    id: number;
  };
  companyId: number;
}

interface AddAmenitiesFormData {
  quantity: number;
  availabilityStatus: boolean;
  vehicleId: number;
  amenityIds: number[];
  
}

interface Aminity {
  id: number;
  name: string;
}
const useStyles = makeStyles(vehicleConfig);

const Vehicle: React.FC = () => {
  const classes = useStyles();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Vehicle[]>([]);
  const [amenities, setAmenities] = useState<Aminity[]>([]);
  const [vehicleType, setVhicleType] = useState<Vehicle[]>([]);
  const [company, setCompany] = useState<Vehicle[]>([]);
  const { register, handleSubmit, reset } = useForm<Vehicle>();
  const {
    register: registerAddAmenities,
    handleSubmit: handleSubmitAddAmenities,
  } = useForm<AddAmenitiesFormData>();

  const [selectedVehicle, setSelectedVehicle] = useState<Partial<Vehicle>>({
    name: "",
    seatingCapacity: 0,
    vehicleNumber: "",
    costPerKm: "",
    costPerHour: "",
    costPerDay: "",
    companyId: 0,
    brand: {
      name: "",
      id: 0,
    },
    vehicleType: {
      name: "",
      id: 0,
    },
    company: {
      name: "",
      id: 0,
    },
  });
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [companyIdToDelete, setCompanyIdToDelete] = useState<number | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <NoRowsSVG />
        <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${url}/Brand/GetAllBrands`);
        setBrands(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchVehicleType = async () => {
      try {
        const response = await axios.get(
          `${url}/VehicleType/GetAllVehicleType`
        );
        setVhicleType(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching vehicleType:", error);
      }
    };
    fetchVehicleType();
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`${url}/Company/GetAllCompany`);
        setCompany(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(" fetching Company:", error);
      }
    };
    fetchCompany();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${url}/Vehicle/GetAllVehicles`);
      setVehicles(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };
  console.log(vehicles);
  useEffect(() => {
    fetchVehicles();
  }, []);

  const onSubmit: SubmitHandler<Vehicle> = async (data) => {
    console.log(data);
    try {
      if (selectedVehicle) {
        if (selectedVehicle.id) {
          const updateObj = {
            ...data,
            id: selectedVehicle.id,
            brandId: data.brand.id,
            vehicleTypeId: data.vehicleType.id,
            companyId: data.company.id,
          };
          await axios.put(
            `${url}/Vehicle/UpdateVehicle?id=${selectedVehicle.id}`,
            updateObj
          );
        } else {
          const saveObj = {
            ...data,
            brandId: data.brand.id,
            vehicleTypeId: data.vehicleType.id,
            companyId: data.company.id,
          };
          await axios.post(
            "https://localhost:7202/api/Vehicle/CreateVehicle",
            saveObj
          );
        }
        reset();
        fetchVehicles();
        setOpenDialog(false);
        //setSelectedVehicle({});
        toast.success("vehicle saved successfully");
      }
    } catch (error) {
      console.error("Error saving/editing company:", error);
      toast.error("Error saving/editing company");
    }
  };

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
      await axios.delete(`${url}/Vehicle/DeleteVehicle?id=${id}`);
      fetchVehicles();
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      console.error("Error deleting Vehicle:", error);
      toast.error("Error deleting Vehicle");
    }
  };

  const handleEditCompany = (vehicle: Vehicle) => {
    console.log(vehicle);

    setOpenDialog(true);
    setSelectedVehicle(vehicle);
    console.log(selectedVehicle);
  };

  const [openAddAmenitiesDialog, setOpenAddAmenitiesDialog] = useState(false);

  const handleAddAmenities = () => {
    setOpenAddAmenitiesDialog(true);
  };
  // const handleAddAmenitiesSubmit = async (data: any) => {
  //   try {  
  //     console.log(data)
  //     // Make an API call to add amenities to the vehicle

  //     const response = await axios.post(
  //       "https://localhost:7202/api/Vehicle/AddAmenitiesToVehicle",
  //       data
        
  //     );
    
  //     // Handle the response as needed
  //     console.log("Amenities added to vehicle:", response.data);
  //     toast.success("Amenities added to vehicle successfully");

  //     // Close the dialog
  //     setOpenAddAmenitiesDialog(false);
  //   } catch (error) {
  //     console.error("Error adding amenities to vehicle:", error);
  //     toast.error("Error adding amenities to vehicle");
  //   }
  // };

  const AminitySubmit: SubmitHandler<AddAmenitiesFormData> = async (data) => {
    console.log(data);
    try {  
      console.log(data)
    
      const postData = {...data,amenityIds:[data.amenityIds]}
      console.log(postData)
      const response = await axios.post(
        "https://localhost:7202/api/Vehicle/AddAmenitiesToVehicle",
        postData
        
      );
    
    
      console.log("Amenities added to vehicle:", response.data);
      toast.success("Amenities added to vehicle successfully");

    
      setOpenAddAmenitiesDialog(false);
    } catch (error) {
      console.error("Error adding amenities to vehicle:", error);
      toast.error("Error adding amenities to vehicle");
    }
  };

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get(`${url}/Amenities/GetAllAmenities`);
        setAmenities(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };
    fetchAmenities();
  }, []);
  
 
  return (
    <div className={classes.root}>
      <Typography variant="h5" align="center" gutterBottom>
        Add/Remove/Edit View Vehicle
      </Typography>
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create Vehicle
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddAmenities}
          style={{ marginRight: "10px" }}
        >
          Add Amenities to Vehicle
        </Button>
      </ButtonGroup>

      <Divider style={{ margin: "30px 0" }} />
      <Box sx={{ width: "100%", height: "calc(100% - 200px)" }}>
        <DataGrid
          rows={vehicles}
          autoHeight
          columns={[
            { field: "name", headerName: "Name", flex: 1 },
            {
              field: "seatingCapacity",
              headerName: "Seating Capacity",
              flex: 1,
            },
            { field: "vehicleNumber", headerName: "Vehicle Number", flex: 1 },
            { field: "costPerKm", headerName: "Cost Per Km", flex: 1 },
            { field: "costPerHour", headerName: "Cost Per Hour", flex: 1 },
            { field: "costPerDay", headerName: "Cost Per Day", flex: 1 },
            {
              field: "company",
              headerName: "Company Name",
              flex: 1,
              valueGetter: (params) => params.row.company.name,
            },
            {
              field: "brand",
              headerName: "Brand Name",
              flex: 1,
              valueGetter: (params) => params.row.brand.name,
            },
            {
              field: "vehicleType",
              headerName: "Vehicle Type ID",
              flex: 1,
              valueGetter: (params) => params.row.vehicleType.name,
            },
            {
              field: "actions",
              headerName: "Actions",
              width: 300,
              renderCell: (params: { row: Vehicle }) => (
                <>
                  <Button
                    variant="contained"
                    color="error"
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
        <DialogTitle></DialogTitle>
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
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Vehicle Number"
              defaultValue={selectedVehicle?.vehicleNumber}
              {...register("vehicleNumber")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Cost Per Km"
              defaultValue={selectedVehicle?.costPerKm}
              {...register("costPerKm")}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Cost Per Hour"
              defaultValue={selectedVehicle?.costPerHour}
              {...register("costPerHour")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Cost Per Day"
              defaultValue={selectedVehicle?.costPerDay}
              {...register("costPerDay")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              select
              label="Company"
              defaultValue={selectedVehicle.company?.name}
              {...register("company.id")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            >
              {company.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Brand"
              defaultValue={selectedVehicle.brand?.name}
              {...register("brand.id")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            >
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="VehicleType"
              defaultValue={selectedVehicle.vehicleType?.name}
              {...register("vehicleType.id")}
              fullWidth
              sx={{ marginBottom: "20px" }}
            >
              {vehicleType.map((vehicleType) => (
                <MenuItem key={vehicleType.id} value={vehicleType.id}>
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
      <Dialog
        open={openAddAmenitiesDialog}
        onClose={() => setOpenAddAmenitiesDialog(false)}
      >
        <DialogTitle>Add Amenities to Vehicle</DialogTitle>
        <form onSubmit={handleSubmitAddAmenities(AminitySubmit)}>
        <DialogContent>
          <TextField
            label="Quantity"
            fullWidth
            variant="outlined"
            margin="normal"
            {...registerAddAmenities("quantity")}
          />
          <TextField
            label="Availability Status"
            fullWidth
            variant="outlined"
            margin="normal"
            {...registerAddAmenities("availabilityStatus")}
          />
          <TextField
            label="Vehicle ID"
            fullWidth
            variant="outlined"
            margin="normal"
            {...registerAddAmenities("vehicleId")}
          />
          {/* <TextField
            label="Amenity IDs"
            fullWidth
            variant="outlined"
            margin="normal"
            {...registerAddAmenities("amenityIds")}
          />
   */}
    <TextField
    select
    label="Amenity"
    fullWidth
    variant="outlined"
    margin="normal"
    {...registerAddAmenities("amenityIds")}
  >
    {amenities.map((amenity) => (
      <MenuItem key={amenity?.id} value={amenity.id}>
        {amenity.name}
      </MenuItem>
    ))}
  </TextField>
        
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => setOpenAddAmenitiesDialog(false)}
          >
            Cancel
          </Button>
          <Button type="submit" color="primary" >
            Add Amenities
          </Button>
        </DialogActions>
</form>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default Vehicle;
