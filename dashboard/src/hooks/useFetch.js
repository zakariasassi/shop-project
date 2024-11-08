
import { useState } from "react";
import makeHttpRequest from "../utils/API";

function useFetch() {


  const [postResult, setPostResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [getResult, setGetResult] = useState(null);
  const [deleteResult, setDeleteResult] = useState(null);
  const [updateResult, setUpdateResult] = useState(null);

  
  const GetHttpRequest = async (endpoint) => makeHttpRequest(endpoint, "get", setIsLoading, setGetResult, setPostResult, setUpdateResult, setDeleteResult, setIsError);
  const PostHttpRequest = async (endpoint, body) => makeHttpRequest(endpoint, "post", setIsLoading, setGetResult, setPostResult, setUpdateResult, setDeleteResult, setIsError, body);
  const UpdateHttpRequest = async (endpoint, body) => makeHttpRequest(endpoint, "put", setIsLoading, setGetResult, setPostResult, setUpdateResult, setDeleteResult, setIsError, body);
  const DeleteHttpRequest = async (endpoint) => makeHttpRequest(endpoint, "delete", setIsLoading, setGetResult, setPostResult, setUpdateResult, setDeleteResult, setIsError);
  return {
    GetHttpRequest,
    PostHttpRequest,
    UpdateHttpRequest,
    DeleteHttpRequest,
    postResult,
    getResult,
    deleteResult,
    updateResult,
    isLoading,
    isError,
  };
}

export default useFetch;

























// import React from "react";
// import axios from "axios";
// import { URL } from "../constants/URL";
// function useFetch() {
//   const [postResult, setPostResult] = React.useState(null);
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [isError, setIsError] = React.useState(false);
//   const [getResult, setGetResult] = React.useState(null);
//   const [deleteResult, setDeleteResult] = React.useState(null);
//   const [updateResult, setUpdateResult] = React.useState(null);

//   const GetHttpRequest = async (endpoint, method) => {
//     setIsLoading(true);
//     const token = window.localStorage.getItem("token");
//     const fetchConfig = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       method: `${method}`,
//       url: URL + endpoint,
//     };
//     await axios(fetchConfig)
//       .then((response) => {
//         setGetResult(response?.data);
//       })
//       .catch((err) => {
//         console.log(err);
//         setIsError(err);
//       })
//       .finally(() => {
//         setIsError(false);
//       });
//   };

//   const PostHttpRequet = async (endpoint, method, body) => {
//     const token = window.localStorage.getItem("token");
//     setIsLoading(true);
//     const fetchConfig = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       method: `${method}`,
//       url: URL + endpoint, //
//       data: body, //must be an object
//     };

//     await axios(fetchConfig)
//       .then((response) => {
//         setPostResult(response.data);
//       })
//       .catch((err) => {
//         console.log(err);
//         setIsError(err);
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const UpdateHttpRequets = async (endpoint, method, body) => {
//     const token = window.localStorage.getItem("token");
//     setIsLoading(true);
//     const fetchConfig = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       method: `${method}`,
//       url: URL + endpoint, //
//       data: body, //must be an object
//     };

//     await axios(fetchConfig)
//       .then((response) => {
//         setDeleteResult(response.data);
//       })
//       .catch((err) => {
//         console.log(err);
//         setIsError(err);
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const DeleteHttpRequest = async (endpoint, method, body) => {
//     const token = window.localStorage.getItem("token");
//     setIsLoading(true);
//     const fetchConfig = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       method: `${method}`,
//       url: URL + endpoint, //
//     };

//     await axios(fetchConfig)
//       .then((response) => {
//         setUpdateResult(response.data);
//       })
//       .catch((err) => {
//         console.log(err);
//         setIsError(err);
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   return {
//     GetHttpRequest,
//     DeleteHttpRequest,
//     PostHttpRequet,
//     UpdateHttpRequets,
//     postResult,
//     getResult,
//     deleteResult,
//     updateResult,
//     isLoading,
//     isError,
//   };
// }

// export default useFetch;