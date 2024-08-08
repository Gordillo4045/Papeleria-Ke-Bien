import { useState } from 'react';
import { ButtonGroup, Card, CardBody, CardFooter, Image, Input, Spacer, useDisclosure } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useCart } from './CartContext';
import { FaCartPlus } from "react-icons/fa6";
import { toast } from 'sonner';
import { MdShoppingCartCheckout } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

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
          <b className="my-0 py-0 ">{nombre} {marca} {modelo}</b>
          <p className="text-default-500 ">{`$${precio.toFixed(2)}`}</p>
          <Button color="primary" variant='light' isIconOnly onPress={handleAddToCart}>
            <FaCartPlus size={15} />
          </Button>
        </CardFooter>
      </Card>
      <AnimatePresence>
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
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="flex flex-col text-base font-normal gap-2"
                    >
                      <div className="text-xl font-semibold">{nombre}</div>
                      <div className="">
                        <span>Marca: </span>
                        {marca}</div>
                      <div className="">
                        <span>Modelo: </span>
                        {modelo}</div>
                    </motion.div>
                  </ModalHeader>
                  <ModalBody>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
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
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      {`Precio: $${precio.toFixed(2)}`}
                    </motion.p>
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      Existencias: {existencias} piezas
                    </motion.span>
                  </ModalBody>
                  <ModalFooter>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
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
                    </motion.div>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;