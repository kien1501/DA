import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Agent = EgretLoadable({
  loader: () => import("./Agent")
});
const ViewComponent = withTranslation()(Agent);
const AgentRoutes = [
  {
    path: ConstantList.ROOT_PATH + "directory/agent",
    exact: true,
    component: ViewComponent
  }
];

export default AgentRoutes;