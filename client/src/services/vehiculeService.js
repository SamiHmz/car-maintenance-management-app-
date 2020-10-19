import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}vehicules`;

export function getVehicules() {
  return http.get(apiEndPoint);
}

export function getOneVehicule(id) {
  return http.get(`${apiUrl}vehicules/${id}`);
}

export function addVehicule(vehicule) {
  return http.post(apiEndPoint, vehicule);
}

export function updateVehicule(vehicule) {
  return http.put(`${apiEndPoint}/${vehicule.matricule}`, vehicule);
}

export function deleteVehicule(id) {
  return http.delete(`${apiUrl}vehicules/${id}`);
}

export function getfiche(id) {
  return http.get(`${apiUrl}vehicules/fiche/${id}`);
}
