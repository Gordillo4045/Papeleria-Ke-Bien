import React, { useState, useMemo } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Pagination,
    SortDescriptor,
    Tooltip
} from "@nextui-org/react";
import { IoIosSearch } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { AiOutlineEdit } from "react-icons/ai";
import { BiSolidTrashAlt } from "react-icons/bi";

interface Producto {
    id: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    imagen: string;
    existencias: string;
}

interface ProductTableProps {
    productos: Producto[];
    onAddNew: () => void;
    onEdit: (producto: Producto) => void;
    onDelete: (producto: Producto) => void;
    onRefresh: () => void;
}

const INITIAL_VISIBLE_COLUMNS = ["nombre", "marca", "modelo", "precio", "existencias", "actions"];

export default function ProductTable({ productos, onAddNew, onEdit, onDelete, onRefresh }: ProductTableProps) {
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    visibleColumns;
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "nombre",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => [
        { uid: "nombre", name: "Nombre" },
        { uid: "marca", name: "Marca" },
        { uid: "modelo", name: "Modelo" },
        { uid: "precio", name: "Precio" },
        { uid: "existencias", name: "Existencias" },
        { uid: "actions", name: "Acciones" },
    ], []);

    const filteredItems = useMemo(() => {
        let filteredProducts = [...productos];

        if (hasSearchFilter) {
            filteredProducts = filteredProducts.filter((product) =>
                product.nombre.toLowerCase().includes(filterValue.toLowerCase()) ||
                product.marca.toLowerCase().includes(filterValue.toLowerCase()) ||
                product.modelo.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        return filteredProducts;
    }, [productos, filterValue]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column as keyof Producto];
            const second = b[sortDescriptor.column as keyof Producto];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [filteredItems, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end);
    }, [page, sortedItems]);

    const renderCell = (product: Producto, columnKey: React.Key) => {
        switch (columnKey) {
            case "nombre":
            case "marca":
            case "modelo":
                return <span>{product[columnKey as keyof Producto]}</span>;
            case "precio":
                return <span>${product.precio.toFixed(2)}</span>;
            case "existencias":
                return <span>{product.existencias}</span>;
            case "actions":
                return (
                    <div className="flex justify-start gap-2">
                        <Tooltip content="Editar">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => onEdit(product)}
                            >
                                <AiOutlineEdit size={20} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Eliminar" color='danger'>
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => onDelete(product)}
                            >
                                <BiSolidTrashAlt size={20} />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return null;
        }
    };

    const onSearchChange = (value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    };

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                        placeholder="Buscar por nombre, marca o modelo"
                        size="sm"
                        startContent={<IoIosSearch className="text-default-300" />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Tooltip content="Actualizar">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                onPress={onRefresh}
                            >
                                <IoReload size={20} />
                            </Button>
                        </Tooltip>
                        <Button
                            size="sm"
                            color="primary"
                            endContent={<FaPlus />}
                            onPress={onAddNew}
                        >
                            Agregar Producto
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, onRefresh, onAddNew]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    isCompact
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={Math.ceil(filteredItems.length / rowsPerPage)}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-[0.7rem] md:text-small text-default-400">
                    {`${items.length} de ${filteredItems.length} productos`}
                </span>
            </div>
        );
    }, [items.length, filteredItems.length, page, hasSearchFilter]);

    return (
        <Table
            aria-label="Tabla de productos"
            isHeaderSticky
            isCompact
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[582px]",
            }}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.uid !== "actions"}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={items} emptyContent={"No se encontraron productos"}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell className="md:min-w-[110px]">{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}