import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}maintenances`;

export function getVehiculesMaintenance() {
  return http.get(apiEndPoint);
}

export function getOneMaintenanceVehicule(id) {
  return http.get(`${apiEndPoint}/${id}`);
}

export function addVehiculesMaintenance(vehiculeMaintenance) {
  return http.post(apiEndPoint, vehiculeMaintenance);
}

export function updateVehiculesMaintenance(vehiculeMaintenance, id) {
  return http.put(`${apiEndPoint}/${id}`, vehiculeMaintenance);
}

export function deleteVehiculesMaintenance(id) {
  return http.delete(`${apiEndPoint}/${id}`);
}
