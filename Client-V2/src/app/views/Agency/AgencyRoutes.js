import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Agency = EgretLoadable({
  loader: () => import("./Agency")
});
const ViewComponent = withTranslation()(Agency);
const AgencyRoutes = [
  {
    path: ConstantList.ROOT_PATH + "directory/agency",
    exact: true,
    component: ViewComponent
  }
];

export default AgencyRoutes;