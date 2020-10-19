import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}casernes`;

export function getCasernes(id) {
  return http.get(`${apiEndPoint}/${id}`);
}
