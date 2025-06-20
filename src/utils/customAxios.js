import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const customAxios = axios.create({
  withCredentials: true, // Only send cookies like refresh token
});

// Interceptor: Add Access Token before request (optional)
customAxios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// Response Interceptor
customAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token API call
        const res = await axios.post(
          `${apiUrl}/auth/refresh-token`,
          {},
          {
            withCredentials: true, // Send refresh token cookie
          }
        );

        const newAccessToken = res.data?.data?.accessToken;

        if (newAccessToken) {
          // Save new access token in localStorage
          localStorage.setItem("accessToken", newAccessToken);

          // Attach new token to original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return customAxios(originalRequest); // Retry original request
        }
      } catch (err) {
        console.error("🔴 Refresh token expired or invalid");

        // Clear everything and redirect to "/"
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default customAxios;
