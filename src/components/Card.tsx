import { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, CardFooter, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Image, NumberInput, Spacer, useDisclosure } from "@heroui/react";
import { useCart } from './CartContext';
import { FaCartPlus } from "react-icons/fa6";
import { toast } from 'sonner';
import { MdShoppingCartCheckout } from 'react-icons/md';

interface ProductCardProps {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  precio: number;
  imagen: string;
  existencias: string;
  onOpenCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, nombre, precio, imagen, marca, modelo, existencias, onOpenCart }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const maxStock = parseInt(existencias);
    if (cantidad > maxStock) {
      toast.error(`Solo hay ${maxStock} unidades disponibles`);
      setCantidad(maxStock);
      return;
    }

    addToCart({ id, nombre, marca, modelo, precio, imagen, existencias, cantidad });
    toast.success("Producto agregado al carrito", {
      icon: <MdShoppingCartCheckout />,
      cancel: <Spacer x={6} />,
      action: <Button onPress={onOpenCart} size='sm' radius='md' variant='light' color='primary'>Ver carrito</Button>,
    });
    setCantidad(1);
    onClose();
  };


  const handleQuantityChange = (value: number) => {
    const maxStock = parseInt(existencias);

    if (value > maxStock) {
      setCantidad(maxStock);
    } else {
      setCantidad(value);
    }
  };

  return (
    <>
      <Card className="w-10/12 mb-4 min-h-[245px]" shadow="sm" key={id} isPressable onPress={onOpen} fullWidth={true} >
        <CardBody className="overflow-visible p-0 flex flex-initial bg-white">
          <Image
            isZoomed
            width="100%"
            alt={nombre}
            className="w-full object-contain h-[140px]"
            src={imagen}
          />
        </CardBody>
        <CardFooter className="text-small justify-between flex flex-wrap flex-grow text-start">
          <b className="my-0 py-0 w-full ">{nombre} {marca} {modelo}</b>
          <p className="text-default-500 ">{`$${precio.toFixed(2)}`}</p>
          <Button color="primary" variant='light' isIconOnly onPress={onOpen}>
            <FaCartPlus size={15} />
          </Button>
        </CardFooter>
      </Card>

      {isOpen && (
        <Drawer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior='inside'

        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">
                  <div className="text-xl font-semibold">{nombre}</div>
                  <div className="font-normal text-base">
                    <span>Marca: </span>
                    {marca}</div>
                  <div className="font-normal text-base">
                    <span>Modelo: </span>
                    {modelo}</div>
                </DrawerHeader>
                <DrawerBody>

                  <Image
                    isBlurred
                    isZoomed
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={nombre}
                    src={imagen}
                  />
                  <div className="flex flex-col gap-2">
                    <span>
                      {`Precio: $${precio.toFixed(2)}`}

                    </span>
                    <span>

                      {`Existencias: ${existencias} piezas`}
                    </span>
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <div className="flex items-center justify-center gap-4">
                    <span className='font-light text-sm'>Cantidad</span>
                    <NumberInput
                      variant='underlined'
                      value={cantidad}
                      min={1}
                      size='sm'
                      maxValue={parseInt(existencias)}
                      minValue={1}
                      onValueChange={handleQuantityChange}

                    />
                    <ButtonGroup>
                      <Button color="primary" onPress={handleAddToCart}>
                        Agregar
                      </Button>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cerrar
                      </Button>
                    </ButtonGroup>
                  </div>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ProductCard;