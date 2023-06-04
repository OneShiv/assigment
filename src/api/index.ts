import axios from "axios";
import { BASE_URL, KEY2, KEY, KEY3 } from "./constants";

export const fetch = (fn: string, otherQueryParams: string) => {
  return axios
    .get(`${BASE_URL}${fn}${otherQueryParams}${KEY3}`)
    .then((resp) => resp.data)
    .catch((err) => err);
};
