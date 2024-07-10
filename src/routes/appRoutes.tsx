import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout";
import HomePage from "../pages/home/HomePage";
import { RouteType } from "./config";
import DefaultPage from "../pages/dashboard/DefaultPage";
import DashboardIndex from "../pages/dashboard/DashboardIndex";
import ChangelogPage from "../pages/changelog/ChangelogPage";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage";
import SaasPage from "../pages/dashboard/SaasPage";
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';
import ComponentPageLayout from "../pages/component/ComponentPageLayout";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AlertPage from "../pages/component/AlertPage";
import ButtonPage from "../pages/component/ButtonPage";
import DocumentationPage from "../pages/documentation/DocumentationPage";
import ManIcon from '@mui/icons-material/Man';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Vehicle from "../pages/Vehicle/vehicle";
import Chauffuer from "../pages/Chauffuer/chauffuer";
import Company from "../pages/Company/company";
import { pink } from "@mui/material/colors";
import CompanyUser from "../pages/companyUser/companyUser";
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import Amenity from "../pages/aminity/aminity";
import Logout from "../pages/Logout/logout";
import LogoutIcon from '@mui/icons-material/Logout';
import DocumentType from "../pages/DocumentType/doumentType";
import SourceIcon from '@mui/icons-material/Source';
import UpdateProfile from "../pages/Profile/updateProfile";
import Person2Icon from '@mui/icons-material/Person2';
import Brand from "../pages/Brand/brand";
import ToysIcon from '@mui/icons-material/Toys';
import Region from "../pages/Region/region";
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import VehicleType from "../pages/VehicleType/vehicleType";
import TimeToLeaveOutlinedIcon from '@mui/icons-material/TimeToLeaveOutlined';

const appRoutes: RouteType[] = [
  // {
  //   index: true,
  //   element: <HomePage/>,
  //   state: "home"
  // },
  // {
  //   path: "/installation",
  //   element: <Login />,
  //   state: "installation",
  //   sidebarProps: {
  //     displayText: "Login",
  //     icon: <FileDownloadOutlinedIcon />
  //   }
  // },
  {
    path: "/dashboard",
    element: <DashboardPageLayout />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Dashboard",
      icon: <DashboardOutlinedIcon />
    },
  },
  // {
  //   path: "/manage",
  //   element: <ComponentPageLayout />,
  //   state: "manage",
  //   sidebarProps: {
  //     displayText: "Manage",
  //     icon: <AppsOutlinedIcon />
  //   },
  //   child: [
  //     {
  //       path: "/manage/addvehicle",
  //       element: <Vehicle />,
  //       state: "manage.addvehicle",
  //       sidebarProps: {
  //         displayText: "Vehicle",
  //         // icon: <DirectionsCarIcon fontSize="small"/>
          
  //       },
  //     },
  //     {
  //       path: "/manage/chauffuer",
  //       element: <Chauffuer />,
  //       state: "manage.chauffuer",
  //       sidebarProps: {
  //         displayText: "Chauffuer"
  //       }
  //     },
  //     {
  //       path: "/manage/company",
  //       element: <Company />,
  //       state: "manage.company",
  //       sidebarProps: {
  //         displayText: "company",

  //       }
  //     },

  //   ]
  // },
  {
    path: "/vehicle",
    element: <Vehicle />,
    state: "vehicle",
    sidebarProps: {
      displayText: "Vehicle",
      icon: <DirectionsCarIcon />
    }
  },
  {
    path: "/chauffuer",
    element: <Chauffuer />,
    state: "chauffuer",
    sidebarProps: {
      displayText: "Chauffuer",
      icon: <ManIcon/>
    }
  },
  {
    path: "/company",
    element: <Company/>,
    state: "company",
    sidebarProps: {
      displayText: "Company",
      icon: <AddHomeWorkIcon/>
    }
  },
  {
    path: "/companyuser",
    element: <CompanyUser/>,
    state: "companyuser",
    sidebarProps: {
      displayText: "CompanyUser",
      icon: <PersonAddAlt1Icon/>
    }
  },
  {
    path: "/aminity",
    element: <Amenity/>,
    state: "aminity",
    sidebarProps: {
      displayText: "Aminity",
      icon: <BrunchDiningIcon/>
    }
  },
  {
    path: "/documenttype",
    element: <DocumentType/>,
    state: "documenttype",
    sidebarProps: {
      displayText: "documenttype",
      icon: <SourceIcon/>
    }
  },
  {
    path: "/brand",
    element: <Brand/>,
    state: "brand",
    sidebarProps: {
      displayText: "Brand",
      icon: <ToysIcon/>
    }
  },
  {
    path: "/region",
    element: <Region/>,
    state: "region",
    sidebarProps: {
      displayText: "Region",
      icon: <SouthAmericaIcon/>
    }
  },
  {
    path: "/vehicleType",
    element: <VehicleType/>,
    state: "vehicleType",
    sidebarProps: {
      displayText: "VehicleType",
      icon: <TimeToLeaveOutlinedIcon/>
    }
  },
  {
    path: "/profile",
    element: <UpdateProfile/>,
    state: "profile",
    sidebarProps: {
      displayText: "profile",
      icon: <Person2Icon/>
    }
  },
  {
    path: "/logout",
    element: <Logout/>,
    state: "logout",
    sidebarProps: {
      displayText: "Logout",
      icon: <LogoutIcon/>
    }
  },
];

export default appRoutes;