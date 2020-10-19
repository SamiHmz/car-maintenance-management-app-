import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}categories`;

export function getCategories() {
  return http.get(apiEndPoint);
}
