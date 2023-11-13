import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateMyPassword } from "../../queries/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { myAlert } from "../../utils";

const schema = yup.object().shape({
  currentPassword: yup.string(),
  password: yup.string(),
  confirmPassword: yup.string(),
});

const UpdateMyPasswordForm = () => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: updateMyPassword,
    onSuccess: async (response, _, __) => {
      console.log("response", response);
      const data = await response.json();
      console.log("data", data);
      myAlert(data.messageCode);
      //   if (data.messageCode === "edit_message_code") {
      //     navigate("/bang-dieu-khien/san-pham");
      //   }

      //   if (
      //     data.status === "fail" &&
      //     data.message === "Incorrect username or password"
      //   ) {
      //     alert("Email hoặc mật khẩu không chính xác");
      //   }
    },
  });

  const submitHandler = (data) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center max-w-5xl">
      <form className="flex-1 max-w-xl" onSubmit={handleSubmit(submitHandler)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Đổi mật khẩu
            </h2>
            {/* <p className="mt-1 text-sm leading-6 text-gray-600">
 This information will be displayed publicly so be careful what you
 share.
</p> */}

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Mật khẩu hiện tại
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="password"
                      id="currentPassword"
                      className="block w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("currentPassword")}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Mật khẩu mới
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="password"
                      id="password"
                      className="block w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("password")}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="password"
                      id="confirmPassword"
                      className="block w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("confirmPassword")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMyPasswordForm;
