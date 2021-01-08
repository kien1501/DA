import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const RealEstateOwnerType = EgretLoadable({
  loader: () => import("./RealEstateOwnerType")
});
const ViewComponent = withTranslation()(RealEstateOwnerType);

const RealEstateOwnerTypeRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"directory/ownertype",
    exact: true,
    component: ViewComponent
  }
];

export default RealEstateOwnerTypeRoutes;