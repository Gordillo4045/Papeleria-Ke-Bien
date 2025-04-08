import { Navbar, NavbarContent, NavbarBrand, Button, Badge, Link } from "@heroui/react";
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
      <Navbar >
        <NavbarBrand>
          <Link href="/" color="foreground" >
            <p className="font-bold text-lg text-inherit [text-wrap:wrap] md:[text-wrap:nowrap] md:text-3xl ">Papeleria Ke Bien</p>
          </Link>

        </NavbarBrand>
        <NavbarContent className="items-center w-full hidden lg:flex " justify="center">
          <SearchInput
            value={SearchTerm}
            onChange={onSearchChange}
            className="min-w-96 "
          />
        </NavbarContent>
        <NavbarContent as="div" justify="end" className="gap-2 flex">
          <ThemeToggle />

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