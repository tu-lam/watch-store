import { useEffect, useState } from "react";
import SidebarLayout from "../../components/layout/SidebarLayout";
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  CubeIcon,
  UserIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../queries/auth";
import { useQuery } from "@tanstack/react-query";

const managerNavigation = [
  {
    name: "Tài khoản",
    href: "/bang-dieu-khien/tai-khoan",
    icon: CubeIcon,
    current: false,
  },
  {
    name: "Sản phẩm",
    href: "/bang-dieu-khien/san-pham",
    icon: CubeIcon,
    current: false,
  },
  {
    name: "Hóa đơn",
    href: "/bang-dieu-khien/hoa-don",
    icon: DocumentTextIcon,
    current: false,
  },
  {
    name: "Đăng xuất",
    href: "/dang-xuat",
    icon: ArrowLeftOnRectangleIcon,
    current: false,
  },
];

const employeeNavigation = [
  {
    name: "Sản phẩm",
    href: "/bang-dieu-khien/san-pham",
    icon: CubeIcon,
    current: false,
  },
  {
    name: "Hóa đơn",
    href: "/bang-dieu-khien/hoa-don",
    icon: DocumentTextIcon,
    current: false,
  },
  {
    name: "Đăng xuất",
    href: "/dang-xuat",
    icon: ArrowLeftOnRectangleIcon,
    current: false,
  },
];

const userNavigation = [
  {
    name: "Thông tin cá nhân",
    href: "/bang-dieu-khien/thong-in",
    icon: CubeIcon,
    current: false,
  },
  {
    name: "Hóa đơn",
    href: "/bang-dieu-khien/lich-su-don-hang",
    icon: DocumentTextIcon,
    current: false,
  },
  {
    name: "Đăng xuất",
    href: "/dang-xuat",
    icon: ArrowLeftOnRectangleIcon,
    current: false,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigation, setNavigation] = useState([]);
  // const [data, setData] = useState();
  const query = useQuery({ queryKey: ["user"], queryFn: getCurrentUser });

  // setData(query.data);
  const data = query.data;
  const token = localStorage.getItem("token");

  if (!token || token == "null" || token == "undefined") {
    navigate("/dang-nhap", { replace: true });
  }
  useEffect(() => {
    console.log("data", data);
    if (data?.messageCode == "get_current_user_success") {
      const user = data.data.user;
      if (user.role == "manager") {
        setNavigation(managerNavigation);
      } else if (user.role == "employee") {
        setNavigation(employeeNavigation);
      } else {
        setNavigation(userNavigation);
      }
    }
  }, [data]);

  if (data == undefined) {
    return <></>;
  }
  // return <></>;

  return (
    <SidebarLayout
      navigation={navigation}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <Outlet />
    </SidebarLayout>
  );
};

export default Dashboard;
