import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}listmaintenances`;

export function getMaintenances() {
  return http.get(apiEndPoint);
}
