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

export const getProductQuery = async ({ queryKey }) => {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/products/${queryKey[1]}`
  );
  return res.json();
};

export const updateProductQuery = async (data) => {
  const token = localStorage.getItem("token");

  return fetch(`${process.env.REACT_APP_API_URL}/products/${data.productId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data.formData,
  });
};

