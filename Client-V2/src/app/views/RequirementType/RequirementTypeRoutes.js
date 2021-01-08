import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const RequirementType = EgretLoadable({
  loader: () => import("./RequirementType")
});
const ViewComponent = withTranslation()(RequirementType);
const RequirementTypeRoutes = [
  {
    path: ConstantList.ROOT_PATH + "directory/requirementType",
    exact: true,
    component: ViewComponent
  }
];

export default RequirementTypeRoutes;