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
import { useForm, SubmitHandler } from "react-hook-form"
import agent from "../../api/agent";

interface Brand {
  id: number;
  name: string;
  description: string;
  
}

const useStyles = makeStyles(vehicleConfig);

const Brand: React.FC = () => {
  const classes = useStyles();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Partial<Brand>>({
    name: "",
    description: "",
  });
  const {register,handleSubmit,reset,formState: { errors },} = useForm<Brand>()
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false); 
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null);

  const onSubmit: SubmitHandler<Brand> = async (data) => {
    console.log(data)
    try {

        if (selectedBrand) {
          if (selectedBrand.id) {
           const updateObj = {...data, id: selectedBrand.id}
            await agent.Brand.updateDBrand(updateObj)
          } else {
            
            await agent.Brand.createBrand(data);
          }
          reset();
          await fetchBrands();
          setOpenDialog(false);
          setSelectedBrand({});
          toast.success("Brand saved successfully");
        }
      } catch (error) {
        console.error("Error saving/editing Brand:", error);
        toast.error("Error saving/editing Brand");
      }
}


  useEffect(() => {
    fetchBrands();
  }, []);

  // const fetchCompanies = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${url}/Brand/GetAllBrands`
  //     );
  //     setBrands(response.data);
  //     console.log(response.data)
  //   } catch (error) {
  //     console.error("Error fetching Brands:", error);
  //   }
  // };
  const fetchBrands = async () => {
    try {
     await agent.Brand.GetALlBrand().then((respond) => setBrands(respond))
    } catch (error) {
      console.error("Error fetching Brands:", error);
    }
  };
  const deleteBrand = async (id: number) => {
    try {
      await agent.Brand.deleteBrand(id)
      fetchBrands();
      toast.success("Brand deleted successfully");
    } catch (error) {
      console.error("Error deleting Brand:", error);
      toast.error("Error deleting Brand");
    }
  };

  const handleConfirmDelete = (id: number) => {
    setBrandToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDelete = () => {
    if (brandToDelete !== null) {
      deleteBrand(brandToDelete);
      setBrandToDelete(null);
      setConfirmDeleteDialog(false);
    }
  };

  const handleEditBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedBrand({});
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
          rows={brands}
          autoHeight
          columns={[
            { field: "name", headerName: "Name", flex: 1 },
            { field: "description", headerName: "Description", flex: 1 },
            {
              field: "actions",
              headerName: "Actions",
              width: 300, 
              renderCell: (params: { row: Brand }) => (
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
                    onClick={() => handleEditBrand(params.row)}
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
            type="text"
            defaultValue={selectedBrand?.name}
            {...register("name")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Description"
            
            defaultValue={selectedBrand?.description}
            {...register("description")}
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

export default Brand;
