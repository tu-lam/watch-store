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
  return fetch(`${process.env.REACT_APP_API_URL}/products/${productId || ''}`, {
    method: "GET",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
  });
};
