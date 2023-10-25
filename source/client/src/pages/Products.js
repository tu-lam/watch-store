import { useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import { getAllProduct } from "../queries/auth";
import { Link } from "react-router-dom";



const initialData = await (await getAllProduct()).json();
const products = initialData.map(item => ({
  id: item.id,
  name: item.name,
  price: `$${item.price}`,
  href: `/chi-tiet-san-pham?id=${item.id}`,
  imageSrc: `${process.env.REACT_APP_API_URL}/public/products/${item.image}`,
  imageAlt: `Product ${item.id}`,
}));
// [
//   {
//     id: 1,
//     name: "Đồng hồ A",
//     href: "#",
//     price: "$48",
//     imageSrc: "/images/product.png",
//     imageAlt:
//       "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
//   },
//   {
//     id: 2,
//     name: "Đồng hồ B",
//     href: "#",
//     price: "$35",
//     imageSrc: "/images/product.png",
//     imageAlt:
//       "Olive drab green insulated bottle with flared screw lid and flat top.",
//   },
//   {
//     id: 3,
//     name: "Đồng hồ C",
//     href: "#",
//     price: "$89",
//     imageSrc: "/images/product.png",
//     imageAlt:
//       "Person using a pen to cross a task off a productivity paper card.",
//   },
//   {
//     id: 4,
//     name: "Đồng hồ D",
//     href: "#",
//     price: "$35",
//     imageSrc: "/images/product.png",
//     imageAlt:
//       "Hand holding black machined steel mechanical pencil with brass tip and top.",
//   },
//   // More products...
// ];

export default function Products() {

  return (
    <Layout>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <Link key={product.id} to={product.href} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
