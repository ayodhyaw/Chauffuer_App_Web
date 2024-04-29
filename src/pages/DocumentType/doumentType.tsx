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

interface DocumentType {
  id: number;
  name: string;
  description: string; 
}

const useStyles = makeStyles(vehicleConfig);

const DocumentType: React.FC = () => {
  const classes = useStyles();
  const [documentType, setDocumentTypes] = useState<DocumentType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<Partial<DocumentType>>({
    name: "",
    description: "",
  });
  const {register,handleSubmit,reset,formState: { errors },} = useForm<DocumentType>()
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false); 
  const [documentTypeToDelete, setDocumentTypeToDelete] = useState<number | null>(null);

  const onSubmit: SubmitHandler<DocumentType> = async (data) => {
    console.log(data)
    try {

        if (selectedDocumentType) {
          if (selectedDocumentType.id) {
           const updateObj = {...data, id: selectedDocumentType.id}
         await agent.DocumentType.updateDocumentType(updateObj);
          } else {
            
           await agent.DocumentType.createDocumentType(data);
           
          }
          reset();
          await fetchCompanies();
          setOpenDialog(false);
          setSelectedDocumentType({});
          toast.success("Company saved successfully");
        }
      } catch (error) {
        console.error("Error saving/editing documentType:", error);
        toast.error("Error saving/editing documentType");
      }
}
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
     await agent.DocumentType.GetALlDocumentType()
    } catch (error) {
      console.error("Error fetching documentTypes:", error);
    }
  };

  const deleteCompany = async (id: number) => {
    try {
      await agent.DocumentType.deleteDocumentType(id);
      fetchCompanies();
      toast.success("documentType deleted successfully");
    } catch (error) {
      console.error("Error deleting documentType:", error);
      toast.error("Error deleting documentType");
    }
  };

  const handleConfirmDelete = (id: number) => {
    setDocumentTypeToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDelete = () => {
    if (documentTypeToDelete !== null) {
      deleteCompany(documentTypeToDelete);
      setDocumentTypeToDelete(null);
      setConfirmDeleteDialog(false);
    }
  };

  const handleEditCompany = (documentType: DocumentType) => {
    setSelectedDocumentType(documentType);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedDocumentType({});
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
        Create DocumentType
      </Button>

      <Divider style={{ margin: "30px 0" }} />

      <Box sx={{ width: "100%", height: "calc(100% - 200px)" }}>
        <DataGrid
          rows={documentType}
          autoHeight
          columns={[
            { field: "name", headerName: "Name", flex: 1 },
            { field: "description", headerName: "Description", flex: 1 },
            {
              field: "actions",
              headerName: "Actions",
              width: 300, 
              renderCell: (params: { row: DocumentType }) => (
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
            defaultValue={selectedDocumentType?.name}
            {...register("name")}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Description"
        
            defaultValue={selectedDocumentType?.description}
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
      <ToastContainer />
    </div>
  );
};

export default DocumentType;
