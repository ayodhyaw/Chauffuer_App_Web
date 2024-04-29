import axios, { AxiosResponse } from "axios";
import { VehicleTypeDto } from "../interfaces/VehicleTypeDto";
import { RegionDto } from "../interfaces/RegionDto";
import { DocumentTypeDto } from "../interfaces/DocumentTypeDto";
import { BrandDto } from "../interfaces/BrandDto";
import { CompanyDto } from "../interfaces/CompanyDto";
import { ChauffuerDto } from "../interfaces/ChauffuerDto";
import { Amenitydto } from "../interfaces/AminityDto";
import { VehicleDto } from "../interfaces/VehicleDto";
import { VehicleAminitiesDto } from "../interfaces/VehicleAminitiesDto";
import { LoginDto } from "../interfaces/LoginDto";
import { CompanyUserDto } from "../interfaces/CompanyUserDto";
import { config } from "process";
import { ChauffuerVehicleDto } from "../interfaces/ChauffuerVehicleDto";



axios.defaults.baseURL = 'https://localhost:7202/api';
axios.interceptors.request.use(config => {
   const token = localStorage.getItem('jwt');
   if(token) config.headers.Authorization = `Bearer ${token}` 
   return config;
})

 
const responseBody =<T> (response : AxiosResponse<T>) => response.data;

const requests = {
    get : <T>(url: string) => axios.get<T>(url).then(responseBody),
    post :<T> (url: string, body:{}) => axios.post<T>(url,body).then(responseBody),
    put : <T>(url: string, body : {}) => axios.put<T>(url,body).then(responseBody),
    del : <T>(url: string) => axios.delete(url).then<T>(responseBody),
}

const VehicleType = {
    
    GetALlVehicleType: () => requests.get<VehicleTypeDto[]>('/VehicleType/GetAllVehicleType'),
    createVehicleType: (vehicleType: VehicleTypeDto) => requests.post<void>('/VehicleType/CreateVehicleType',vehicleType),
    updateVehicleType: (vehicleType: VehicleTypeDto) => requests.put<void>(`/VehicleType/UpdateVehicleType?id=${vehicleType.id}`,vehicleType),
    deleteVehicleType: (id: number) => requests.del<void>(`/VehicleType/DeleteVehicleType?id=${id}`)
}
const Region = {
    
    GetALlRegion: () => requests.get<RegionDto[]>('/Region/GetAllRegion'),
    createRegion: (region: RegionDto) => requests.post<void>('/Region/CreateRegion',region),
    updateRegion: (region: RegionDto) => requests.put<void>(`/Region/UpdateRegion?id=${region.id}`,region),
    deleteRegion: (id: number) => axios.delete<void>(`/Region/DeleteRegion?id=${id}`)
}

const DocumentType = {
    GetALlDocumentType: () => requests.get<DocumentTypeDto[]>('/DocumentType/GetAllDocumentType'),
    createDocumentType: (documentType: DocumentTypeDto) => requests.post<void>('/DocumentType/CreateDocumentType',documentType),
    updateDocumentType: (documentType: DocumentTypeDto) => requests.put<void>(`/DocumentType/UpdateDocumentType?id=${documentType.id}`,documentType),
    deleteDocumentType: (id: number) => axios.delete<void>(`/DocumentType/DeleteDocumentType?id=${id}`)
}

const Brand = {
    GetALlBrand: () => requests.get<BrandDto[]>('/Brand/GetAllBrands'),
    createBrand: (brand: BrandDto) => requests.post<void>('/Brand/CreateBrand',brand),
    updateDBrand: (brand: BrandDto) => requests.put<void>(`/Brand/UpdateBrand?id=${brand.id}`,brand),
    deleteBrand: (id: number) => axios.delete<void>(`/Brand/Deletebrand?id=${id}`)
}

const Company = {
    GetALlCompany: () => requests.get<CompanyDto[]>('/Company/GetAllCompany'),
    createCompany: (company: CompanyDto) => requests.post<void>('/Company/RegisterCompany',company),
    updateCompany: (company: CompanyDto) => requests.put<void>(`/Company/UpdateCompany?id=${company.id}`,company),
    deleteCompany: (id: number) => axios.delete<void>(`/Company/DeleteCompany?id=${id}`)
}

const Chauffuer = {
    GetALlChauffuer: () => requests.get<ChauffuerDto[]>('/Chauffeur/GetAllChauffeurs'),
    createChauffuer: (chauffuer: ChauffuerDto) => requests.post<void>('/Chauffeur/CreateChaufuer',chauffuer),
    updateChauffuer: (chauffuer: ChauffuerDto) => requests.put<void>(`/Chauffeur/UpdateChauffeur?id=${chauffuer.id}`,chauffuer),
    deleteChauffuer: (id: number) => axios.delete<void>(`/Chauffeur/DeleteChauffeur?id=${id}`)
}

const Aminity = {
    GetALlAminity: () => requests.get<Amenitydto[]>('/Amenities/GetAllAmenities'),
    createAminity: (aminity: Amenitydto) => requests.post<void>('/Amenities/CreateAmenities',aminity),
    updateAminity: (aminity: Amenitydto) => requests.put<void>(`/Amenities/UpdateAmenitiese?id=${aminity.id}`,aminity),
    deleteAminity: (id: number) => axios.delete<void>(`/Amenities/DeleteAmenitiese?id=${id}`)
}

const Vehicle = {
    GetALlVehicle: () => requests.get<VehicleDto[]>('/Vehicle/GetAllVehicles'),
    createVehicle: (vehicle: VehicleDto) => requests.post<void>('/Vehicle/CreateVehicle',vehicle),
    updateVehicle: (vehicle: VehicleDto) => requests.put<void>(`/Vehicle/UpdateVehicle?id=${vehicle.id}`,vehicle),
    deleteVehicle: (id: number) => axios.delete<void>(`/Vehicle/DeleteVehicle?id=${id}`),
    AddAminitiesToVehicle: (aminity: VehicleAminitiesDto) => requests.post<void>('/Vehicle/AddAmenitiesToVehicle',aminity),
}

const CompanyUser = {
    GetAllCompanyUsers: () => requests.get<CompanyUserDto[]>('/CompanyUser/GetAllCompanyUsers'),
    RegisterCompanyUsers: (vehicle: CompanyUserDto) => requests.post<void>('/CompanyUser/RegisterCompanyUsers',vehicle),
    updateCompanyUser: (vehicle: CompanyUserDto) => requests.put<void>(`/CompanyUser/UpdateCompanyUser?id=${vehicle.id}`,vehicle),
    deleteCompanyUser: (id: number) => axios.delete<void>(`/CompanyUser/DeleteCompanyUser?id=${id}`),

}
const ChauffeurVehicle = {
    AddVehicleToChauffuer: (aminity: ChauffuerVehicleDto) => requests.post<void>('/ChauffuerVehicle/AddVehicleToChauffuer',aminity),

}

const Login = {
    
    login: (loginDto:LoginDto ) => axios.post<void>(`/Auth/Login`,loginDto),
    
}
const UpdateUser = {
    
    UpdateUser: (loginDto:LoginDto ) => axios.post<void>(`/Auth/Login`,loginDto),
    
}
const agent = {
    VehicleType,
    Region,
    DocumentType,
    Brand,
    Company,
    Chauffuer,
    Aminity,
    Vehicle,
    ChauffeurVehicle,
    CompanyUser
    
}

export default agent;