
import { useEffect, useState } from "react";
import { Pagination} from "@nextui-org/react";
import Filters from "./Filter";
import ProductCard from "./Card";
import { getFirestore, collection, getDocs } from "firebase/firestore";
//@ts-ignore
import {SearchIcon} from "../assets/SearchIcon"
import CustomNavbar from "./NavBarCustom";
import Footer from "./Footer";

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
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [precioRange, setPrecioRange] = useState<[number, number]>([0, 500]);
    const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
    const [selectedModelos, setSelectedModelos] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleResize = () => {
        const screenWidth = window.innerWidth;
    
        if (screenWidth < 768) {
          setItemsPerPage(6); // Móviles
        } else if (screenWidth < 1024) {
          setItemsPerPage(9); // MD
        } else if(screenWidth < 1100){
          setItemsPerPage(8); 
        }else{
            setItemsPerPage(10); // LG y tamaños mayores
        }
      };

    useEffect(() => {
        setCurrentPage(1);
        handleResize()
        window.addEventListener('resize', handleResize);

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
                const validPrecioRange: [number, number] = [
                    Math.min(precioRange[0], 500),
                    Math.min(precioRange[1], 500)
                ];
                setPrecioRange(validPrecioRange);
            } catch (error) {
                console.error("Error al obtener productos de Firebase", error);
            }
        };

        fetchProducts();
        return () => {
            window.removeEventListener('resize', handleResize);
          };
    }, [searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredProducts = products
        .filter((product) => product.precio >= precioRange[0] && product.precio <= precioRange[1])
        .filter((product) => selectedMarcas.length === 0 || selectedMarcas.includes(product.marca))
        .filter((product) => selectedModelos.length === 0 || selectedModelos.includes(product.modelo))
        .filter(
            (product) =>
              searchTerm === "" ||
              product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.modelo.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const totalItems = filteredProducts.length;
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;
    return (
        <div className="container min-h-screen md:mx-auto">
            <CustomNavbar onSearchChange={setSearchTerm}/>
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/4 lg:p-4 lg:mb-0 shadow-sm lg:rounded-tl-xl flex justify-center">
                    <Filters
                        precioRange={precioRange}
                        onPrecioRangeChange={setPrecioRange}
                        selectedMarcas={selectedMarcas}
                        onMarcasChange={setSelectedMarcas}
                        selectedModelos={selectedModelos}
                        onModelosChange={setSelectedModelos}
                        onSearchChange={setSearchTerm}
                    />
                </div>
                <div className="lg:w-3/4 shadow-inner lg:rounded-tr-xl ">
                    <div className="p-4 place-items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {currentItems.map((item) => (
                            <ProductCard
                                key={item.id}
                                id={item.id}
                                nombre={item.nombre}
                                precio={item.precio}
                                imagen={item.imagen}
                                marca={item.marca}
                                modelo={item.modelo}
                            />
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <Pagination
                            total={totalPages}
                            initialPage={currentPage}
                            page={currentPage}
                            variant={"light"}
                            onChange={paginate}
                        />
                    </div>
                </div>
            </div>
            <div className="rounded-b-lg shadow-xl">
                    <Footer/>
                </div>
        </div>
    );
};

export default Home;
