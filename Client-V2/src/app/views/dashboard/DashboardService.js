import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/dashboard/";
export const getDashboardAnalytics = () => {
  return axios.get(ConstantList.API_ENPOINT + "/api/dashboard/analytics");
};
export const searchByPage = searchObject => {					
  var url = API_PATH + "searchByPage";
  return axios.post(url, searchObject);
};