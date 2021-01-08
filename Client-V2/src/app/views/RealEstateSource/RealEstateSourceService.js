import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/source";

export const getAllSource = (pageIndex, pageSize) => {
    return axios.get(API_PATH+`/${pageIndex}/${pageSize}`);
  };

export const addNewSource = User => {
      return axios.post(API_PATH , User);
    };

export const deleteSource= id => {
  return axios.delete(API_PATH +"/"+id);
};

export const updateSource = asset => {
  return axios.post(API_PATH , asset);
};

export const getSourceById = id => {
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
