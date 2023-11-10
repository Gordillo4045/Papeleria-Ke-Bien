import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";
import {Pagination} from "@nextui-org/react";


    export default function App() {
  const list = [
    {
      title: "Cuaderno",
      img: "/images/fruit-1.jpeg",
      price: "$5.50",
    },
    {
      title: "Lapiz",
      img: "/images/fruit-2.jpeg",
      price: "$3.00",
    },
    {
      title: "Calculadora",
      img: "/images/fruit-3.jpeg",
      price: "$10.00",
    },
    {
      title: "Borrador",
      img: "/images/fruit-4.jpeg",
      price: "$5.30",
    },
    {
      title: "Resma de hojas",
      img: "/images/fruit-5.jpeg",
      price: "$15.70",
    },
    {
      title: "Cuaderno",
      img: "/images/fruit-1.jpeg",
      price: "$5.50",
    },
    {
      title: "Lapiz",
      img: "/images/fruit-2.jpeg",
      price: "$3.00",
    },
    {
      title: "Calculadora",
      img: "/images/fruit-3.jpeg",
      price: "$10.00",
    },
    {
      title: "Borrador",
      img: "/images/fruit-4.jpeg",
      price: "$5.30",
    },
    {
      title: "Resma de hojas",
      img: "/images/fruit-5.jpeg",
      price: "$15.70",
    },
    {
      title: "Borrador",
      img: "/images/fruit-4.jpeg",
      price: "$5.30",
    },
    {
      title: "Resma de hojas",
      img: "/images/fruit-5.jpeg",
      price: "$15.70",
    },  
      
      
  ];

  return (
    <>
    <div className=" place-items-center grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {list.map((item, index) => (
        <Card className="w-10/12 mb-6" shadow="sm" key={index}>
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={item.title}
              className="w-full object-cover h-[140px]"
              src={item.img}
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{item.title}</b>
            <p className="text-default-500">{item.price}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
     <div className="flex flex-wrap      items-center place-content-center">
       <Pagination  total={10} initialPage={1} variant={'light'} />
    </div>
    </>
  );
}
