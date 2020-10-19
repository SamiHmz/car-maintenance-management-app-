import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}users`;

export function getUsers() {
  return http.get(apiEndPoint);
}
export function getUser(id) {
  return http.get(`${apiEndPoint}/${id}`);
}

export function createUser(user) {
  return http.post(apiEndPoint, user);
}
export function updateUser(user, id) {
  return http.put(`${apiEndPoint}/${id}`, user);
}

export function deleteUser(id) {
  return http.delete(`${apiEndPoint}/${id}`);
}
