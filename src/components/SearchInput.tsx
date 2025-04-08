import React from "react";
import { Input } from "@heroui/react";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, className = "" }) => {
    return (
        <Input
            classNames={{
                base: `max-w-full sm:max-w-[16rem] h-10 ${className}`,
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-500 bg-transparent border-1 border-default-300 dark:border-default-600 rounded-full shadow-xs focus:ring-0 focus:border-primary-500 dark:focus:border-primary-500",
            }}
            placeholder="Buscar..."
            size="sm"
            startContent={<FiSearch />}
            type="search"
            value={value}
            onValueChange={onChange}
            isClearable
        />
    );
};

export default SearchInput;