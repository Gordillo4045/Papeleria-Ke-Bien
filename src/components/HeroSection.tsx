import { Button, Image, Link } from "@heroui/react";
import { motion } from "framer-motion";
import { GrCatalog } from "react-icons/gr";

export function HeroSection() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-background to-primary-50/50 dark:from-background dark:to-primary-900/10 py-8 sm:py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-4 sm:gap-6"
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-primary font-semibold tracking-wider text-xs sm:text-sm"
                        >
                            NUEVA COLECCIÓN 2025
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                        >
                            Artículos de papelería <span className="text-primary">premium</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="text-gray-600 text-base sm:text-lg md:text-xl max-w-lg"
                        >
                            Descubre nuestra colección de artículos de papelería de alta calidad, diseñados para inspirar tu creatividad y elevar tu experiencia de escritura.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="flex w-full sm:w-auto"
                        >
                            <Button
                                as={Link}
                                href="catalogo"
                                variant="ghost"
                                color="secondary"
                                startContent={<GrCatalog size={15} />}
                                size="lg"
                                className="w-full sm:w-auto font-medium text-base z-50"
                            >
                                Ver Catalogo
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10">
                            <Image
                                src="https://picsum.photos/id/20/800/800"
                                alt="Colección de papelería premium"
                                className="rounded-3xl shadow-xl"
                                width={600}
                                isBlurred
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 50, y: -30 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                            className="absolute -top-8 -right-8 z-20"
                        >
                            <div className="bg-white p-4 rounded-2xl shadow-lg">
                                <Image
                                    src="https://picsum.photos/id/106/200/200"
                                    alt="Lápices de colores"
                                    className="rounded-xl"
                                    width={120}
                                    height={120}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50, y: 30 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                            className="absolute -bottom-8 -left-8 z-20"
                        >
                            <div className="bg-white p-4 rounded-2xl shadow-lg">
                                <Image
                                    src="https://picsum.photos/id/24/200/200"
                                    alt="Cuadernos"
                                    className="rounded-xl"
                                    width={120}
                                    height={120}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative elements */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1.5, delay: 1.2 }}
                className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl"
            />
        </div>
    );
}