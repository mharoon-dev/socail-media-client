import axios from "axios";
import { deployedUrl } from "./utils/urls";

const api = axios.create({
  baseURL: deployedUrl,
});
export { api };
// haroon 

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = api.post(`/auth/login`, userCredentials);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });

    return res
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
  }
};
// hjunkjn  jkmaloomm lkmmmkjnnvuy hvh gfbj bygjn 

// console.log("it's haroon! ")
