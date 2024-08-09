import { useState } from 'react';
import { ButtonGroup, Card, CardBody, CardFooter, Image, Input, Spacer, useDisclosure } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
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
    addToCart({ id, nombre, marca, modelo, precio, imagen, existencias, cantidad });
    toast.success("Producto agregado al carrito", {
      icon: <MdShoppingCartCheckout />,
      cancel: <Spacer x={6} />,
      action: <Button onPress={onOpenCart} size='sm' radius='md' variant='light' color='primary'>Ver carrito</Button>,
    });
    onClose();
  };

  return (
    <>

      <Card className="w-10/12 mb-4 min-h-[245px]" shadow="sm" key={id} isPressable onPress={onOpen} fullWidth={true} >
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
          <b className="my-0 py-0 w-full ">{nombre} {marca} {modelo}</b>
          <p className="text-default-500 ">{`$${precio.toFixed(2)}`}</p>
          <Button color="primary" variant='light' isIconOnly onPress={handleAddToCart}>
            <FaCartPlus size={15} />
          </Button>
        </CardFooter>
      </Card>
      {isOpen && (
        <Modal
          placement='center'
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior='inside'
          motionProps={{
            variants: {
              enter: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 20 }
            },
            transition: { duration: 0.3 }
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="text-xl font-semibold">{nombre}</div>
                  <div className="font-normal text-base">
                    <span>Marca: </span>
                    {marca}</div>
                  <div className="font-normal text-base">
                    <span>Modelo: </span>
                    {modelo}</div>
                </ModalHeader>
                <ModalBody>

                  <Image
                    isBlurred
                    isZoomed
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={nombre}
                    className="max-h-screen"
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
                </ModalBody>
                <ModalFooter>
                  <div
                    className="flex items-center justify-center gap-4"
                  >
                    <span className='font-light text-sm'>Cantidad</span>
                    <Input
                      type="number"
                      variant='underlined'
                      defaultValue="1"
                      min="1"
                      max={existencias}
                      onChange={(e) => setCantidad(parseInt(e.target.value))}
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
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ProductCard;