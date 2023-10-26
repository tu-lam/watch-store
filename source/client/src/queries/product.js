export const createProductQuery = async (formData) => {
  const token = localStorage.getItem("token");

  return fetch(`${process.env.REACT_APP_API_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};
