import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const ProjectTable = EgretLoadable({
  loader: () => import("./ProjectTable")
});
const ViewComponent = withTranslation()(ProjectTable);
const projectRoutes = [
  {
    path: ConstantList.ROOT_PATH + "directory/project",
    exact: true,
    component: ViewComponent
  }
];

export default projectRoutes;
