// src/api/axios.js
// 💡 What is this file?
// This is our Axios "instance" — a pre-configured version of Axios.
// Instead of writing the full URL and token header in every component,
// we set it up ONCE here. Every page that imports this will automatically
// get the base URL and the JWT token attached to requests.
//
// Analogy: Like a pre-addressed envelope. You just put the letter in —
// you don't have to write the return address every time.

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://automation-production-cc6c.up.railway.app/api',
});

// 💡 What is an interceptor?
// It's a function that INTERCEPTS every request before it's sent.
// Here, we use it to automatically attach the Bearer token from localStorage.
// This means you never have to write `Authorization: Bearer ...` in any component!
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
