import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, ScrollShadow } from "@heroui/react";

export interface Tag {
    name: string;
    className: string;
}

interface TagFilterProps {
    onTagsChange: (tags: Tag[]) => void;
    categories: string[];
    selectedCategories: string[];
}

const getTagColor = (index: number): string => {
    const colors = [
        'bg-lime-100 text-lime-700',
        'bg-green-100 text-green-700',
        'bg-blue-100 text-blue-700',
        'bg-pink-100 text-pink-700',
        'bg-orange-100 text-orange-700',
        'bg-purple-100 text-purple-700',
        'bg-yellow-100 text-yellow-700',
        'bg-gray-300 text-gray-700',
    ];
    return colors[index % colors.length];
};

const TagFilter = ({ onTagsChange, categories, selectedCategories = [] }: TagFilterProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [isHover, setIsHover] = useState(false);
    const [isLayoutAnimation, setIsLayoutAnimation] = useState(false);

    // useEffect(() => {
    //     if (selectedCategories.length === 0) {
    //         setSelectedTags([]);
    //     }
    // }, [selectedCategories]);

    useEffect(() => {
        const initialTags = selectedCategories.map((category) => ({
            name: category,
            className: getTagColor(categories.indexOf(category))
        }));
        setSelectedTags(initialTags);
    }, [selectedCategories, categories]);
    const tags: Tag[] = categories.map((category, index) => ({
        name: category,
        className: getTagColor(index)
    }));

    const selectedTagsNames = selectedTags.map((item) => item.name);

    const reset = (count: number) => {
        if (count === 0) return;

        setTimeout(() => {
            setSelectedTags((arr) => {
                const newTags = arr.slice(0, -1);
                onTagsChange(newTags);
                return newTags;
            });
            reset(count - 1);
        }, 10);
    };

    const handleTagSelect = (tag: Tag) => {
        const newTags = [...selectedTags, tag];
        setSelectedTags(newTags);
        onTagsChange(newTags);
    };

    const handleTagRemove = (tagName: string) => {
        const newTags = selectedTags.filter((item) => item.name !== tagName);
        setSelectedTags(newTags);
        onTagsChange(newTags);
    };

    return (
        <div className="w-full px-2 my-2">
            <div
                className="flex flex-wrap items-center gap-2 z-40 mb-4"
                onMouseEnter={() => !isLayoutAnimation && setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <AnimatePresence initial={false} mode="popLayout">
                    {isHover && selectedTags.length > 0 && (
                        <motion.span
                            key="clear-button"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: "spring", bounce: 0 }}
                            onClick={() => reset(selectedTags.length)}
                            className="cursor-pointer text-sm text-gray-500 font-medium hover:bg-slate-200 rounded-full px-3 py-1"
                        >
                            Borrar todo
                        </motion.span>
                    )}
                </AnimatePresence>
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                        <motion.div
                            key={tag.name}
                            layoutId={tag.name}
                            onLayoutAnimationStart={() => setIsLayoutAnimation(true)}
                            onLayoutAnimationComplete={() => setIsLayoutAnimation(false)}
                            className={`capitalize text-sm font-medium inline-flex items-center gap-2 px-3 py-1 rounded-full ${tag.className}`}
                        >
                            <motion.span layout="position">{tag.name}</motion.span>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="!min-w-0 !w-4 !h-4"
                                onClick={() => handleTagRemove(tag.name)}
                            >
                                ✕
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                layout
                className="w-full rounded-lg "
            >
                <div className="flex items-center justify-between mb-3">
                    <motion.h3 layout="position" className="text-sm font-medium">
                        Seleccionar filtros
                    </motion.h3>
                    {selectedTags.length > 0 && (
                        <motion.span
                            layout="position"
                            onClick={() => reset(selectedTags.length)}
                            className="text-xs text-gray-500 cursor-pointer"
                        >
                            Borrar
                        </motion.span>
                    )}
                </div>
                <ScrollShadow className="flex flex-wrap gap-2 h-[250px] " hideScrollBar >
                    {tags
                        .filter((item) => !selectedTagsNames.includes(item.name))
                        .map((tag) => (
                            <motion.div
                                key={tag.name}
                                layoutId={tag.name}
                                onClick={() => handleTagSelect(tag)}
                                className={`capitalize text-xs font-medium inline-flex px-3 py-1 rounded-full cursor-pointer ${tag.className}`}
                            >
                                <motion.span layout="position">{tag.name}</motion.span>
                            </motion.div>
                        ))}
                </ScrollShadow>
            </motion.div>
        </div>
    );
};

export default TagFilter;