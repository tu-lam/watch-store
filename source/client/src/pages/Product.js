import { useEffect, useState } from "react";
import { Disclosure, RadioGroup, Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Layout from "../components/layout/Layout";
import { getProductDetail } from "../queries/auth";
import CustomAlert from "../utils/CustomAlert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addCartProduct } from "../queries/cart";
import Policy from "../components/ui/Policy";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const navigate = useNavigate();
  const payload = useSelector((state) => state.auth);
  console.log("payload ", payload);
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
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    images: [],
  });
  const id = new URLSearchParams(window.location.search).get("id");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductDetail(id);
        if (response.ok) {
          const data = await response.json();
          let product = {
            ...data.data.product,
          };
          console.log(product);
          product.images = [
            {
              id: 1,
              name: "son",
              src:
                process.env.REACT_APP_API_URL +
                "/public/products/" +
                product.image,
            },
          ];
          product.rating = 4;
          setProduct(product);
          console.log(product);
        } else {
        }
      } catch (error) {}
    };
    fetchData();
  }, [id]);
  const addToCart = () => {
    if (!localStorage.getItem("token")) {
      setTimeout(() => {
        navigate("/dang-nhap");
      }, 1000);
      setAlertMessage("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      setShowAlert(true);
      setSuccess(false);
      return;
    }

    const productData = {
      productId: Number(id),
      quantity: 1,
    };
    addCartProduct(productData);
    setAlertMessage("Đã thêm sản phẩm vào giỏ hàng!");
    setShowAlert(true);
    setSuccess(true);
  };

  return (
    <Layout>
      <div className="bg-white">
        {/* 
                  Render the CustomAlert component with the following props:
                  - `show`: Determines whether the alert should be displayed or hidden based on the value of `showAlert`.
                  - `messageCode`: Passes the alert message or message code to be displayed in the alert.
                  - `onClose`: Provides the `handleAlertClose` function as a callback for closing the alert when needed.
                  - `success`: Specifies whether the alert should have a success (true) or error (false) appearance.
                */}
        <CustomAlert
          show={showAlert}
          messageCode={alertMessage}
          onClose={handleAlertClose}
          success={success}
        />
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              {/* <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {product.images.map((image) => (
                    <Tab
                      key={image.id}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only">{image.name}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <img
                              src={image.src}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-indigo-500" : "ring-transparent",
                              "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div> */}

              <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
                {product.images.map((image) => (
                  <Tab.Panel key={image.id}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  {product.price.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>

              {/* Reviews */}
              {/* <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          product.rating > rating
                            ? "text-indigo-500"
                            : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{product.rating} out of 5 stars</p>
                </div>
              </div> */}

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>

                <div
                  className="space-y-6 text-base text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              <form className="mt-6">
                {/* Colors */}
                {/* <div>
                  <h3 className="text-sm text-gray-600">Color</h3>

                  <RadioGroup
                    value={selectedColor}
                    onChange={setSelectedColor}
                    className="mt-2"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a color
                    </RadioGroup.Label>
                    <span className="flex items-center space-x-3">
                      {product.colors.map((color) => (
                        <RadioGroup.Option
                          key={color.name}
                          value={color}
                          className={({ active, checked }) =>
                            classNames(
                              color.selectedColor,
                              active && checked ? "ring ring-offset-1" : "",
                              !active && checked ? "ring-2" : "",
                              "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                            )
                          }
                        >
                          <RadioGroup.Label as="span" className="sr-only">
                            {color.name}
                          </RadioGroup.Label>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              color.bgColor,
                              "h-8 w-8 rounded-full border border-black border-opacity-10"
                            )}
                          />
                        </RadioGroup.Option>
                      ))}
                    </span>
                  </RadioGroup>
                </div> */}

                <div className="mt-10 flex">
                  <button
                    name="addProductInCart"
                    type="button"
                    className="flex max-w-full flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                    onClick={addToCart}
                  >
                    Thêm vào giỏ hàng
                  </button>

                  {/* <button
                    type="button"
                    className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <HeartIcon
                      className="h-6 w-6 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Add to favorites</span>
                  </button> */}
                </div>
              </form>

              {/* <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <div className="divide-y divide-gray-200 border-t">
                  {product.details.map((detail) => (
                    <Disclosure as="div" key={detail.name}>
                      {({ open }) => (
                        <>
                          <h3>
                            <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                              <span
                                className={classNames(
                                  open ? "text-indigo-600" : "text-gray-900",
                                  "text-sm font-medium"
                                )}
                              >
                                {detail.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel
                            as="div"
                            className="prose prose-sm pb-6"
                          >
                            <ul role="list">
                              {detail.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </section> */}
              <div className="mt-12">
                <Policy />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
