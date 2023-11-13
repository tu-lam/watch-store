import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { createProductQuery } from "../../queries/product";
import { useNavigate } from "react-router-dom";
import { myAlert } from "../../utils";

const schema = yup.object().shape({
  image: yup.mixed(),
  name: yup.string().required("Vui lòng nhập mật khẩu"),
  description: yup.string(),
  price: yup.number().required("Vui lòng nhập giá sản phẩm"),
  status: yup.string(),
});

const AddProduct = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState("");

  const convert2base64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) setImage(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const mutation = useMutation({
    mutationFn: createProductQuery,
    onSuccess: async (response, _, __) => {
      const data = await response.json();
      console.log(data);
      myAlert(data.messageCode);
      if (data.messageCode == "add_product_success") {
        navigate("/bang-dieu-khien/san-pham");
      }
      //   if (
      //     data.status === "fail" &&
      //     data.message === "Incorrect username or password"
      //   ) {
      //     alert("Email hoặc mật khẩu không chính xác");
      //   }
    },
  });

  const submitHandler = (data) => {
    const formData = new FormData();
    formData.append("image", data.image[0]);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("status", data.status);

    mutation.mutate(formData);
  };

  if (watch("image") && watch("image")[0]) {
    convert2base64(watch("image")[0]);
  }

  return (
    <div className="flex justify-center max-w-5xl">
      <form className="flex-1 max-w-xl" onSubmit={handleSubmit(submitHandler)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Thêm sản phẩm
            </h2>
            {/* <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p> */}

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Ảnh sản phẩm
                </label>
                {image && <img src={image} />}
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    {!watch("image") || watch("image").length === 0 ? (
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    ) : (
                      <strong>{watch("image")[0].name}</strong>
                    )}
                    {/* <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    /> */}

                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image"
                          // name="image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          {...register("image")}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tên sản phẩm
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      id="name"
                      className="block w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("name")}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Giá
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      id="price"
                      className="block w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("price")}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Mô tả sản phẩm
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    rows={3}
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                    defaultValue={""}
                    {...register("description")}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Trạng thái
                </label>
                <div className="mt-2">
                  <select
                    id="status"
                    // name="category"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("status")}
                  >
                    {/* <option disabled>Vui lòng chọn danh mục</option> */}
                    <option value="active" selected>
                      Đang hoạt động
                    </option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
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
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
