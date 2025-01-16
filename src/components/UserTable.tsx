import React, { useState, useMemo } from "react";
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
    Tooltip,
} from "@heroui/react";
import { IoIosSearch } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { AiOutlineEdit } from "react-icons/ai";
import { BiSolidTrashAlt } from "react-icons/bi";

interface User {
    id: string;
    email: string;
    displayName: string;
}

interface UserTableProps {
    users: User[];
    onAddNew: () => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onRefresh: () => void;
}

const INITIAL_VISIBLE_COLUMNS = ["email", "displayName", "actions"];

export default function UserTable({ users, onAddNew, onEdit, onDelete, onRefresh }: UserTableProps) {
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    visibleColumns;
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "displayName",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => [
        { uid: "email", name: "Correo Electrónico" },
        { uid: "displayName", name: "Nombre" },
        { uid: "actions", name: "Acciones" },
    ], []);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.displayName.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        return filteredUsers;
    }, [users, filterValue]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column as keyof User];
            const second = b[sortDescriptor.column as keyof User];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [filteredItems, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end);
    }, [page, sortedItems]);

    const renderCell = (user: User, columnKey: React.Key) => {
        switch (columnKey) {
            case "email":
            case "displayName":
                return <span>{user[columnKey as keyof User]}</span>;
            case "actions":
                return (
                    <div className="flex justify-start gap-2">
                        <Tooltip content="Editar">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => onEdit(user)}
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
                                onPress={() => onDelete(user)}
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
                        placeholder="Buscar por correo o nombre"
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
                            Agregar Usuario
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, onRefresh, onAddNew]);

    const bottomContent = useMemo(() => {
        return (
            <div className="md:py-2 md:px-2 flex justify-between items-center">
                <Pagination
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    page={page}
                    total={users.length > 0 ? Math.ceil(filteredItems.length / rowsPerPage) : 1}
                    variant="light"
                    onChange={setPage}
                    initialPage={page}
                    isCompact
                />
                <span className="text-[0.7rem] md:text-small text-default-400">
                    {`${items.length} de ${filteredItems.length} usuarios`}
                </span>
            </div>
        );
    }, [items.length, filteredItems.length, page, hasSearchFilter]);

    return (
        <Table
            aria-label="Tabla de usuarios"
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
            <TableBody items={items} emptyContent={"No se encontraron usuarios"}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell className="md:min-w-[110px]">{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
