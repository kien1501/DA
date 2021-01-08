import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/menuitem";
const API_PATH_ROLE = ConstantList.API_ENPOINT + "/api/roles/";
const API_PATH_BUILDING = ConstantList.API_ENPOINT + "/api/realestate-building/";

export const getAllByRoot = () => {
  return axios.get(API_PATH_BUILDING + "/1/10");
};

export const searchByPage = (searchObject) => {
  return axios.post(API_PATH_BUILDING +  "searchByPage", searchObject);
};

export const deleteItem = id => {
  return axios.delete(API_PATH_BUILDING+ id);
};

export const handleDeleteList = listAlert => {
  return axios.delete(API_PATH_BUILDING,listAlert );
};

export const saveItem = item => {
  return axios.post(API_PATH_BUILDING, item);
};

export const getItemById = id => {
  return axios.get(API_PATH_BUILDING + id);
};

export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  return axios.get(API_PATH_BUILDING + "checkCode", config);
};


//CHUA ---SUA
export const getAllRoles = () => {
  var url = API_PATH_ROLE + 'all';
  return axios.get(url);
};

// export const searchByPage = (searchObject) => {
//   var url = API_PATH + "/searchByPage";
//   return axios.post(url, searchObject);
// };
export const getAllItem = () => {
  var url = ConstantList.API_ENPOINT + "/api/menuitem/getall";
  return axios.get(url);
};

export const getFlatRootChild = () => {
  var url = ConstantList.API_ENPOINT + "/api/menuitem/getflatrootchild";
  return axios.get(url);
};

export const getAllMenuItemByRoleList = () => {
  var url = ConstantList.API_ENPOINT + "/api/menuitem/getmenubyuser";
  return axios.get(url);
};




