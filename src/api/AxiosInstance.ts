import axios from "axios";
import { useState } from "react";

const instance = axios.create({
  baseURL: `http://localhost:5000/api`,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(`token`);
    config.headers.Authorization = `${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
