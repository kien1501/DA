import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH_ROLE = ConstantList.API_ENPOINT + "/api/roles/";
const API_PATH = ConstantList.API_ENPOINT + "/api/roles/";

const API_PATH_PROJECT = ConstantList.API_ENPOINT + "/api/project/";

export const getAllByRoot = () => {
  return axios.get(API_PATH_PROJECT + "/1/10");
};

export const searchByPage = (searchObject) => {
  return axios.post(API_PATH_PROJECT +  "searchByPage", searchObject);
};

export const deleteItem = id => {
  return axios.delete(API_PATH_PROJECT+ id);
};

export const handleDeleteList = listAlert => {
  return axios.delete(API_PATH_PROJECT,listAlert );
};

export const saveItem = item => {
  return axios.post(API_PATH_PROJECT, item);
};

export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  return axios.get(API_PATH_PROJECT + "checkCode", config);
};


// chua sua
export const getAllRoles = () => {
  var url = API_PATH_ROLE + 'all';
  return axios.get(url);
};


export const getAllItem = () => {
  var url = ConstantList.API_ENPOINT + "/api/project/1/10";
  return axios.get(url);
};

export const getFlatRootChild = () => {
  var url = ConstantList.API_ENPOINT + "/api/project/getflatrootchild";
  return axios.get(url);
};

export const getAllprojectByRoleList = () => {
  var url = ConstantList.API_ENPOINT + "/api/project/getmenubyuser";
  return axios.get(url);
};


export const getItemById = id => {
  var API_PATH = ConstantList.API_ENPOINT + "/api/project";
  var url = API_PATH + "/" + id;
  return axios.get(url);
};



