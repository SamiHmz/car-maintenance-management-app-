import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}missions`;

export function getMissions() {
  return http.get(apiEndPoint);
}

export function getOneMission(id) {
  return http.get(`${apiEndPoint}/${id}`);
}

export function addMission(mission) {
  return http.post(apiEndPoint, mission);
}

export function updateMission(mission, id) {
  return http.put(`${apiEndPoint}/${id}`, mission);
}

export function deleteMission(id) {
  return http.delete(`${apiEndPoint}/${id}`);
}
