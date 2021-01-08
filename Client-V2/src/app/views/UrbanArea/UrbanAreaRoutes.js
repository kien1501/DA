import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const UrbanAreaTable = EgretLoadable({
  loader: () => import("./UrbanAreaTable")
});
const ViewComponent = withTranslation()(UrbanAreaTable);

const urbanAreaRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"directory/urban-area",
    exact: true,
    component: ViewComponent
  }
];

export default urbanAreaRoutes;
