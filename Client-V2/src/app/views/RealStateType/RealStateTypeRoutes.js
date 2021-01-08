import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const RealStateType = EgretLoadable({
  loader: () => import("./RealStateType")
});
const ViewComponent = withTranslation()(RealStateType);

const RealStateTypeRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"directory/statetype",
    exact: true,
    component: ViewComponent
  }
];

export default RealStateTypeRoutes;