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

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

const adminNavigation = [
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!localStorage.getItem("token")) {
    navigate("/dang-nhap");
  }

  return (
    <SidebarLayout
      navigation={adminNavigation}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <Outlet />
    </SidebarLayout>
  );
};

export default Dashboard;
