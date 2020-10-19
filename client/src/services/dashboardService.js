import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}dashboard`;

export function getDashboardData(id) {
  return http.get(apiEndPoint);
}
