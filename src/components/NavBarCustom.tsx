import { Navbar, NavbarContent, Input, NavbarBrand } from "@nextui-org/react";
//@ts-ignore
import { SearchIcon } from "../assets/SearchIcon";

interface NavbarProps {
  onSearchChange: (searchTerm: string) => void;
  SearchTerm: string;
}

const CustomNavbar: React.FC<NavbarProps> = ({ onSearchChange, SearchTerm }) => {

  return (
    <Navbar shouldHideOnScroll >
      <NavbarBrand>
        <p className="font-bold text-xl text-inherit [text-wrap:wrap] md:[text-wrap:nowrap] md:text-3xl ">Papeleria Ke Bien</p>
      </NavbarBrand>
      <NavbarContent as="div" className="items-center w-full" justify="center">
        <Input
          classNames={
            {
              base: "max-w-full  sm:max-w-[10rem] h-10",
              mainWrapper: "h-full flex items-center self-center md:w-96",
              input: "text-small ",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
          placeholder="Busqueda..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          value={SearchTerm}
          onValueChange={(values) => onSearchChange(values)}
        />
      </NavbarContent>
    </Navbar>
  );
};

export default CustomNavbar;