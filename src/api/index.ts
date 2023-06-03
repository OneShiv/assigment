import axios from "axios";
import { BASE_URL, KEY2 } from "./constants";

export const fetch = (fn: string, otherQueryParams: string) => {
  return axios.get(`${BASE_URL}${fn}${otherQueryParams}${KEY2}`);
};
