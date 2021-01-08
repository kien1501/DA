import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';

const ApartmentTable = EgretLoadable({
  loader: () => import("./ApartmentTable")
});
const ViewComponent = withTranslation()(ApartmentTable);

const apartmentRouters = [
  {
    path:  ConstantList.ROOT_PATH+"directory/apartment",
    exact: true,
    component: ViewComponent
  }
];

export default apartmentRouters;