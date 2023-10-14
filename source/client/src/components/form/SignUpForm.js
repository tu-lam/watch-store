import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
// import { signInQuery } from "../../queries/auth";
import { useDispatch, useSelector } from "react-redux";
// import { signIn } from "../../stores/authSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { useMutation } from "@tanstack/react-query";

const schema = yup.object({
  name: yup.string().required("Vui lòng nhập tên"),
  email: yup.string().required("Vui lòng nhập email"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const mutation = useMutation({
    // mutationFn: signInQuery,
    mutationFn: () => {},
    onSuccess: async (response, _, __) => {
      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        // dispatch(signIn({ token: data.token, user: data.data.user }));
        navigate("/bang-dieu-khien", { replace: true });
      }

      if (
        data.status === "fail" &&
        data.message === "Incorrect username or password"
      ) {
        alert("Email hoặc mật khẩu không chính xác");
      }
    },
  });

  const submitHandler = (data) => {
    console.log(mutation.status);
    mutation.mutate(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
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
            {...register("email")}
          />
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
            {...register("password")}
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
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Quên mật khẩu?
          </a>
        </div>
      </div> */}

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {mutation.isLoading && (
            <Spinner className="w-5 h-5 text-gray-200 fill-white" />
          )}
          {!mutation.isLoading && "Đăng ký"}
        </button>
      </div>
    </form>
  );
};
export default SignUpForm;
