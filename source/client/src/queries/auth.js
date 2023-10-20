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
