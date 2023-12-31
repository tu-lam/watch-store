import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import ProductManager from "./pages/dashboard/ProductManager";
import Dashboard from "./pages/dashboard/Dashboard";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";
import AddProduct from "./pages/dashboard/AddProduct";
import EditProduct from "./pages/dashboard/EditProduct";
import OrderManager from "./pages/dashboard/orderManager";
import Protected from "./pages/Protected";
import AccountManager from "./pages/dashboard/AccountManager";
import EditAccount from "./pages/dashboard/EditAccount";
import EditOrder from "./pages/dashboard/EditOrder";
import HistoryOrders from "./pages/dashboard/historyOrders";
import InfoAccount from "./pages/dashboard/InfoAccount";
import OrderDetail from "./pages/dashboard/OrderDetail";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/dang-nhap",
    element: <SignIn />,
  },
  {
    path: "/dang-ky",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/san-pham",
    element: <Products />,
  },
  {
    path: "/chi-tiet-san-pham",
    element: <Product />,
  },
  {
    path: "/gio-hang",
    element: (
      <Protected>
        <Cart />
      </Protected>
    ),
  },
  {
    path: "/dang-xuat",
    element: <SignOut />,
  },
  {
    path: "/bang-dieu-khien",
    element: <Dashboard />,
    children: [
      { path: "", element: <Navigate to={"/bang-dieu-khien/san-pham"} /> },
      // { path: "tai-khoan", element: <Account /> },
      { path: "san-pham", element: <ProductManager /> },
      { path: "tai-khoan", element: <AccountManager /> },
      // { path: "danh-muc", element: <CategoryManager /> },
      // { path: "thong-bao", element: <NotificationManager /> },

      { path: "thong-tin-ca-nhan", element: <InfoAccount /> },
      { path: "lich-su-don-hang", element: <HistoryOrders /> },
      { path: "lich-su-don-hang/:id", element: <OrderDetail /> },
      { path: "hoa-don", element: <OrderManager /> },
      { path: "hoa-don/:id", element: <EditOrder /> },
      // { path: "danh-muc/them", element: <AddCategory /> },
      { path: "san-pham/them", element: <AddProduct /> },
      // { path: "thong-bao/them", element: <AddNotification /> },
      // { path: "danh-muc/chinh-sua", element: <EditCategory /> },
      { path: "san-pham/chinh-sua", element: <EditProduct /> },
      { path: "tai-khoan/chinh-sua", element: <EditAccount /> },
      // // { path: "san-pham/chinh-sua", element: <EditProduct /> },
      // { path: "thong-bao/chinh-sua", element: <EditNotification /> },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
