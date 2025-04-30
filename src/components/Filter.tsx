import { Slider, CheckboxGroup, Checkbox, ScrollShadow, Button, Tooltip, Accordion, AccordionItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { db } from "../Config/Config";
import { collection, getDocs } from "firebase/firestore";
import { MdFilterAltOff } from "react-icons/md";
import { GrProjects } from "react-icons/gr";
import TagFilter, { Tag } from './TagFilter';

interface FiltersProps {
  precioRange: [number, number];
  onPrecioRangeChange: (value: [number, number]) => void;
  selectedMarcas: string[];
  onMarcasChange: (values: string[]) => void;
  selectedProductos: string[];
  onProductosChange: (values: string[]) => void;
  selectedCategorias: string[];
  onCategoriasChange: (values: string[]) => void;
  onSearchChange: (searchTerm: string) => void;
  onResetFilters: () => void;
  onClose: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  precioRange,
  onPrecioRangeChange,
  selectedMarcas,
  onMarcasChange,
  selectedProductos,
  onProductosChange,
  selectedCategorias,
  onCategoriasChange,
  onResetFilters,
  onClose
}) => {
  const [marcas, setMarcas] = useState<string[]>([]);
  const [productos, setProductos] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [datosCargados, setDatosCargados] = useState(false);

  const cargarDatosDesdeFirebase = async () => {
    const productosCollection = collection(db, 'productos');
    const productosSnapshot = await getDocs(productosCollection);

    const productosData = productosSnapshot.docs.map((doc) => doc.data());
    const marcasSinDuplicados = [...new Set(productosData.map((producto) => producto.marca))];
    const productosSinDuplicados = [...new Set(productosData.map((producto) => producto.nombre))];
    const categoriasSinDuplicados = [...new Set(productosData
      .map((producto) => producto.categoria)
      .filter(categoria => categoria && categoria.trim() !== '')
    )];

    marcasSinDuplicados.sort();
    productosSinDuplicados.sort();
    categoriasSinDuplicados.sort();

    setMarcas(marcasSinDuplicados);
    setProductos(productosSinDuplicados);
    setCategorias(categoriasSinDuplicados);
    setDatosCargados(true);
  };

  useEffect(() => {
    if (!datosCargados) {
      cargarDatosDesdeFirebase();
    }
  }, [datosCargados]);

  const handleTagsChange = (tags: Tag[]) => {
    const selectedCategories = tags.map(tag => tag.name);
    onCategoriasChange(selectedCategories);
  };

  return (
    <div
      className="  lg:flex flex-wrap  md:justify-normal rounded-md gap-2 md:gap-5 lg:gap-0 lg:flex-col max-w-[310px] lg:max-w-md lg:justify-center">
      <div className="w-full flex justify-between items-center mb-4">
        <span className="font-bold text-lg lg:text-xl text-inherit">
          Filtrar por
        </span>
        <div className="flex gap-2">
          <Tooltip showArrow={true} content="Borrar filtros" offset={2} color="foreground">
            <Button onPress={onResetFilters} isIconOnly size="sm" color="default" variant="light">
              <MdFilterAltOff size={"1.2rem"} />
            </Button>
          </Tooltip>
          <Button onPress={onClose} isIconOnly radius="md" size="sm" color="danger" variant="light" className="lg:hidden">
            <span className="text-lg ">X</span>
          </Button>
        </div>
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
      <div className="flex gap-2 lg:inline lg:ml-3">
        <Accordion selectionMode="multiple" isCompact defaultExpandedKeys={["1", "2", "3"]} className="min-w-[260px] sm:min-w-[200px] md:max-w-[300px]">
          <AccordionItem key={1} aria-label="" title="Categoria" indicator={<GrProjects />}>
            <TagFilter
              onTagsChange={handleTagsChange}
              categories={categorias}
              selectedCategories={selectedCategorias}
            />
          </AccordionItem>
          <AccordionItem key={2} aria-label="Filtrar por producto" title="Producto" indicator={<GrProjects />}>
            <ScrollShadow hideScrollBar className="h-48 xl:h-52">
              <CheckboxGroup value={selectedProductos} onValueChange={(values) => onProductosChange(values as string[])}>
                {productos.map((producto) => (
                  <Checkbox key={producto} value={producto}>
                    {producto}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </ScrollShadow>
          </AccordionItem>

          <AccordionItem key={3} aria-label="Filtrar por marca" title="Marca" indicator={<GrProjects />}>
            <ScrollShadow hideScrollBar className="h-48 xl:h-52">
              <CheckboxGroup value={selectedMarcas} onValueChange={(values) => onMarcasChange(values as string[])}>
                {marcas.map((marca) => (
                  <Checkbox key={marca} value={marca}>
                    {marca}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </ScrollShadow>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Filters;

