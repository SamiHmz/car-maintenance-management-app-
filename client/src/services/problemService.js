import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}problems`;

export function getProblems() {
  return http.get(apiEndPoint);
}
export function getOneProblem(id) {
  return http.get(`${apiEndPoint}/${id}`);
}

export function addProblem(problem) {
  return http.post(apiEndPoint, problem);
}

export function updateProblem(problem, id) {
  return http.put(`${apiEndPoint}/${id}`, problem);
}

export function deleteProblem(id) {
  return http.delete(`${apiEndPoint}/${id}`);
}
