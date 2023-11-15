// import { useEffect, useState } from "react";
// import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
// import { Pagination } from "@nextui-org/react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../Config/Config";

// interface Product {
//   id: string;
//   nombre: string;
//   marca: string;
//   modelo: string;
//   precio: number;
//   imagen: string;
// }

// export default function App() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(6); // Número de productos por página

//   useEffect(() => {
//     const fetchProducts = async () => {
//       // Obtener referencia a la colección "productos" en Firestore
//       const productosCollection = collection(db, "productos");

//       try {
//         const querySnapshot = await getDocs(productosCollection);

//         const data = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Product[];

//         setProducts(data);
//       } catch (error) {
//         console.error("Error al obtener productos de Firebase", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Lógica para la paginación
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

//   const paginate = (pageNumber:number) => setCurrentPage(pageNumber);

//   return (
//     <>
//       <div className="place-items-center grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
//         {currentItems.map((item) => (
//           <Card
//             className="w-10/12 mb-6 min-h-[205px]"
//             shadow="sm"
//             key={item.id}
//           >
//             <CardBody className="overflow-visible p-0">
//               <Image
//                 shadow="sm"
//                 radius="lg"
//                 width="100%"
//                 alt={item.nombre}
//                 className="w-full object-cover h-[140px]"
//                 src={item.imagen} // Asegúrate de tener la propiedad correcta
//               />
//             </CardBody>
//             <CardFooter className="text-small justify-between">
//               <b className="my-0 py-0">{item.nombre} {item.marca}, {item.modelo}</b>
//               <p className="text-default-500">{`$${item.precio.toFixed(2)}`}</p>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//       <div className="flex flex-wrap items-center place-content-center">
//         <Pagination
//           total={Math.ceil(products.length / itemsPerPage)}
//           initialPage={currentPage}
//           variant={"light"}
//           onChange={paginate}
//         />
//       </div>
//     </>
//   );
// }
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

interface ProductCardProps {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, nombre, precio, imagen }) => {
  return (
    <Card className="w-10/12 mb-6 min-h-[205px]" shadow="sm" key={id}>
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={nombre}
          className="w-full object-cover h-[140px]"
          src={imagen}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <b className="my-0 py-0">{nombre}</b>
        <p className="text-default-500">{`$${precio.toFixed(2)}`}</p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
