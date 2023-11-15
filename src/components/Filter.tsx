import { Slider, CheckboxGroup, Checkbox } from "@nextui-org/react";

interface FiltersProps {
  precioRange: [number, number];
  onPrecioRangeChange: (value: [number, number]) => void;
  selectedMarcas: string[];
  onMarcasChange: (values: string[]) => void;
  selectedModelos: string[];
  onModelosChange: (values: string[]) => void;
}

const Filters: React.FC<FiltersProps> = ({
    precioRange,
    onPrecioRangeChange,
    onMarcasChange,
    onModelosChange,
  }) => {
  return (
    <div>
      <Slider
        label="Rango de precio"
        step={1}
        minValue={0}
        maxValue={500}
        defaultValue={precioRange}
        formatOptions={{ style: "currency", currency: "MXN" }}
        className="max-w-md"
        onChange={(value) => onPrecioRangeChange(value as [number, number])}
      />
      <br />
      <CheckboxGroup label="Selecciona la marca" onChange={(values) => onMarcasChange(values as string[])}>
        <Checkbox value="Norma">Norma</Checkbox>
        <Checkbox value="Bazic">Bazic</Checkbox>
        <Checkbox value="marca3">Marca 3</Checkbox>
        {/* Agrega más Checkbox según tus marcas */}
      </CheckboxGroup>
      <br />
      <CheckboxGroup label="Selecciona el modelo" onChange={(values) => onModelosChange(values as string[])}>
        <Checkbox value="modelo1">Modelo 1</Checkbox>
        <Checkbox value="modelo2">Modelo 2</Checkbox>
        <Checkbox value="modelo3">Modelo 3</Checkbox>
        {/* Agrega más Checkbox según tus modelos */}
      </CheckboxGroup>
    </div>
  );
};

export default Filters;