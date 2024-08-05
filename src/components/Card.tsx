import { useState } from 'react';
import { Card, CardBody, CardFooter, Image, Input, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useCart } from './CartContext';
import { FaCartPlus } from "react-icons/fa6";
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  precio: number;
  imagen: string;
  existencias: string;
}


const ProductCard: React.FC<ProductCardProps> = ({ id, nombre, precio, imagen, marca, modelo, existencias }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<ProductCardProps | null>(null);
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);

  const handleOpen = () => {
    setSelectedProduct({ id, nombre, marca, modelo, precio, imagen, existencias });
    onOpen();
  };

  const handleAddToCart = () => {
    addToCart({ id, nombre, marca, modelo, precio, imagen, existencias, cantidad });
    toast.success("Producto agregado al carrito ")
  };

  return (
    <>
      <Card className="w-10/12 mb-4 min-h-[245px]" shadow="sm" key={id} isPressable onPress={handleOpen}>
        <CardBody className="overflow-visible p-0 flex flex-initial bg-white">
          <Image
            isZoomed
            shadow="sm"
            radius="lg"
            width="100%"
            alt={nombre}
            className="w-full object-contain h-[140px]"
            src={imagen}
          />
        </CardBody>
        <CardFooter className="text-small justify-between flex flex-wrap flex-grow text-start">
          <b className="my-0 py-0 ">{nombre} {marca} {modelo}</b>
          <p className="text-default-500 ">{`$${precio.toFixed(2)}`}</p>
        </CardFooter>
      </Card>

      <Modal placement='center' isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside' >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex flex-col text-base font-normal gap-2">
                  <div className="text-xl font-semibold">{selectedProduct?.nombre}</div>
                  <div className="">
                    <span>Marca: </span>
                    {selectedProduct?.marca}</div>
                  <div className="">
                    <span>Modelo: </span>
                    {selectedProduct?.modelo}</div>
                </div>
              </ModalHeader>
              <ModalBody>
                <Image
                  isBlurred
                  isZoomed
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={selectedProduct?.nombre}
                  className="max-h-screen"
                  src={selectedProduct?.imagen}
                />
                <p>{`Precio: $${selectedProduct?.precio.toFixed(2)}`}</p>
                <span>Existencias: {selectedProduct?.existencias} piezas</span>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Popover placement="bottom" showArrow >
                  <PopoverTrigger>
                    <Button color="primary">
                      Comprar
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[120px]">
                    {(titleProps) => (
                      <div className="px-1 py-2 w-full">
                        <p className="text-small font-bold text-foreground" {...titleProps}>
                          Cantidad
                        </p>
                        <div className="mt-2 flex gap-2 w-full">
                          <Input
                            defaultValue="1"
                            type="number"
                            size="sm"
                            variant="underlined"
                            autoFocus
                            onChange={(e) => setCantidad(parseInt(e.target.value))}
                          />
                          <Button color="primary" variant='light' isIconOnly onPress={handleAddToCart}>
                            <FaCartPlus size={20} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductCard;
