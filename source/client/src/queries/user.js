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
export const getUser = async ({ queryKey }) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/users/${queryKey[1]}`,
    {
      method: "GET",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
};
export const updateUser = async (data) => {
  const token = localStorage.getItem("token");

  return fetch(`${process.env.REACT_APP_API_URL}/users/${data.userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data.formData,
  });
};
