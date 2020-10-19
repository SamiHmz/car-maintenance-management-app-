import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}regions`;

export function getRegions() {
  return http.get(apiEndPoint);
}
