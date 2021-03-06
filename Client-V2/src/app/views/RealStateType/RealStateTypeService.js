import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/realestatetype";

export const getAll = (pageIndex, pageSize) => {
    return axios.get(API_PATH+`/${pageIndex}/${pageSize}`);
  };

export const addItem = User => {
      return axios.post(API_PATH , User);
    };

export const deleteItem= id => {
  return axios.delete(API_PATH +"/"+id);
};

export const updateItem = asset => {
  return axios.post(API_PATH , asset);
};

export const getItemById = id => {
  return axios.get(API_PATH + "/" + id);
};

export const checkCode = (id, code) => {
    const config = { params: {id: id, code: code } };
    var url = API_PATH + "/checkCode";
    return axios.get(url, config);
  };
  
export const searchByPage = searchObject => {					
    var url = API_PATH + "/searchByPage";
    return axios.post(url, searchObject);
};
export const getTree = () => {
  return axios.get(API_PATH + "/tree");
};
export const getByRoot = (searchObject) => {
  return axios.get(API_PATH + "/getbyroot" + "/" +  searchObject.pageIndex + "/" + searchObject.pageSize);
};
export const getList = () => {
  return axios.get(API_PATH + "/get/list/getList");
};