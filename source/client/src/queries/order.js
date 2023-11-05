export const getOrder = async ({ queryKey }) => {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/orders/${queryKey[1]}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

export const updateOrder = async (data) => {
  console.log("data.status", data.body.status);
  const token = localStorage.getItem("token");

  return fetch(`${process.env.REACT_APP_API_URL}/orders/${data.orderId}`, {
    method: "PATCH",
    headers: {
      // Accept: "application.json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: data.body.status }),
  });
};
