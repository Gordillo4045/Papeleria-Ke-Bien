
import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Pagination } from "@nextui-org/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Filters from "./Filter";
import ProductCard from "./Card";
import Footer from "./Footer";
import SearchInput from "./SearchInput";
import CustomNavbar from "./NavBarCustom";
import { MdFilterAlt } from "react-icons/md";
//@ts-ignore
import { SearchIcon } from "../assets/SearchIcon"

interface Product {
    id: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    imagen: string;
    existencias: string;
}

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [precioRange, setPrecioRange] = useState<[number, number]>([0, 500]);
    const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
    const [selectedProductos, setSelectedProductos] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleResize = () => {
        const screenWidth = window.innerWidth;

        if (screenWidth < 768) {
            setItemsPerPage(10);
        } else if (screenWidth < 1100) {
            setItemsPerPage(12);
        } else {
            setItemsPerPage(20);
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
        .filter((product) => selectedProductos.length === 0 || selectedProductos.includes(product.nombre))
        .filter(
            (product) =>
                searchTerm === "" ||
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.marca.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const totalItems = filteredProducts.length;
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

    const handleResetFilters = () => {
        setSelectedMarcas([]);
        setSelectedProductos([]);
        setPrecioRange([0, 500]);
        setSearchTerm("");
    };

    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleOpenFilter = () => {
        setIsOpenFilters(!isOpenFilters);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setIsOpenFilters(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="container min-h-screen md:mx-auto">
            <CustomNavbar onSearchChange={setSearchTerm} SearchTerm={searchTerm} />
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/4 lg:p-4 lg:mb-0 shadow-sm lg:rounded-tl-xl flex flex-col">
                    <Card className="lg:hidden mx-5 mb-3" radius="sm">
                        <CardBody className="flex flex-row gap-2">
                            <Button onPress={handleOpenFilter} variant="light" color="primary" startContent={<MdFilterAlt />} className="w-[35%]">Filtros</Button>
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                className=""
                            />
                        </CardBody>
                    </Card>

                    <AnimatePresence>
                        {(isOpenFilters || window.innerWidth >= 1024) && (
                            <>
                                {window.innerWidth < 1024 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="fixed inset-0 bg-black z-40"
                                        onClick={() => setIsOpenFilters(false)}
                                    />
                                )}
                                <motion.div
                                    ref={sidebarRef}
                                    initial={{ x: "-100%", opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: "-100%", opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className={`${window.innerWidth < 1024 ? "fixed top-0 left-0 h-full w-[65%] p-2 rounded-r-md bg-white z-50 overflow-y-auto" : ""} lg:block`}
                                >
                                    <Filters
                                        precioRange={precioRange}
                                        onPrecioRangeChange={setPrecioRange}
                                        selectedMarcas={selectedMarcas}
                                        onMarcasChange={setSelectedMarcas}
                                        selectedProductos={selectedProductos}
                                        onProductosChange={setSelectedProductos}
                                        onSearchChange={setSearchTerm}
                                        onResetFilters={handleResetFilters}
                                        onClose={() => setIsOpenFilters(false)}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
                <div className="lg:w-3/4 shadow-inner lg:rounded-tr-xl ">
                    {currentItems.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8">
                            No se encontraron productos con los filtros seleccionados.
                        </div>
                    ) : (
                        <>
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
                                        existencias={item.existencias}
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
                                    color="default"
                                    classNames={{
                                        cursor: "bg-foreground text-background",
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="rounded-b-lg shadow-xl">
                <Footer />
            </div>
        </div>
    );
};

export default Home;
