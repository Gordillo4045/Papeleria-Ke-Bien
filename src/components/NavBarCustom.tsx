import { Navbar, NavbarContent, Input, NavbarBrand, Badge, Button } from "@nextui-org/react";
//@ts-ignore
import { SearchIcon } from "../assets/SearchIcon";
import { FaCartShopping } from "react-icons/fa6";
import CartModal from "./CartModal";
import { useState } from "react";
import { useCart } from "./CartContext";

interface NavbarProps {
  onSearchChange: (searchTerm: string) => void;
  SearchTerm: string;
}

const CustomNavbar: React.FC<NavbarProps> = ({ onSearchChange, SearchTerm }) => {
  const { cart } = useCart(); // Obtener el carrito del contexto

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
        <NavbarContent justify="start">
          <NavbarBrand>
            <p className="font-bold text-xl text-inherit [text-wrap:wrap] md:[text-wrap:nowrap] md:text-3xl ">Papeleria Ke Bien</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent as="div" className="items-center w-full" justify="center">
          <Input
            classNames={
              {
                base: "max-w-full h-10",
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
