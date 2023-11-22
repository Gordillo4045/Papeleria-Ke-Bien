import { Slider, CheckboxGroup, Checkbox, ScrollShadow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { db } from "../Config/Config";
import { collection, getDocs } from "firebase/firestore";

interface FiltersProps {
  precioRange: [number, number];
  onPrecioRangeChange: (value: [number, number]) => void;
  selectedMarcas: string[];
  onMarcasChange: (values: string[]) => void;
  selectedModelos: string[];
  onModelosChange: (values: string[]) => void;
  onSearchChange: (searchTerm: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  precioRange,
  onPrecioRangeChange,
  onMarcasChange,
  onModelosChange,
}) => {
  
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [datosCargados, setDatosCargados] = useState(false);

   // Función para cargar marcas desde Firebase
   const cargarMarcasDesdeFirebase = async () => {
    const marcasCollection = collection(db, 'productos');
    const marcasSnapshot = await getDocs(marcasCollection);
    const marcasData = marcasSnapshot.docs.map(doc => doc.data().marca); // Asegúrate de ajustar esto según la estructura de tus datos
    const marcasSinDuplicados = [...new Set(marcasData)];

  setMarcas(marcasSinDuplicados);
  setDatosCargados(true);
  };

  // Función para cargar modelos desde Firebase
  const cargarModelosDesdeFirebase = async () => {
    const modelosCollection = collection(db, 'productos');
    const modelosSnapshot = await getDocs(modelosCollection);
    const modelosData = modelosSnapshot.docs.map(doc => doc.data().modelo); // Asegúrate de ajustar esto según la estructura de tus datos
    const modelosSinDuplicados = [...new Set(modelosData)];

  setModelos(modelosSinDuplicados);
  setDatosCargados(true);
  };

  useEffect(() => {
    // Cargar marcas y modelos al montar el componente
    if (!datosCargados) {
      cargarMarcasDesdeFirebase();
      cargarModelosDesdeFirebase();
    }
  }, [datosCargados]);

  return (
    <div className="flex flex-wrap justify-center md:justify-normal gap-5 lg:gap-0 lg:flex-col max-w-md">
      <Slider
        label="Rango de precio"
        step={1}
        maxValue={500}
        defaultValue={precioRange}
        formatOptions={{ style: "currency", currency: "MXN" }}
        className="max-w-lg px-4"
        radius="md"
        showTooltip={true}
        onChange={(value) => onPrecioRangeChange(value as [number, number])}
      />
      <br />
      <ScrollShadow  hideScrollBar className="h-48">
        <CheckboxGroup label="Selecciona la marca" onChange={(values) => onMarcasChange(values as string[])}>
        {marcas.map((marca) => (
          <Checkbox key={marca} value={marca}>
            {marca}
          </Checkbox>
        ))}
        </CheckboxGroup>
      </ScrollShadow>
      <br />
      <ScrollShadow  hideScrollBar className="h-48">
      <CheckboxGroup label="Selecciona el modelo" onChange={(values) => onModelosChange(values as string[])}>
      {modelos.map((modelo) => (
            <Checkbox key={modelo} value={modelo}>
              {modelo}
            </Checkbox>
          ))}
      </CheckboxGroup>
      </ScrollShadow>
    </div>
  );
};

export default Filters;