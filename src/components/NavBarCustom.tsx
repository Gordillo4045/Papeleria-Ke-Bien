import { Navbar, NavbarContent, NavbarBrand, Button, Badge } from "@nextui-org/react";
import SearchInput from "./SearchInput";
import { useCart } from "./CartContext";
import { useState } from "react";
import CartModal from "./CartModal";
import { FaCartShopping } from "react-icons/fa6";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  onSearchChange: (searchTerm: string) => void;
  SearchTerm: string;
}

const CustomNavbar: React.FC<NavbarProps> = ({ onSearchChange, SearchTerm }) => {
  const { cart } = useCart();

  const [isCartModalOpen, setcartModalOpen] = useState(false);
  const totalProductos = cart.reduce((total, producto) => total + producto.cantidad, 0);

  const handleCartModalOpen = () => {
    setcartModalOpen(true);
  }

  const handleCartModalClose = () => {
    setcartModalOpen(false);
  }

  return (
    <>
      <Navbar shouldHideOnScroll >
        <NavbarBrand>
          <p className="font-bold text-lg text-inherit [text-wrap:wrap] md:[text-wrap:nowrap] md:text-3xl mr-4 lg:mr-5">Papeleria Ke Bien</p>
          <ThemeToggle />
        </NavbarBrand>
        <NavbarContent as="div" className="items-center w-full hidden lg:flex " justify="center">
          <SearchInput
            value={SearchTerm}
            onChange={onSearchChange}
            className=""
          />
        </NavbarContent>
        <NavbarContent as="div" justify="end">
          <Badge color="danger" content={totalProductos} shape="circle" size="sm" showOutline={false}
          >
            <Button isIconOnly radius="full" variant="light" onPress={handleCartModalOpen}>
              <FaCartShopping size={25} />
            </Button>
          </Badge >
        </NavbarContent>
      </Navbar>

      <CartModal
        isOpen={isCartModalOpen}
        onClose={handleCartModalClose}
      />
    </>
  );
};

export default CustomNavbar;