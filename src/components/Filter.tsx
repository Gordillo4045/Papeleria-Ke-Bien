import { Slider, CheckboxGroup, Checkbox, ScrollShadow, Button, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { db } from "../Config/Config";
import { collection, getDocs } from "firebase/firestore";
import { MdFilterAltOff } from "react-icons/md";

interface FiltersProps {
  precioRange: [number, number];
  onPrecioRangeChange: (value: [number, number]) => void;
  selectedMarcas: string[];
  onMarcasChange: (values: string[]) => void;
  selectedProductos: string[];
  onProductosChange: (values: string[]) => void;
  onSearchChange: (searchTerm: string) => void;
  onResetFilters: () => void
}

const Filters: React.FC<FiltersProps> = ({
  precioRange,
  onPrecioRangeChange,
  selectedMarcas,
  onMarcasChange,
  selectedProductos,
  onProductosChange,
  onResetFilters,

}) => {
  const [marcas, setMarcas] = useState<string[]>([]);
  const [productos, setProductos] = useState<string[]>([]);
  const [datosCargados, setDatosCargados] = useState(false);

  const cargarDatosDesdeFirebase = async () => {
    const productosCollection = collection(db, 'productos');
    const productosSnapshot = await getDocs(productosCollection);

    const productosData = productosSnapshot.docs.map((doc) => doc.data());
    const marcasSinDuplicados = [...new Set(productosData.map((producto) => producto.marca))];
    const productosSinDuplicados = [...new Set(productosData.map((producto) => producto.nombre))];

    setMarcas(marcasSinDuplicados);
    setProductos(productosSinDuplicados);
    setDatosCargados(true);
  };

  useEffect(() => {
    if (!datosCargados) {
      cargarDatosDesdeFirebase();
    }
  }, [datosCargados]);

  return (
    <div className="flex flex-wrap justify-center md:justify-normal gap-2 md:gap-5 lg:gap-0 lg:flex-col max-w-md">
      <div className=" w-full flex justify-between items-center">
        <span className="font-bold text-md lg:text-xl text-inherit pl-4">
          Filtros
        </span>
        <Tooltip showArrow={true} content="Borrar filtros" offset={2}>
          <Button onClick={onResetFilters} isIconOnly size="sm" color="default" variant="light" className="mr-3">
            <MdFilterAltOff size={"1.2rem"} />
          </Button>
        </Tooltip>
      </div>

      <Slider
        label="Rango de precio"
        step={1}
        maxValue={500}
        defaultValue={precioRange}
        formatOptions={{ style: "currency", currency: "MXN" }}
        className="max-w-lg px-4"
        radius="md"
        showTooltip={true}
        color="foreground"
        value={precioRange}
        onChange={(value) => onPrecioRangeChange(value as [number, number])}
      />
      <br />
      <div className="flex gap-2 lg:inline lg:pl-5">
        <ScrollShadow hideScrollBar className="h-48 xl:h-[300px] max-w-[140px] sm:min-w-[210px] md:mr-2">
          <CheckboxGroup label="Producto" value={selectedProductos} onValueChange={(values) => onProductosChange(values as string[])}>
            {productos.map((producto) => (
              <Checkbox key={producto} value={producto}>
                {producto}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </ScrollShadow>

        <ScrollShadow hideScrollBar className="h-48 xl:h-[300px] min-w-[140px] sm:min-w-[200px]">
          <CheckboxGroup label="Marca" value={selectedMarcas} onValueChange={(values) => onMarcasChange(values as string[])}>
            {marcas.map((marca) => (
              <Checkbox key={marca} value={marca}>
                {marca}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default Filters;

