import React, { useState,useEffect  } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Button,
  TextField,
  Typography,
  Divider,
  MenuItem,
} from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import axios from 'axios'; 
import { vehicleConfig } from '../../configs/vehicleConfig';

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

const Vehicle: React.FC = () => {
  const classes = useStyles();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Vehicle[]>([]);
  const[vehicleType, setVhicleType] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    name: '',
    seatingCapacity: 0,
    vehicleNumber: '',
    costPerKm: '',
    costPerHour: '',
    costPerDay: '',
    brand: {
      name: '',
      id: 0,
    },
    vehicleType: {
      name: '',
      id: 0,
    },
  });
  

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

  const addVehicle = async () => {
    try {
      // Find the selected brand by its name and get its ID
      const selectedBrand = brands.find(brand => brand.name === newVehicle.brand?.name);
      const brandId = selectedBrand ? selectedBrand.id : null;
  
      const selectedVehicleType = vehicleType.find(vehicleType => vehicleType.name === newVehicle.vehicleType?.name);
      const vehicleTypeId = selectedVehicleType ? selectedVehicleType.id : null;
      // Include the brand ID in the newVehicle object
      const vehicleToAdd = {
        ...newVehicle,
        brandId: brandId || 0,
        vehicleTypeId: vehicleTypeId|| 0
      };
      
      console.log(vehicleToAdd,'vehicleToAdd');
      const response = await axios.post('https://localhost:7202/api/Vehicle/CreateVehicle', vehicleToAdd);
      setVehicles([...vehicles, response.data]);
      // Reset newVehicle state
      setNewVehicle({
        name: '',
        seatingCapacity: 0,
        vehicleNumber: '',
        costPerKm: '',
        costPerHour: '',
        costPerDay: '',
        brand: {
          name: '',
          id: 0
        },
        vehicleType: {
          name: '',
          id: 0
        },
      });
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };
  

  const removeVehicle = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7202/api/Vehicle/SoftDelete?${id}&isDeleting=true`); 
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    } catch (error) {
      console.error('Error removing vehicle:', error);
    }
  };

  const editVehicle = async () => {
    if (!selectedVehicle) return;

    try {
      const response = await axios.put(`https://localhost:7202/api/Vehicle/EditVehicle/${selectedVehicle.id}`, newVehicle);
      const updatedVehicleIndex = vehicles.findIndex(vehicle => vehicle.id === selectedVehicle.id);
      const updatedVehicles = [...vehicles];
      updatedVehicles[updatedVehicleIndex] = response.data;
      setVehicles(updatedVehicles);
      setSelectedVehicle(null);
    } catch (error) {
      console.error('Error editing vehicle:', error);
    }
  };

  const handleRowClick = (params: { row: Vehicle }) => {
    setNewVehicle(params.row);
    setSelectedVehicle(params.row);
  };

  const handleEdit = (vehicle: Vehicle) => (
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleRowClick({ row: vehicle })}
      style={{ marginRight: 10 }}
    >
      Edit
    </Button>
  );

  const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
      fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
      fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
      fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
      fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
      fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
      fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
  }));
  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
        style={{ flexShrink: 0 }}
        width="240"
        height="200"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5" align="center" gutterBottom>
        Add/Remove/Edit View Vehicle
      </Typography>
      <form className={classes.form} style={{ textAlign: 'center' }}>
        <TextField
          label="Name"
          value={newVehicle.name}
          onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Seating Capacity"
          type="number"
          value={newVehicle.seatingCapacity}
          onChange={e =>
            setNewVehicle({
              ...newVehicle,
              seatingCapacity: parseInt(e.target.value),
            })
          }
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Vehicle Number"
          value={newVehicle.vehicleNumber}
          onChange={e => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Cost Per Km"
          value={newVehicle.costPerKm}
          onChange={e => setNewVehicle({ ...newVehicle, costPerKm: e.target.value })}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Cost Per Hour"

          value={newVehicle.costPerHour}
          onChange={e => setNewVehicle({ ...newVehicle, costPerHour: e.target.value })}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Cost Per Day"

          value={newVehicle.costPerDay}
          onChange={e => setNewVehicle({ ...newVehicle, costPerDay: e.target.value })}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
               <TextField
          select
          label="Brand"
          value={newVehicle.brand?.name}
          onChange={(e) =>
            setNewVehicle((prevState) => ({
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
          value={newVehicle.vehicleType?.name}
          onChange={(e) =>
            setNewVehicle((prevState) => ({
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

        {/* <TextField
          label="Vehicle Type ID"

          value={newVehicle.vehicleTypeId}
          onChange={e => setNewVehicle({ ...newVehicle, vehicleTypeId: e.target.value })}
          fullWidth
        /> */}
        <Button variant="contained" color="primary" onClick={selectedVehicle ? editVehicle : addVehicle}>
          {selectedVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
        </Button>
     
      </form>
      <Divider style={{ margin: '20px 0' }} />
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
              width: 300, // Increase width to accommodate two buttons
              renderCell: (params: { row: Vehicle }) => (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeVehicle(params.row.id)}
                    style={{ marginRight: 10 }}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(params.row)}
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
    </div>
  );
};

export default Vehicle;
