import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Carusel } from "./carusel";
import BlurFade from "./ui/BlurFade";
import { Button, Card, CardBody, CardFooter, Image, Link } from "@heroui/react";
import ThemeToggle from "./ThemeToggle";
import { Product, getFeaturedProducts } from "./Catalogo";
import { HeroSection } from "./HeroSection";
import { FaArrowRight } from "react-icons/fa";
import { BiPlus } from "react-icons/bi";

const getFeaturedCategories = (categories: string[]) => {
    return [...new Set(categories)].sort().slice(0, 5);
};

const getCategoryImage = (id: number) => {
    const images = {
        0: 'https://plus.unsplash.com/premium_photo-1676422355165-d809008b8342',
        1: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
        2: 'https://images.unsplash.com/photo-1509191436522-d296cf87d244',
        3: 'https://plus.unsplash.com/premium_photo-1664110691134-df4aa034c322',
        4: 'https://plus.unsplash.com/premium_photo-1723651610443-4f4f27c529a0',
    };
    return images[id as keyof typeof images] || 'https://picsum.photos/seed/1/600/400';
};

const Home: React.FC = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore();
            const productosCollection = collection(db, "productos");

            try {
                const querySnapshot = await getDocs(productosCollection);
                const products = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Product[];

                setCategories(getFeaturedCategories(products.map(product => product.categoria)));
                setFeaturedProducts(getFeaturedProducts(products));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    console.log(categories);

    const handleCategoryClick = (category: string) => {
        navigate(`/catalogo?categoria=${category}`);
    };

    const handleProductClick = (ProductName: string) => {
        navigate(`/catalogo?producto=${ProductName}`);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const categoryContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const categoryItem = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-black">
            <div className="pt-4 sm:pt-7 flex items-center justify-between max-w-6xl mx-auto px-4 sm:px-6">
                <BlurFade delay={0.25} className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={100}
                        height={50}
                        className="sm:w-[100px] sm:h-[50px]"
                        isBlurred
                    />
                </BlurFade>
                <div className="flex gap-1 items-center">
                    <span className="font-thin text-sm sm:text-base">Tema</span>
                    <ThemeToggle />
                </div>
            </div>

            <HeroSection />

            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full px-2 sm:px-4"
            >
                <Carusel />
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-gray-50/30 dark:from-black to-transparent"
                />
            </motion.section>

            <section className="py-8 sm:py-16 md:py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8 sm:mb-16"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">Productos Destacados</h2>
                        <p className="text-foreground-500 max-w-2xl mx-auto text-base sm:text-lg px-4">
                            Descubre nuestra selección de productos premium para elevar tu experiencia de escritura y organización.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full"
                    >
                        {featuredProducts.map((product) => (
                            <motion.div key={product.id} variants={item} className="w-full">
                                <Card
                                    isPressable
                                    className="border border-divider overflow-hidden w-full h-full"
                                    shadow="sm"
                                    onPress={() => handleProductClick(product.nombre)}
                                >
                                    <CardBody className="p-0 overflow-hidden bg-white">
                                        <Image
                                            width="100%"
                                            isZoomed
                                            src={product.imagen}
                                            alt={product.nombre}
                                            className="w-full object-contain h-[150px] sm:h-[200px]"
                                        />
                                    </CardBody>
                                    <CardFooter className="flex flex-col items-start text-left p-3 sm:p-4">
                                        <p className="text-xs text-primary font-medium">{product.categoria}</p>
                                        <h3 className="font-semibold text-base sm:text-lg mt-1">{product.nombre}</h3>
                                        <div className="flex items-center justify-between w-full mt-2">
                                            <p className="font-bold text-base sm:text-lg">${product.precio.toFixed(2)}</p>
                                            <Button
                                                isIconOnly
                                                color="primary"
                                                variant="flat"
                                                size="sm"
                                                className="sm:size-md"
                                                aria-label="Añadir al carrito"
                                                onPress={() => handleProductClick(product.nombre)}
                                            >
                                                <BiPlus />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center mt-8 sm:mt-12"
                    >
                        <Button
                            as={Link}
                            href="catalogo"
                            size="lg"
                            color="primary"
                            variant="bordered"
                            endContent={<FaArrowRight />}
                            className="font-medium w-full sm:w-auto"
                        >
                            Ver todos los productos
                        </Button>
                    </motion.div>
                </div>
            </section>

            <section className="py-8 sm:py-16 bg-default-50 dark:bg-default-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8 sm:mb-16"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
                            Explora por Categorías
                        </h2>
                        <p className="text-foreground-500 max-w-2xl mx-auto text-base sm:text-lg px-4">
                            Encuentra exactamente lo que necesitas navegando por nuestras categorías cuidadosamente seleccionadas.
                        </p>
                    </motion.div>

                    <div className="flex h-full w-full items-center justify-center">
                        <motion.div
                            variants={categoryContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid sm:h-96 w-full gap-3 sm:gap-4 p-2 grid-cols-1 sm:grid-cols-6 sm:grid-rows-3 auto-rows-fr rounded-lg"
                        >
                            {categories.map((category, index) => {
                                const gridClasses = index === 0
                                    ? "sm:col-span-4 sm:row-span-2"
                                    : index === 1
                                        ? "sm:col-span-2 sm:row-span-1"
                                        : index === 2
                                            ? "sm:col-span-2 sm:row-span-2"
                                            : "sm:col-span-2 sm:row-span-1";

                                return (
                                    <motion.div
                                        key={category}
                                        variants={categoryItem}
                                        className={`relative ${gridClasses} h-[150px] sm:h-auto rounded-2xl shadow-md overflow-hidden cursor-pointer`}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => handleCategoryClick(category)}
                                    >
                                        <Image
                                            src={getCategoryImage(index)}
                                            alt={category}
                                            className="w-full h-full object-cover"
                                            removeWrapper
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-200" />
                                        <div className="absolute inset-0 flex h-full w-full flex-col justify-end p-4 z-10">
                                            <div className="backdrop-blur-sm bg-black/20 rounded-xl p-2 sm:p-3 w-full sm:w-auto inline-block">
                                                <h2 className="text-base sm:text-xl font-bold leading-tight text-white drop-shadow-lg">
                                                    {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                                                </h2>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Home;
