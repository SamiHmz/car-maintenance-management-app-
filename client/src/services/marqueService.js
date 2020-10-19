import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}marques`;

export function getMarques() {
  return http.get(apiEndPoint);
}
