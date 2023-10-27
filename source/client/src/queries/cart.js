export const addCartProduct = (productData) => {
    const token = localStorage.getItem("token");
    return fetch(`${process.env.REACT_APP_API_URL}/users/cart`, {
        method: "POST",
        headers: {
            Accept: "application.json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
    });
};

export const getAllCartProduct = () => {
    const token = localStorage.getItem("token");
    return fetch(`${process.env.REACT_APP_API_URL}/users/cart`, {
        method: "GET",
        headers: {
            Accept: "application.json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
};
export const DeleteProductInCartById = (productId) => {
    const token = localStorage.getItem("token");
    return fetch(`${process.env.REACT_APP_API_URL}/users/cart/${productId}`, {
        method: "DELETE",
        headers: {
            Accept: "application.json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
};
export const UpdateQuantityProductInCart = (productData) => {
    const token = localStorage.getItem("token");
    return fetch(`${process.env.REACT_APP_API_URL}/users/cart/${productData.id}`, {
        method: "PATCH",
        headers: {
            Accept: "application.json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: productData.quantity }),
    });
};