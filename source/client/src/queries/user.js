export const getAllUsers = () => {
  const token = localStorage.getItem("token");
  return fetch(`${process.env.REACT_APP_API_URL}/users`, {
    method: "GET",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
