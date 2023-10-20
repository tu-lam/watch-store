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
    name: "Thông báo",
    href: "/bang-dieu-khien/thong-bao",
    icon: BellIcon,
    current: false,
  },
  {
    name: "Danh mục",
    href: "/bang-dieu-khien/danh-muc",
    icon: ArchiveBoxIcon,
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

const Dashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const [navigation, setNavigation] = useState < any > [];
  //   const query = useQuery({
  //     queryKey: ["user"],
  //     queryFn: getCurrentUserQuery,
  //     // useErrorBoundary: true,
  //     retry: false,
  //     // staleTime: 10000,
  //   });

  //   const user = query.data?.data.user;
  //   const isError = query.isError;

  //   useEffect(() => {
  //     if (isError) {
  //       localStorage.clear();
  //       navigate("/dang-nhap");
  //     }
  //   }, [isError]);
  //   console.log(query.isError);

  return (
    // <SidebarLayout
    //   user={user}
    //   navigation={user?.role === "admin" ? adminNavigation : navigation}
    //   sidebarOpen={sidebarOpen}
    //   setSidebarOpen={setSidebarOpen}
    // >
    //   <Outlet />
    // </SidebarLayout>
    <SidebarLayout
      // user={user}
      navigation={adminNavigation}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <Outlet />
    </SidebarLayout>
  );
};

export default Dashboard;
