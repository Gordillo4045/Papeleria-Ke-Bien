// import Card from "./Card"
// import NavBar from "./NavBar"
// import { CheckboxGroup, Checkbox, Slider } from "@nextui-org/react";
// export default function Home() {
//     return (
//         <div className="bg-gray-50 h-items">
//             <NavBar />
//             <div className="lg:grid lg:grid-flow-col lg:grid-cols-auto bg-slate-50 h-screen xl:mx-36">
//                 <div className=" rounded-l-md  shadow-md p-5">
//                 <p className="text-center font-bold text-2xl">Filtros</p>
//                 {/* <br />
//                     <>
//                         <Slider
//                             label="Rango de precio"
//                             step={50}
//                             minValue={0}
//                             maxValue={1000}
//                             defaultValue={[100, 500]}
//                             formatOptions={{ style: "currency", currency: "USD" }}
//                             className="max-w-md"
//                         />
//                         <br />
//                         <CheckboxGroup
//                             label="Selecciona la marca"
//                         >
//                             <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
//                             <Checkbox value="sydney">Sydney</Checkbox>
//                             <Checkbox value="san-francisco">San Francisco</Checkbox>
//                             <Checkbox value="london">London</Checkbox>
//                             <Checkbox value="tokyo">Tokyo</Checkbox>
//                         </CheckboxGroup>
//                         <br />
//                         <CheckboxGroup
//                             label="Selecciona el modelo"
//                         >
//                             <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
//                             <Checkbox value="sydney">Sydney</Checkbox>
//                             <Checkbox value="san-francisco">San Francisco</Checkbox>
//                             <Checkbox value="london">London</Checkbox>
//                             <Checkbox value="tokyo">Tokyo</Checkbox>
//                         </CheckboxGroup>
//                     </> */}
//                 </div>
//                 <div className=" pt-5 rounded-r-md shadow-inner"><Card /></div>
//             </div>
//         </div>
//     )
// }
import { useEffect, useState } from "react";
import { Pagination } from "@nextui-org/react";
import Filters from "./Filter";
import ProductCard from "./Card";
import { getFirestore, collection, getDocs } from "firebase/firestore";

interface Product {
    id: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    imagen: string;
}

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const [precioRange, setPrecioRange] = useState<[number, number]>([0, 1000]);
    const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
    const [selectedModelos, setSelectedModelos] = useState<string[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const db = getFirestore();
            const productosCollection = collection(db, "productos");

            try {
                const querySnapshot = await getDocs(productosCollection);

                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Product[];

                setProducts(data);
            } catch (error) {
                console.error("Error al obtener productos de Firebase", error);
            }
        };

        fetchProducts();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredProducts = products
        .filter((product) => product.precio >= precioRange[0] && product.precio <= precioRange[1])
        .filter((product) => selectedMarcas.length === 0 || selectedMarcas.includes(product.marca))
        .filter((product) => selectedModelos.length === 0 || selectedModelos.includes(product.modelo));

    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto mt-8">
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/4 lg:p-4 mb-4 lg:mb-0 shadow-md lg:h-screen">
                    <Filters
                        precioRange={precioRange}
                        onPrecioRangeChange={setPrecioRange}
                        selectedMarcas={selectedMarcas}
                        onMarcasChange={setSelectedMarcas}
                        selectedModelos={selectedModelos}
                        onModelosChange={setSelectedModelos}
                    />
                </div>
                <div className="lg:w-3/4 shadow-inner">
                    <div className="p-4 place-items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {currentItems.map((item) => (
                            <ProductCard
                                key={item.id}
                                id={item.id}
                                nombre={item.nombre}
                                precio={item.precio}
                                imagen={item.imagen}
                            />
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <Pagination
                            total={Math.ceil(filteredProducts.length / itemsPerPage)}
                            initialPage={currentPage}
                            variant={"light"}
                            onChange={paginate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
