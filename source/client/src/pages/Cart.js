import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Layout from "../components/layout/Layout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DeleteProductInCartById,
  UpdateQuantityProductInCart,
  getAllCartProduct,
} from "../queries/cart";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { myAlert } from "../utils";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../queries/auth";
import CustomAlert from "../utils/CustomAlert";
const schema = yup.object({
  // name: yup.string().required("Vui lòng nhập tên"),
  // phone: yup.string().required("Vui lòng nhập số điện thoại"),
  // address: yup.string().required("Vui lòng nhập địa chỉ"),
  // .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

export default function Cart() {
  /**
   * Configuration for handling alerts in the component.
   * These states control the behavior of the alert:
   * - `showAlert`: Indicates whether the alert should be displayed or hidden.
   * - `success`: Specifies if the alert represents a success (true) or an error (false).
   * - `alertMessage`: The message to be displayed in the alert.
   * - `handleAlertClose()`: A function that sets `showAlert` to `false`, hiding the alert when called.
   */
  const [showAlert, setShowAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const handleAlertClose = () => {
    setShowAlert(false);
  };
  // end
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const payload = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const mutation = useMutation({
    mutationFn: createOrder,
    // mutationFn: () => {},
    onSuccess: async (response, _, __) => {
      const data = await response.json();
      console.log(data);
      if (response.status == 201) {
        setAlertMessage(data.messageCode);
        setShowAlert(true);
        setSuccess(true);
        setTimeout(() => {
          navigate('/bang-dieu-khien/lich-su-don-hang');
        }, 1000);
      } else {
        setAlertMessage(data.messageCode);
        setShowAlert(true);
        setSuccess(false);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const total = products.reduce((accumulator, currentProduct) => {
    return accumulator + currentProduct.price * currentProduct.quantity;
  }, 0);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/dang-nhap");
    } else {
      const fetchData = async () => {
        try {
          const response = await getAllCartProduct(
            localStorage.getItem("token")
          );

          // console.log(response);
          if (response.ok) {
            const inputData = await response.json();
            // console.log(inputData);
            const data = inputData.map((item) => {
              return {
                id: item.id,
                name: item.product.name,
                href: "#",
                price: item.product.price,
                quantity: item.quantity,
                color: "", // Bổ sung thông tin mà bạn có
                inStock: true, // Bổ sung thông tin mà bạn có
                size: "", // Bổ sung thông tin mà bạn có
                imageSrc: `${process.env.REACT_APP_API_URL}/public/products/${item.product.image}`,
                imageAlt: item.product.name, // Chỉnh lại mô tả hình ảnh nếu cần
              };
            });
            setProducts(data);
            // console.log(data);
          } else {
          }
        } catch (error) { }
      };
      fetchData();
    }
  }, [payload, total]);
  const handleDeleteProductInCart = (productId) => {
    console.log(productId);
    DeleteProductInCartById(productId);
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
  };
  const handleEditProduct = (event, productId) => {
    const quantity = event.target.value;
    UpdateQuantityProductInCart({ id: productId, quantity });
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, quantity };
      } else {
        return product;
      }
    });
    setProducts(updatedProducts);
  };

  const submitHandler = (data) => {
    mutation.mutate(data);
  };

  return (
    <Layout>
      {/* 
                  Render the CustomAlert component with the following props:
                  - `show`: Determines whether the alert should be displayed or hidden based on the value of `showAlert`.
                  - `messageCode`: Passes the alert message or message code to be displayed in the alert.
                  - `onClose`: Provides the `handleAlertClose` function as a callback for closing the alert when needed.
                  - `success`: Specifies whether the alert should have a success (true) or error (false) appearance.
                */}
      <CustomAlert
        show={showAlert}
        messageCode={alertMessage}
        onClose={handleAlertClose}
        success={success}
      />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Giỏ hàng
          </h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {products.map((product, productIdx) => (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <a
                                href={product.href}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.name}
                              </a>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">{product.color}</p>
                            {product.size ? (
                              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                {product.size}
                              </p>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {product.price.toLocaleString("vi", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label
                            htmlFor={`quantity-${productIdx}`}
                            className="sr-only"
                          >
                            Quantity, {product.name}
                          </label>
                          <select
                            id={`quantity-${productIdx}`}
                            name={`quantity-${productIdx}`}
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            defaultValue={product.quantity}
                            onChange={(event) =>
                              handleEditProduct(event, product.id)
                            }
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                          </select>

                          <div className="absolute right-0 top-0">
                            <button
                              name="deleteProductInCart"
                              type="button"
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                              onClick={() =>
                                handleDeleteProductInCart(product.id)
                              }
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                      {product.inStock ? (
                        <CheckIcon
                          className="h-5 w-5 flex-shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <ClockIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-300"
                          aria-hidden="true"
                        />
                      )}

                      <span>
                        {product.inStock
                          ? "In stock"
                          : `Ships in ${product.leadTime}`}
                      </span>
                    </p> */}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Tóm tắt
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Tạm tính</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {total.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Phí giao hàng</span>
                    <a
                      href="#"
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">
                        Learn more about how shipping is calculated
                      </span>
                      <QuestionMarkCircleIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {(25000).toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </dd>
                </div>
                {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex text-sm text-gray-600">
                    <span>Thuế</span>
                    <a
                      href="#"
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">
                        Learn more about how tax is calculated
                      </span>
                      <QuestionMarkCircleIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${((total * 10) / 100).toFixed(2)}
                  </dd>
                </div> */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Tổng cộng
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {(total + 25000).toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </dd>
                </div>
              </dl>
              <h2
                id="summary-heading"
                className="mt-6 text-lg font-medium text-gray-900"
              >
                Thông tin đơn hàng
              </h2>

              <form
                className="space-y-6"
                onSubmit={handleSubmit(submitHandler)}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Tên
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      autoComplete="name"
                      type="text"
                      className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("name")}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Số điện thoại
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone"
                      autoComplete="phone"
                      type="text"
                      className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("phone")}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Địa chỉ
                  </label>
                  <div className="mt-2">
                    <input
                      id="address"
                      autoComplete="address"
                      type="text"
                      className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("address")}
                    />
                  </div>
                </div>

                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/dang-ky"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      bạn chưa có tài khoản?
                    </Link>
                  </div>
                </div> */}

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Đặt hàng
                  </button>
                </div>
              </form>
              {/* <div className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Đặt hàng
                </button>
              </div> */}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
