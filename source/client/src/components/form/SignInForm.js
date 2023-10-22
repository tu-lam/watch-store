import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { signInQuery } from "../../queries/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../../stores/authSlice";
import { myAlert } from "../../utils";
import CustomAlert from "../../utils/CustomAlert";

const schema = yup.object({
  email: yup.string().required("Vui lòng nhập email"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
  // .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

const SignInForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const mutation = useMutation({
    mutationFn: signInQuery,
    // mutationFn: () => {},
    onSuccess: async (response, _, __) => {
      const data = await response.json();
      if (data.messageCode === "signin_success") {
        // alert(JSON.stringify(data));
        // dispatch(signIn(data.token));
        // navigate("/bang-dieu-khien", { replace: true });
        /**
        * Set the alert message, show the alert, and indicate success.
        */
        setAlertMessage(data.messageCode);
        setShowAlert(true);
        setSuccess(true);
        dispatch(signIn({ token: data.token, user: data.data.user }));
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
        return;
      }
      console.log(data);
      setAlertMessage(data.messageCode);
      setShowAlert(true);
      setSuccess(false);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const submitHandler = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      {/* 
        Render the CustomAlert component with the following props:
        - `show`: Determines whether the alert should be displayed or hidden based on the value of `showAlert`.
        - `messageCode`: Passes the alert message or message code to be displayed in the alert.
        - `onClose`: Provides the `handleAlertClose` function as a callback for closing the alert when needed.
        - `success`: Specifies whether the alert should have a success (true) or error (false) appearance.
      */}
      <CustomAlert show={showAlert} messageCode={alertMessage} onClose={handleAlertClose} success={success} />

      <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              autoComplete="email"
              type="email"
              className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...register("email")} />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Mật khẩu
          </label>
          <div className="mt-2">
            <input
              id="password"
              autoComplete="current-password"
              type="password"
              className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...register("password")} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
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
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {mutation.isLoading && (
              <Spinner className="w-5 h-5 text-gray-200 fill-white" />
            )}
            {!mutation.isLoading && "Đăng nhập"}
          </button>
        </div>
      </form>
    </>
  );
};
export default SignInForm;
