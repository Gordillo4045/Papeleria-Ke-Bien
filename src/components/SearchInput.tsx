import React from "react";
import { Input } from "@nextui-org/react";
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
                inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Buscar..."
            size="sm"
            startContent={<FiSearch />}
            type="search"
            value={value}
            onValueChange={onChange}
        />
    );
};

export default SearchInput;