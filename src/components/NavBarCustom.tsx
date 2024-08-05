import { Navbar, NavbarContent, NavbarBrand } from "@nextui-org/react";
import SearchInput from "./SearchInput";

interface NavbarProps {
  onSearchChange: (searchTerm: string) => void;
  SearchTerm: string;
}

const CustomNavbar: React.FC<NavbarProps> = ({ onSearchChange, SearchTerm }) => {
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <p className="font-bold text-xl text-inherit [text-wrap:wrap] md:[text-wrap:nowrap] md:text-3xl">
          Papeleria Ke Bien
        </p>
      </NavbarBrand>
      <NavbarContent as="div" className="items-center w-full hidden lg:flex" justify="center">
        <SearchInput
          value={SearchTerm}
          onChange={onSearchChange}
          className=""
        />
      </NavbarContent>
    </Navbar>
  );
};

export default CustomNavbar;