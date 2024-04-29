
export interface CompanyUserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    address: string;
    city: string;
    password: string;
    gender: string;
    company: {
      name: string;
      id: number;
    };
  }