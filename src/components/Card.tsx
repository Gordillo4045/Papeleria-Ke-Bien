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
  descripcion: string;
  categoria: string;
  onOpenCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, nombre, precio, imagen, marca, modelo, existencias, descripcion, categoria, onOpenCart }) => {
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
      <Card
        className="w-full h-full flex flex-col"
        shadow="sm"
        key={id}
        isPressable
        onPress={onOpen}
      >
        <CardBody className="p-0 flex-none bg-white">
          <Image
            isZoomed
            width="100%"
            alt={nombre}
            className="w-full object-contain h-[140px]"
            src={imagen}
          />
        </CardBody>
        <CardFooter className="flex-1 flex flex-col justify-between gap-2 p-3">
          <div className="w-full">
            <p className="font-medium line-clamp-2">{nombre} {marca} {modelo}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-default-500">${precio.toFixed(2)}</p>
            <Button color="primary" variant='light' isIconOnly onPress={onOpen}>
              <FaCartPlus size={15} />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {isOpen && (
        <Drawer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior='inside'
          classNames={{
            base: "max-w-[90%] sm:max-w-[500px]",
            header: "border-b border-divider",
            body: "py-6",
            footer: "border-t border-divider"
          }}
        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold tracking-tight">{nombre}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-default-500">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Marca:</span>
                      <span>{marca}</span>
                    </div>
                    {modelo && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Modelo:</span>
                        <span>{modelo}</span>
                      </div>
                    )}
                  </div>
                </DrawerHeader>

                <DrawerBody className="flex flex-col gap-6">
                  <div className="relative aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden">
                    <Image
                      isBlurred
                      isZoomed
                      shadow="md"
                      radius="lg"
                      width="100%"
                      height="100%"
                      alt={nombre}
                      src={imagen}
                      className="object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-default-50 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-default-500">Precio</span>
                      <span className="text-xl font-semibold">${precio.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-default-500">Existencias</span>
                      <span className="text-xl font-semibold">{existencias} pz</span>
                    </div>
                  </div>

                  {(descripcion || categoria) && (
                    <div className="flex flex-col gap-4">
                      {descripcion && (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-default-500">Descripción</span>
                          <p className="text-sm">{descripcion || 'No disponible'}</p>
                        </div>
                      )}
                      {categoria && (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-default-500">Categoría</span>
                          <span className="w-fit inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                            {categoria}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </DrawerBody>

                <DrawerFooter>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className="text-sm text-default-500">Cantidad</span>
                      <NumberInput
                        variant="bordered"
                        radius="lg"
                        value={cantidad}
                        min={1}
                        size="sm"
                        maxValue={parseInt(existencias)}
                        minValue={1}
                        onValueChange={handleQuantityChange}
                        classNames={{
                          input: "w-20 text-center"
                        }}
                      />
                    </div>
                    <ButtonGroup className="w-full sm:w-auto">
                      <Button
                        color="primary"
                        onPress={handleAddToCart}
                        className="flex-1 sm:flex-initial"
                      >
                        Agregar al carrito
                      </Button>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={onClose}
                      >
                        Cancelar
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