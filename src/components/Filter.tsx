import { Slider, CheckboxGroup, Checkbox } from "@nextui-org/react";

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
  return (
    <div className="flex flex-wrap justify-center gap-5 lg:gap-0 lg:flex-col max-w-md">
      <Slider
        label="Rango de precio"
        step={1}
        maxValue={500}
        defaultValue={precioRange}
        formatOptions={{ style: "currency", currency: "MXN" }}
        className="max-w-lg px-4"
        radius="md"
        showTooltip={true}
        hideThumb={true}
        onChange={(value) => onPrecioRangeChange(value as [number, number])}
      />
      <br />
      <CheckboxGroup label="Selecciona la marca" onChange={(values) => onMarcasChange(values as string[])}>
        <Checkbox value="Norma">Norma</Checkbox>
        <Checkbox value="Bazic">Bazic</Checkbox>
        <Checkbox value="marca3">Marca 3</Checkbox>
      </CheckboxGroup>
      <br />
      <CheckboxGroup label="Selecciona el modelo" onChange={(values) => onModelosChange(values as string[])}>
        <Checkbox value="Cuadro">Cuadro</Checkbox>
        <Checkbox value="Raya">Raya</Checkbox>
        <Checkbox value="modelo3">Modelo 3</Checkbox>
      </CheckboxGroup>
    </div>
  );
};

export default Filters;