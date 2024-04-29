export interface VehicleDto {
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
  