import http from "./httpService";
import { apiUrl } from "../config";

const apiEndPoint = `${apiUrl}login`;

export async function login(email, pass) {
  const { data: jwt } = await http.post(apiEndPoint, { email, pass });
  localStorage.setItem("token", jwt);
}

export function logout() {
  localStorage.removeItem("token");
}
