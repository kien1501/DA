import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/apartment/";

export const getAllByRoot = () => {
  return axios.get(API_PATH + "/1/10");
};

export const searchByPage = (searchObject) => {
  return axios.post(API_PATH +  "searchByPage", searchObject);
};

export const deleteItem = id => {
  return axios.delete(API_PATH+ id);
};

export const handleDeleteList = listAlert => {
  return axios.delete(API_PATH,listAlert );
};

export const saveItem = item => {
  return axios.post(API_PATH, item);
};

export const updateItem = item => {
  return axios.put(API_PATH +item.id, item);
};

export const getItemById = id => {
  return axios.get(API_PATH + id);
};

export const searchByRealEstateOwner = (searchObject) => {
  return axios.post(API_PATH +  "searchByRealEstateOwner", searchObject);
};

export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  return axios.get(API_PATH + "checkCode", config);
};
export const checkCodeOwner = (id, code) => {
  const config = { params: {id: id, code: code } };
  return axios.get(API_PATH + "checkCodeOwner", config);
};
export const getChildAdminUnit = id => {
  return axios.get(API_PATH + "getAllAdminUnitChildIdByParent/"+  id);
};