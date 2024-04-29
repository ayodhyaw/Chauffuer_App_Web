export interface ChauffuerDto {
    id: number;
    firstName:string;
    lastName:string;
    email: string;
    licenseNumber: string;
    phoneNumber: string;
    password: string;
    chauffeurVehicleId?: number;
    workingHours?: string;
    regionId?: number;
    companyId?: number;
    files?: File[];
  }