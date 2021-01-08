import React from "react";
import { Redirect } from "react-router-dom";
import homeRoutes from "./views/home/HomeRoutes";
import sessionRoutes from "./views/sessions/SessionRoutes";
import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import administrativeUnitRoutes from "./views/AdministrativeUnit/AdministrativeUnitRoutes";
import fiscalYearRoutes from "./views/FiscalYear/FiscalYearRoutes";
import otherRoutes from "./views/others/OtherRoutes";
import UserRoutes from "./views/User/UserRoutes";
import departmentRoutes from "./views/Department/DepartmentRoutes";
import roleRoutes from "./views/Role/RoleRoutes";
import ConstantList from "./appConfig";
import MenuRoutes from "./views/Menus/MenuRoutes";
import pageLayoutRoutes from "./views/page-layouts/PageLayoutRoutees";
import apartmentRouters from "./views/Apartment/ApartmentRouters";
import realEstateSourceRoutes from "./views/RealEstateSource/RealEstateSourceRoutes";
import urbanAreaRoutes from "./views/UrbanArea/UrbanAreaRoutes";
import projectRoutes from "./views/Project/ProjectRoutes";
import BuildingRoutes from "./views/Building/BuildingRoutes";
import RealEstateOwnerTypeRoutes from "./views/RealEstateOwnerType/RealEstateOwnerTypeRoutes";
import RealStateTypeRoutes from "./views/RealStateType/RealStateTypeRoutes";
import AgencyRoutes from "./views/Agency/AgencyRoutes";
import RequirementTypeRoutes from "./views/RequirementType/RequirementTypeRoutes";
import AgentRoutes from "./views/Agent/AgentRoutes";
const redirectRoute = [
  {
    path: ConstantList.ROOT_PATH,
    exact: true,
    component: () => <Redirect to={ConstantList.HOME_PAGE} />//Luôn trỏ về HomePage được khai báo trong appConfig
  }
];

const errorRoute = [
  {
    component: () => <Redirect to={ConstantList.ROOT_PATH + "session/404"} />
  }
];

const routes = [
  ...BuildingRoutes,
  ...projectRoutes,
  ...urbanAreaRoutes,
  ...realEstateSourceRoutes,
  ...apartmentRouters,
  ...homeRoutes,
  ...sessionRoutes,
  ...dashboardRoutes,
  ...administrativeUnitRoutes,
  ...fiscalYearRoutes,
  ...departmentRoutes,
  ...pageLayoutRoutes,
  ...UserRoutes,
  ...roleRoutes,
  ...MenuRoutes,
  ...RealEstateOwnerTypeRoutes,
  ...RealStateTypeRoutes,
  ...AgencyRoutes,
  ...RequirementTypeRoutes,
  ...AgentRoutes,
  ...errorRoute,
 
];

export default routes;
