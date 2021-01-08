import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const RealEstateSourceTable = EgretLoadable({
  loader: () => import("./RealEstateSourceTable")
});
const ViewComponent = withTranslation()(RealEstateSourceTable);

const realEstateSourceRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"directory/source",
    exact: true,
    component: ViewComponent
  }
];

export default realEstateSourceRoutes;
