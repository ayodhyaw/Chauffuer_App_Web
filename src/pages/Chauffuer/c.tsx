import React, { useState, useEffect } from 'react';
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

interface Chauffeur {
  id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  LicenseNumber: string;
  PhoneNumber: string;
  Password: string;
  costPerDay: string;
  WorkingHours: string;
  RegionId?: number;
  CompanyId?: number;
}

const useStyles = makeStyles(vehicleConfig);

const ChauffeurComponent: React.FC = () => {
  const classes = useStyles();
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [companies, setCompanies] = useState<Chauffeur[]>([]);
  const [regions, setRegions] = useState<Chauffeur[]>([]);
  const [newChauffeur, setNewChauffeur] = useState<Partial<Chauffeur>>({
    FirstName: '',
    LastName: '',
    Email: '',
    LicenseNumber: '',
    PhoneNumber: '',
    Password: '',
    costPerDay: '',
    WorkingHours: '',
    RegionId: undefined,
    CompanyId: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chauffeurResponse = await axios.get('URL_FOR_CHAUFFEUR_API');
        setChauffeurs(chauffeurResponse.data);

        const companyResponse = await axios.get('URL_FOR_COMPANY_API');
        setCompanies(companyResponse.data);

        const regionResponse = await axios.get('URL_FOR_REGION_API');
        setRegions(regionResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addChauffeur = async () => {
    try {
      const response = await axios.post('URL_FOR_ADD_CHAUFFEUR_API', newChauffeur);
      setChauffeurs([...chauffeurs, response.data]);
      setNewChauffeur({
        FirstName: '',
        LastName: '',
        Email: '',
        LicenseNumber: '',
        PhoneNumber: '',
        Password: '',
        costPerDay: '',
        WorkingHours: '',
        RegionId: undefined,
        CompanyId: undefined,
      });
    } catch (error) {
      console.error('Error adding chauffeur:', error);
    }
  };

  return (
    <div className={classes.root}>
      {/* Form for adding a chauffeur */}
      <form className={classes.form}>
        {/* Input fields */}
        {/* Button to add chauffeur */}
      </form>

   
    </div>
  );
};

export default ChauffeurComponent;
