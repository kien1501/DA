import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Department = EgretLoadable({
  loader: () => import("./Department")
});
const ViewComponent = withTranslation()(Department);

const departmentRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"directory/department",
    exact: true,
    component: ViewComponent
  }
];

export default departmentRoutes;
