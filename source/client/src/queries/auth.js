export const signInQuery = (signInData) => {
  return fetch(`${process.env.REACT_APP_API_URL}/users/signin`, {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signInData),
  });
};

export const signUpQuery = (signInData) => {
  return fetch(`${process.env.REACT_APP_API_URL}/users/signup`, {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signInData),
  });
};

export const getAllProduct = () => {
  return fetch(`${process.env.REACT_APP_API_URL}/products`, {
    method: "GET",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
  });
};

export const updateCurrentUser = async (data) => {
  const token = localStorage.getItem("token");

  return fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data.formData,
  });
};

export const createProduct = (productData) => {
  return fetch(`${process.env.REACT_APP_API_URL}/products`, {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
};
export const getProductDetail = (productId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/products/${productId || ""}`, {
    method: "GET",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
  });
};

export const DeleteProductById = (productId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/products/${productId || ""}`, {
    method: "DELETE",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
  });
};

export const getHistoryOrders = () => {
  const token = localStorage.getItem("token");
  return fetch(`${process.env.REACT_APP_API_URL}/users/orders`, {
    method: "GET",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllOrders = () => {
  const token = localStorage.getItem("token");
  return fetch(`${process.env.REACT_APP_API_URL}/orders`, {
    method: "GET",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createOrder = (data) => {
  const token = localStorage.getItem("token");
  return fetch(`${process.env.REACT_APP_API_URL}/users/order`, {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
