import { Card, Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface CarouselItem {
    id: number;
    title: string;
    subtitle: string;
    image: string;
}

// Update the carousel data with stationery-related content
const carouselData: CarouselItem[] = [
    {
        id: 1,
        title: "Precios Bajos",
        subtitle: "Encuentra precios bajos en papelería",
        image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80"
    },
    {
        id: 2,
        title: "Regreso a Clases",
        subtitle: "Encuentra todo para tu lista escolar",
        image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3"
    },
    {
        id: 3,
        title: "Artículos de Oficina",
        subtitle: "Los mejores precios en papelería",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6"
    }
];

export function Carusel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && !isAnimating) {
                nextSlide();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, isAnimating]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (Math.abs(distance) >= minSwipeDistance) {
            if (distance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    const nextSlide = () => {
        if (isAnimating) return;
        setDirection(1);
        setIsAnimating(true);
        setActiveIndex((prev) => (prev + 1) % carouselData.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setDirection(-1);
        setIsAnimating(true);
        setActiveIndex((prev) => (prev - 1 + carouselData.length) % carouselData.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const getSlideClass = (index: number) => {
        if (index === activeIndex) {
            return "opacity-100 translate-x-0";
        }

        if (direction > 0) {
            return index < activeIndex ? "opacity-0 -translate-x-full" : "opacity-0 translate-x-full";
        } else {
            return index < activeIndex ? "opacity-0 -translate-x-full" : "opacity-0 translate-x-full";
        }
    };



    return (
        <Card className="w-full max-w-6xl mx-auto h-[400px] overflow-hidden rounded-xl my-4 ">
            <div
                className="relative w-full h-full"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {carouselData.map((item, index) => (
                    <div
                        key={item.id}
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out ${getSlideClass(index)}`}
                        style={{
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <AnimatePresence mode="wait">
                            {index === activeIndex && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="absolute bottom-0 left-0 p-6 text-white"
                                >
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="text-3xl font-bold mb-2"
                                    >
                                        {item.title}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="text-lg text-gray-200"
                                    >
                                        {item.subtitle}
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                <Button
                    isIconOnly
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 z-10"
                    onPress={prevSlide}
                    disabled={isAnimating}
                >
                    <BiChevronLeft className="w-5 h-5 text-white" />
                </Button>

                <Button
                    isIconOnly
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 z-10"
                    onPress={nextSlide}
                    disabled={isAnimating}
                >
                    <BiChevronRight className="w-5 h-5 text-white" />
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {carouselData.map((_, index) => (
                        <button
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${index === activeIndex ? "bg-white w-3" : "bg-white/50"
                                }`}
                            onClick={() => setActiveIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </Card>
    );
}