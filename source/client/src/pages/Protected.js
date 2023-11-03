import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signIn } from "../stores/authSlice";
import { useEffect } from "react";
import { getCurrentUser } from "../queries/auth";

const Protected = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ["user"], queryFn: getCurrentUser });

  const data = query.data;
  const token = localStorage.getItem("token");

  if (!token || token == "null" || token == "undefined") {
    navigate("/dang-nhap", { replace: true });
  }
  useEffect(() => {
    // console.log("data", data);
    if (data && data.messageCode !== "get_current_user_success") {
      //   dispatch(signIn({ token, user: data.data.user }));
      navigate("/dang-nhap", { replace: true });
    }
  }, [data]);

  return <>{children}</>;
};
export default Protected;
