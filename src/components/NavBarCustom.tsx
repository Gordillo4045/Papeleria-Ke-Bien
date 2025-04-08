import { Navbar, NavbarContent, NavbarBrand, Button, Badge, Link, Image } from "@heroui/react";
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
      <Navbar>
        <NavbarBrand className="flex gap-3 items-center">
          <Link href="/" color="foreground" className="flex items-center">
            <div className="flex-shrink-0 w-[100px]">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={50}
                isBlurred
                className="object-contain"
              />
            </div>

            {/* <p className="font-bold text-lg text-inherit [text-wrap:wrap] md:[text-wrap:nowrap] md:text-3xl ">Papeleria Ke Bien</p> */}
          </Link>
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