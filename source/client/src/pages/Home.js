import { Fragment, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Layout from "../components/layout/Layout";
import { Link } from "react-router-dom";
import { getAllProduct } from "../queries/auth";
import { useSelector } from "react-redux";

const navigation = {
  categories: [
    {
      name: "Women",
      featured: [
        { name: "Sleep", href: "#" },
        { name: "Swimwear", href: "#" },
        { name: "Underwear", href: "#" },
      ],
      collection: [
        { name: "Everything", href: "#" },
        { name: "Core", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "Sale", href: "#" },
      ],
      categories: [
        { name: "Basic Tees", href: "#" },
        { name: "Artwork Tees", href: "#" },
        { name: "Bottoms", href: "#" },
        { name: "Underwear", href: "#" },
        { name: "Accessories", href: "#" },
      ],
      brands: [
        { name: "Full Nelson", href: "#" },
        { name: "My Way", href: "#" },
        { name: "Re-Arranged", href: "#" },
        { name: "Counterfeit", href: "#" },
        { name: "Significant Other", href: "#" },
      ],
    },
    {
      name: "Men",
      featured: [
        { name: "Casual", href: "#" },
        { name: "Boxers", href: "#" },
        { name: "Outdoor", href: "#" },
      ],
      collection: [
        { name: "Everything", href: "#" },
        { name: "Core", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "Sale", href: "#" },
      ],
      categories: [
        { name: "Artwork Tees", href: "#" },
        { name: "Pants", href: "#" },
        { name: "Accessories", href: "#" },
        { name: "Boxers", href: "#" },
        { name: "Basic Tees", href: "#" },
      ],
      brands: [
        { name: "Significant Other", href: "#" },
        { name: "My Way", href: "#" },
        { name: "Counterfeit", href: "#" },
        { name: "Re-Arranged", href: "#" },
        { name: "Full Nelson", href: "#" },
      ],
    },
  ],
  pages: [
    { name: "Company", href: "#" },
    { name: "Stores", href: "#" },
  ],
};
console.log();

const initialData = await (await getAllProduct()).json();
console.log(initialData);
const trendingProducts = initialData.map(item => ({
  id: item.id,
  name: `Đồng hồ ${item.id}`,
  price: `$${item.price}`,
  href: `/chi-tiet-san-pham?id=${item.id}`,
  imageSrc: `${process.env.REACT_APP_API_URL}/public/products/${item.image}`,
  imageAlt: `Product ${item.id}`,
}));

//  [
//   {
//     id: 1,
//     name: "Đồng hồ 1",
//     // color: "Black",
//     price: "$35",
//     href: "/chi-tiet-san-pham?id=1",
//     imageSrc: "/images/product.png",
//     imageAlt:
//       "Black machined steel pen with hexagonal grip and small white logo at top.",
//     // availableColors: [
//     //   { name: "Black", colorBg: "#111827" },
//     //   { name: "Brass", colorBg: "#FDE68A" },
//     //   { name: "Chrome", colorBg: "#E5E7EB" },
//     // ],
//   },
//   {
//     id: 2,
//     name: "Đồng hồ 2",
//     // color: "Black",
//     price: "$35",
//     href: "/chi-tiet-san-pham?id=2",
//     imageSrc: "/images/product.png",
//     imageAlt:
//       "Black machined steel pen with hexagonal grip and small white logo at top.",
//     // availableColors: [
//     //   { name: "Black", colorBg: "#111827" },
//     //   { name: "Brass", colorBg: "#FDE68A" },
//     //   { name: "Chrome", colorBg: "#E5E7EB" },
//     // ],
//   },
//   {
//     id: 3,
//     name: "Đồng hồ 3",
//     // color: "Black",
//     price: "$35",
//     href: "/chi-tiet-san-pham?id=3",
//     imageSrc: "/images/product.png",
//     imageAlt:
//       "Black machined steel pen with hexagonal grip and small white logo at top.",
//     // availableColors: [
//     //   { name: "Black", colorBg: "#111827" },
//     //   { name: "Brass", colorBg: "#FDE68A" },
//     //   { name: "Chrome", colorBg: "#E5E7EB" },
//     // ],
//   },
//   {
//     id: 4,
//     name: "Đồng hồ 4",
//     // color: "Black",
//     price: "$35",
//     href: "/chi-tiet-san-pham?id=4",
//     imageSrc: "/images/product.png",
//     imageAlt:
//       "Black machined steel pen with hexagonal grip and small white logo at top.",
//     // availableColors: [
//     //   { name: "Black", colorBg: "#111827" },
//     //   { name: "Brass", colorBg: "#FDE68A" },
//     //   { name: "Chrome", colorBg: "#E5E7EB" },
//     // ],
//   },
//   // More products...
// ];
// const trendingProducts = (await getAllProduct());
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const payload = useSelector((state) => state.auth);
  console.log(payload);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <div className="flex flex-col border-b border-gray-200 lg:border-0">
        {/* <nav aria-label="Offers" className="order-last lg:order-first">
          <div className="mx-auto max-w-7xl lg:px-8">
            <ul
              role="list"
              className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0"
            >
              {offers.map((offer) => (
                <li key={offer.name} className="flex flex-col">
                  <a
                    href={offer.href}
                    className="relative flex flex-1 flex-col justify-center bg-white px-4 py-6 text-center focus:z-10"
                  >
                    <p className="text-sm text-gray-500">{offer.name}</p>
                    <p className="font-semibold text-gray-900">
                      {offer.description}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav> */}

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute hidden h-full w-1/2 bg-gray-100 lg:block"
          />
          <div className="relative bg-gray-100 lg:bg-transparent">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
              <div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-64">
                <div className="lg:pr-16">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
                    Focus on what matters
                  </h1>
                  <p className="mt-4 text-xl text-gray-600">
                    All the charts, datepickers, and notifications in the world
                    can't beat checking off some items on a paper card.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/san-pham"
                      className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700"
                    >
                      Mua ngay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-48 w-full sm:h-64 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2">
            <img
              src="/images/hero.webp"
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Trending products */}
      <section aria-labelledby="trending-heading" className="bg-white">
        <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-32">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
            <h2
              id="trending-heading"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              Sản phẩm mới
            </h2>
            <Link
              to="/san-pham"
              className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
            >
              Tất cả
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>

          <div className="relative mt-8">
            <div className="relative w-full overflow-x-auto">
              <ul
                role="list"
                className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0"
              >
                {trendingProducts.map((product) => (
                  <li
                    key={product.id}
                    className="inline-flex w-64 flex-col text-center lg:w-auto"
                  >
                    <div className="group relative">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="mt-6">
                        {/* <p className="text-sm text-gray-500">{product.color}</p> */}
                        <h3 className="mt-1 font-semibold text-gray-900">
                          <a href={product.href}>
                            <span className="absolute inset-0" />
                            {product.name}
                          </a>
                        </h3>
                        <p className="mt-1 text-gray-900">{product.price}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 px-4 sm:hidden">
            <a
              href="#"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              See everything
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
