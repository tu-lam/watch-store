import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrder,
  getOrderQuery,
  updateOrder,
  updateOrderStatusQuery,
} from "../../queries/order";
import { useForm } from "react-hook-form";
import { myAlert } from "../../utils";
import moment from "moment";
import { cancelOrder } from "../../queries/auth";

const formatOrderStatus = (status) => {
  if (status == "pending") return "Chờ xác nhận";
  else if (status == "confirmed") return "Đã xác nhận";
  else if (status == "canceled") return "Đã hủy";

  return "";
};

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams();

  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: getOrder,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    // mutationFn: updateOrderStatusQuery,
    mutationFn: cancelOrder,
    onSuccess: async (data, _, __) => {
      // const data = await response.json();
      console.log("response", data);
      myAlert(data.messageCode);
    },
  });

  const order = query.data || null;
  // console.log(order);
  // return <></>;

  const submitHandler = (data) => {
    console.log(data);
    // console.log(mutation.status);
    mutation.mutate({ orderId });
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-8 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Đơn hàng #{orderId}
        </h1>
        <p class="mt-4">
          Thời gian:{" "}
          {order?.createdAt
            ? moment(new Date(order.createdAt)).format("HH:mm DD/MM/YYYY")
            : ""}
        </p>
        <p class="">Tên: {order?.name}</p>
        <p>Số điện thoại: {order?.phone}</p>
        <p>Địa chỉ: {order?.address}</p>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        >
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {order?.orderItems.map((item, itemIdx) => (
                <li key={item.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={`${process.env.REACT_APP_IMAGE_URL}/products/${item.product.image}`}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:pr-0">
                      <div className="">
                        {/* <div className="flex flex-1 justify-between"> */}
                        <div className="">
                          <h3 className="text-sm">
                            <a
                              href={item.id}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {item.product.name}
                            </a>
                          </h3>
                        </div>
                        {/* <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">product.color</p>
                            {product.size ? (
                              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                {product.size}
                              </p>
                            ) : null}
                          </div> */}

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {"Số lượng: " + item.quantity}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {"Giá: " +
                            item.product.price.toLocaleString("vi", {
                              style: "currency",
                              currency: "VND",
                            }) +
                            "/1"}
                        </p>
                      </div>

                      {/* <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label
                          htmlFor={`quantity-${itemIdx}`}
                          className="sr-only"
                        >
                          Quantity, {item.product.name}
                        </label>
                        <select
                          id={`quantity-${itemIdx}`}
                          name={`quantity-${itemIdx}`}
                          disabled
                          className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value={1}>{item.quantity}</option>
                    
                        </select>
                      </div> */}
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
              Chi tiết đơn hàng
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Tạm tính</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {order?.total.toLocaleString("vi", {
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
              {/* <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Trạng thái</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order?.status}
                  </dd>
                </div> */}
              {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Shipping estimate</span>
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
                  <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex text-sm text-gray-600">
                    <span>Tax estimate</span>
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
                  <dd className="text-sm font-medium text-gray-900">$8.32</dd>
                </div> */}
              {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Trạng thái
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {order?.status}
                  </dd>
                </div> */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Tổng cộng
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {(order?.total + 25000).toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </dd>
              </div>

              <h2
                id="summary-heading"
                className="border-t-2 pt-4 text-lg font-medium text-gray-900"
              >
                Trạng thái
              </h2>
              <div>
                {/* <label
                  htmlFor="status"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Trạng thái
                </label> */}
                <select
                  id="status"
                  // name="status"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("status")}
                  disabled
                >
                  <option {...{ selected: order?.status == "pending" }}>
                    {formatOrderStatus(order?.status)}
                  </option>
                </select>
              </div>
            </dl>

            {order?.status == "pending" && (
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Hủy đơn
                </button>
              </div>
            )}
          </section>
        </form>
      </div>
    </div>
  );
};

export default OrderDetail;
