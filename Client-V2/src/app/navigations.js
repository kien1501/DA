import ConstantList from "./appConfig";
export const navigations = [
  {
    name: "Dashboard.dashboard",
    icon: "dashboard",
    path: ConstantList.ROOT_PATH + "dashboard/analytics",
    isVisible:true,
  },
  {
    name: "Dashboard.directory",
    icon: "dashboard",
    path: "",
    isVisible:true,
    children: [
      {
        name: "directory.real_state",
        path: ConstantList.ROOT_PATH+"directory/apartment",
        iconText: "S",
        isVisible:true,
      },
      {
        name: "Dashboard.AdministrativeUnit",
        path: ConstantList.ROOT_PATH+"dashboard/AdministrativeUnits",
        iconText: "S",
        isVisible:true,
      },
      {
        name: "directory.agency",
        path: ConstantList.ROOT_PATH+"directory/agency",
        iconText: "S",
        isVisible:true,
      },
      {
        name: "directory.agent",
        path: ConstantList.ROOT_PATH+"directory/agent",
        iconText: "S",
        isVisible:true,
      },
      {
        name: "directory.source",
        path: ConstantList.ROOT_PATH+"directory/source",
        iconText: "S",
        isVisible:true,
      },
      {
        name: "directory.urbanArea",
        path: ConstantList.ROOT_PATH+"directory/urban-area",
        iconText: "S",
        isVisible:true,
      },
      {
        name: "directory.project",
        path: ConstantList.ROOT_PATH+"directory/project",
        iconText: "S",
        isVisible:true,
      },
      {
        name: "directory.building",
        path: ConstantList.ROOT_PATH+"directory/building",
        iconText: "S",
        isVisible:true,
      },
      {
        name: "directory.stateType",
        path: ConstantList.ROOT_PATH+"directory/statetype",
        iconText: "S",
        isVisible:true,
      },
      {
        name: "directory.RequirementType",
        path: ConstantList.ROOT_PATH+"directory/requirementType",
        iconText: "S",
        isVisible:true,
      },
      {
        name: "directory.ownertype",
        path: ConstantList.ROOT_PATH+"directory/ownertype",
        iconText: "S",
        isVisible:true,
      }

      
    ]
  }  
  ,{
    name: "Dashboard.manage",
    isVisible:true,
    icon: "engineering",
    children: [
      {
        name: "manage.user",
        isVisible:true,
        path: ConstantList.ROOT_PATH + "user_manager/user",
        icon: "keyboard_arrow_right"
      },
      {
        name: "manage.menu",
        isVisible:true,
        path: ConstantList.ROOT_PATH + "list/menu",
        icon: "keyboard_arrow_right"
      }
    ]
  }
];
