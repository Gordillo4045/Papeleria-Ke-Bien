import { Button, Card, CardBody, Pagination } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { MdFilterAlt } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import SearchInput from "./SearchInput";
import CartModal from "./CartModal";
import ProductCard from "./Card";
import Filters from "./Filter";
import CustomNavbar from "./NavBarCustom";
import Footer from "./Footer";
import { useSearchParams } from "react-router-dom";

interface Product {
    id: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    descripcion: string;
    categoria: string;
    imagen: string;
    existencias: string;
}


export const getFeaturedProducts = (products: Product[]) => {
    return products.slice(0, 4);
};

export { type Product };

export default function Catalogo() {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [precioRange, setPrecioRange] = useState<[number, number]>([0, 500]);
    const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
    const [selectedProductos, setSelectedProductos] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [searchParams] = useSearchParams();



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
        handleResize();
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

    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setIsOpenFilters(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOpenFilter = () => {
        setIsOpenFilters(!isOpenFilters);
    };

    const handleOpenCart = () => {
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    const handleResetFilters = () => {
        setSelectedMarcas([]);
        setSelectedProductos([]);
        setSelectedCategorias([]);
        setPrecioRange([0, 500]);
        setSearchTerm("");
        // Clear URL parameters when resetting filters
        window.history.replaceState({}, '', '/catalogo');
    };

    // Update the useEffect for searchParams to handle filter clearing
    useEffect(() => {
        const categoria = searchParams.get('categoria');
        const producto = searchParams.get('producto');

        // Reset filters first
        handleResetFilters();

        if (categoria) {
            setSelectedCategorias([categoria]);
            if (window.innerWidth < 1024) {
                setIsOpenFilters(true);
            }
        }

        if (producto) {
            setSelectedProductos([producto]);
            if (window.innerWidth < 1024) {
                setIsOpenFilters(true);
            }
        }
    }, [searchParams]);

    // Update the filteredProducts logic
    const filteredProducts = products
        .filter((product) => {
            const priceInRange = product.precio >= precioRange[0] && product.precio <= precioRange[1];
            const matchesMarca = selectedMarcas.length === 0 || selectedMarcas.includes(product.marca);
            const matchesProducto = selectedProductos.length === 0 || selectedProductos.includes(product.nombre);
            const matchesCategoria = selectedCategorias.length === 0 || selectedCategorias.includes(product.categoria);
            const matchesSearch = searchTerm === "" ||
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.marca.toLowerCase().includes(searchTerm.toLowerCase());

            return priceInRange && matchesMarca && matchesProducto && matchesCategoria && matchesSearch;
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const totalItems = filteredProducts.length;
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

    useEffect(() => {
        const categoria = searchParams.get('categoria');
        const producto = searchParams.get('producto');

        if (categoria) {
            setSelectedCategorias([categoria]);
            // Open filters drawer on mobile if coming from URL params
            if (window.innerWidth < 1024) {
                setIsOpenFilters(true);
            }
        }

        if (producto) {
            setSelectedProductos([producto]);
            // Open filters drawer on mobile if coming from URL params
            if (window.innerWidth < 1024) {
                setIsOpenFilters(true);
            }
        }
    }, [searchParams]);
    return (
        <>
            <CustomNavbar onSearchChange={setSearchTerm} SearchTerm={searchTerm} />

            <section className="container mx-auto px-4 pb-10 max-w-6xl mt-3">
                <div className="flex flex-col lg:flex-row gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:w-1/4"
                    >
                        <Card className="lg:hidden mb-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                            <CardBody className="flex flex-row gap-2">
                                <Button
                                    onPress={handleOpenFilter}
                                    variant="light"
                                    color="primary"
                                    startContent={<MdFilterAlt />}
                                    className="w-[35%]"
                                >
                                    Filtros
                                </Button>
                                <SearchInput
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    className="flex-1"
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
                                        className={`${window.innerWidth < 1024 ? "fixed top-0 left-0 h-full w-[65%] p-2 rounded-r-md bg-white z-50 overflow-y-auto dark:bg-black" : ""} lg:block`}
                                    >
                                        <Filters
                                            precioRange={precioRange}
                                            onPrecioRangeChange={setPrecioRange}
                                            selectedMarcas={selectedMarcas}
                                            onMarcasChange={setSelectedMarcas}
                                            selectedProductos={selectedProductos}
                                            onProductosChange={setSelectedProductos}
                                            selectedCategorias={selectedCategorias}
                                            onCategoriasChange={setSelectedCategorias}
                                            onSearchChange={setSearchTerm}
                                            onResetFilters={handleResetFilters}
                                            onClose={() => setIsOpenFilters(false)}
                                        />
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:w-3/4"
                    >
                        {currentItems.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center min-h-[400px] text-gray-500"
                            >
                                No se encontraron productos con los filtros seleccionados.
                            </motion.div>
                        ) : (
                            <>
                                <CartModal isOpen={isCartOpen} onClose={handleCloseCart} />
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {currentItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="h-full"
                                        >
                                            <ProductCard {...item} onOpenCart={handleOpenCart} />
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-8 flex justify-center"
                                >
                                    <Pagination
                                        total={totalPages}
                                        initialPage={currentPage}
                                        page={currentPage}
                                        variant="light"
                                        onChange={paginate}
                                        color="default"
                                        classNames={{
                                            cursor: "bg-foreground text-background",
                                        }}
                                        showControls
                                        loop
                                        showShadow
                                    />
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>
            <Footer />
        </>
    );
}