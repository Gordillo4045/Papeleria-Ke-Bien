import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

interface ProductCardProps {
  id: string;
  nombre: string;
  marca:string;
  modelo:string;
  precio: number;
  imagen: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, nombre, precio, imagen, marca, modelo }) => {
  return (
    <Card className="w-10/12 mb-4 min-h-[245px]" shadow="sm" key={id}>
      <CardBody className="overflow-visible p-0 flex flex-initial">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={nombre}
          className="w-full object-contain hover:object-cover h-[140px]"
          src={imagen}
        />
      </CardBody>
      <CardFooter className="text-small justify-between flex flex-wrap">
        <b className="my-0 py-0 ">{nombre} {marca} {modelo}</b>
        <p className="text-default-500 ">{`$${precio.toFixed(2)}`}</p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
