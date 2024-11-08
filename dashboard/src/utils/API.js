import axios from "axios";
import { URL } from "../constants/URL";

const makeHttpRequest = async (endpoint, method, setIsLoading, setGetResult, setPostResult, setUpdateResult, setDeleteResult, setIsError, body = null , headers = {}) => {

  const token = window.localStorage.getItem("token");

  
  setIsLoading(true);

  const fetchConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    method,
    url: URL + endpoint,
    data: body  // Must be an object for non-GET requests
  };

  try {
    const response = await axios(fetchConfig);

    switch (method.toLowerCase()) {
      case "get":
        setGetResult(response.data);
        break;
      case "post":
        setPostResult(response.data);
        break;
      case "put":
      case "patch":
        setUpdateResult(response.data);
        break;
      case "delete":
        setDeleteResult(response.data);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(err);
    setIsError(err);
  } finally {
    setIsLoading(false);
  }
};

export default makeHttpRequest;