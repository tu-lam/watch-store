import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../queries/auth";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const formatOrderStatus = (status) => {
  if (status == "pending") return "Chờ xác nhận";
  else if (status == "confirmed") return "Đã xác nhận";
  else if (status == "canceled") return "Đã hủy";

  return "";
};

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getAllOrders();
      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  console.log(orders);

  if (!orders) return <></>;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Danh sách hóa đơn
          </h1>
          {/* <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, title,
              email and role.
            </p> */}
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {/* <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Thêm hóa đơn
          </button> */}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Mã hóa đơn
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Thời gian
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Tổng tiền
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Trạng thái
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Chỉnh sửa</span>
                  </th>
                  {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Xóa</span>
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {order.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {order.createdAt &&
                        moment(new Date(order.createdAt)).format(
                          "HH:mm DD/MM/YYYY"
                        )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {order.total.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatOrderStatus(order.status)}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link
                        to={`/bang-dieu-khien/hoa-don/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        name="editOrder"
                      >
                        Cập nhật<span className="sr-only">, {order._id}</span>
                      </Link>
                    </td>
                    {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link to="#" className="text-red-600 hover:text-red-900">
                        Xóa<span className="sr-only">, {order._id}</span>
                      </Link>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManager;
