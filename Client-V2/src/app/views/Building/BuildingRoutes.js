import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const BuildingTable = EgretLoadable({
  loader: () => import("./BuildingTable")
});
const ViewComponent = withTranslation()(BuildingTable);
const BuildingRoutes = [
  {
    path: ConstantList.ROOT_PATH + "directory/building",
    exact: true,
    component: ViewComponent
  }
];

export default BuildingRoutes;
