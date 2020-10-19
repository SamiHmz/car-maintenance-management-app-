import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}carburant`;

export function getCaburant() {
  return http.get(apiEndPoint);
}
export function getOneCaburant(id) {
  return http.get(`${apiEndPoint}/${id}`);
}

export function addCarburant(carburant) {
  return http.post(apiEndPoint, carburant);
}

export function updateCaburant(id, carburant) {
  return http.put(`${apiEndPoint}/${id}`, carburant);
}

export function deleteCaburant(id) {
  return http.delete(`${apiEndPoint}/${id}`);
}
