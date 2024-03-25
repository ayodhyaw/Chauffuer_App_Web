import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { ToastContainer, toast } from 'react-toastify';
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
} from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import { vehicleConfig } from '../../configs/vehicleConfig';
import { StyledGridOverlay } from './StyledComponents';
import { Table } from 'reactstrap';
import { DataGrid } from '@mui/x-data-grid';

interface Company {
id: number;
name: string;
email: string;
phoneNumber: string;
}

const useStyles = makeStyles(vehicleConfig);

const Company: React.FC = () => {
const classes = useStyles();
const [Companies, setCompanies] = useState<Company[]>([]);
const [newCompany, setNewCompany] = useState<Partial<Company>>({
name: '',
email: '',
phoneNumber: '',
});
const [openDialog, setOpenDialog] = useState(false);
const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

useEffect(() => {
fetchCompanies();
}, []);

const fetchCompanies = async () => {
try {
const response = await axios.get('https://localhost:7202/api/Company/GetAllCompany');
setCompanies(response.data);
console.log(response.data);
} catch (error) {
console.error('Error fetching companies:', error);
}
};

const createCompany = async () => {
try {
await axios.post('https://localhost:7202/api/Company/RegisterCompany', newCompany);
fetchCompanies();
setNewCompany({
name: '',
email: '',
phoneNumber: '',
});
toast.success('Company created successfully');
} catch (error) {
// console.error('Error creating company:', error);
toast.error('Error creating company');
}
};
const deleteCompany = async (id: number) => {
try {
await axios.delete(`https://localhost:7202/api/Company/DeleteCompany?id=${id}`);
fetchCompanies();
toast.success('Company deleted successfully');
} catch (error) {
console.error('Error deleting company:', error);
toast.error('Error deleting company');
}
};

const handleEditCompany = (company: Company) => {
 setSelectedCompany(company);
 setOpenDialog(true);
};

const handleDialogClose = () => {
setSelectedCompany(null);
setOpenDialog(false);
};

const handleSaveEdit = async () => {
 try {
   if (selectedCompany) {
     if (selectedCompany.id) {
     console.log(selectedCompany);
    // Update existing company
    await axios.put(`https://localhost:7202/api/Company/UpdateCompany?id=${selectedCompany.id}`, selectedCompany);
   } else {
    // Save newly added company
    await axios.post('https://localhost:7202/api/Company/RegisterCompany', selectedCompany);
   }
   fetchCompanies();
   setOpenDialog(false);
   toast.success('Company saved successfully');
  }
 } catch (error) {
  console.error('Error saving/editing company:', error);
  toast.error('Error saving/editing company');
 }
};


const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const { name, value } = e.target;
 setSelectedCompany(prevState => ({
  ...(prevState as Company),
  [name]: value,
 }));
};

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
Add/Remove/Edit Company
</Typography>
<form className={classes.form} style={{ textAlign: 'center' }}>
<TextField
label="Name"
name="Name"
value={newCompany.name}
onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
fullWidth
variant="outlined"
margin="normal"
/>
<TextField
label="Email"
name="Email"
value={newCompany.email}
onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
fullWidth
variant="outlined"
margin="normal"
/>
<TextField
label="Phone Number"
name="PhoneNumber"
value={newCompany.phoneNumber}
onChange={(e) => setNewCompany({ ...newCompany, phoneNumber: e.target.value })}
fullWidth
variant="outlined"
margin="normal"
/>
<Button variant="contained" color="primary" onClick={createCompany}>Create</Button>
</form>
<Divider style={{ margin: '20px 0' }} />

<Box sx={{ width: '100%', height: 'calc(100% - 200px)' }}>
<DataGrid
rows={Companies}
autoHeight
columns={[
{ field: 'name', headerName: 'Name', flex: 1 },
{ field: 'email', headerName: 'Email', flex: 1 },
{ field: 'phoneNumber', headerName: 'phoneNumber', flex: 1 },

{
field: 'actions',
headerName: 'Actions',
width: 300, // Increase width to accommodate two buttons
renderCell: (params: { row: Company }) => (
<>
<Button
variant="contained"
color="secondary"
onClick={() => deleteCompany(params.row.id)}
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
<DialogContent>
<TextField
label="Name"
name="Name"
defaultValue={selectedCompany?.name}
onChange={handleInputChange}
fullWidth
variant="outlined"
margin="normal"
/>
<TextField
label="Email"
name="Email"
defaultValue={selectedCompany?.email}
onChange={handleInputChange}
fullWidth
variant="outlined"
margin="normal"
/>
<TextField
label="Phone Number"
name="PhoneNumber"
defaultValue={selectedCompany?.phoneNumber}
onChange={handleInputChange}
fullWidth
variant="outlined"
margin="normal"
/>
</DialogContent>

<DialogActions>
<Button onClick={handleDialogClose} color="secondary">Cancel</Button>
<Button onClick={handleSaveEdit} color="primary">Save</Button>
</DialogActions>
</Dialog>

<ToastContainer />

</div>
);
};

export default Company;