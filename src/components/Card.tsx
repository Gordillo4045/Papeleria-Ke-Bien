import { useState } from 'react';
import { Card, CardBody, CardFooter, Image, useDisclosure } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

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

  const handleOpen = () => {
    setSelectedProduct({ id, nombre, marca, modelo, precio, imagen, existencias });
    onOpen();
  };

  return (
    <>
      <Card className="w-10/12 mb-4 min-h-[245px]" shadow="sm" key={id} isPressable onPress={handleOpen}>
        <CardBody className="overflow-visible p-0 flex flex-initial">
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

      <Modal placement='top' isOpen={isOpen} onOpenChange={onOpenChange} >
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
                <Button color="primary" isDisabled onPress={onClose}>
                  Comprar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductCard;
