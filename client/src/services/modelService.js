import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}models`;

export function getmodels(id) {
  return http.get(`${apiEndPoint}/${id}`);
}
