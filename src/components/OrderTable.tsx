import React, { useState, useMemo, useEffect } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Tooltip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Checkbox
} from "@heroui/react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { toast } from 'sonner';

interface Order {
    id: string;
    usuario: string;
    productos: {
        id: string;
        nombre: string;
        cantidad: number;
        precio: number;
    }[];
    total: number;
    estado: string;
}

interface OrderTableProps {
    userId: string;
}

const OrderTable: React.FC<OrderTableProps> = ({ userId }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const db = getFirestore();
                const ordersCollection = collection(db, "orders");
                const ordersSnapshot = await getDocs(ordersCollection);
                const ordersData: Order[] = [];
                ordersSnapshot.forEach((doc) => {
                    if (doc.data().usuario === userId) {
                        ordersData.push({ id: doc.id, ...doc.data() } as Order);
                    }
                });
                setOrders(ordersData);
            } catch (error) {
                toast.error("Error al obtener los pedidos");
            }
        };
        fetchOrders();
    }, [userId]);

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };

    const handleUpdateOrder = async () => {
        if (selectedOrder) {
            if (selectedOrder.total < 0 || selectedOrder.productos.some(p => p.cantidad < 1 || p.precio < 0)) {
                toast.error("Por favor, ingrese valores válidos.");
                return;
            }

            try {
                const db = getFirestore();
                const orderUpdateData = { ...selectedOrder }; // Spreading into a new object
                await updateDoc(doc(db, "orders", selectedOrder.id), orderUpdateData);
                setOrders(orders.map((order) => (order.id === selectedOrder.id ? selectedOrder : order)));
                setIsEditModalOpen(false);
                toast.success("Pedido actualizado correctamente");
            } catch (error) {
                toast.error("Error al actualizar el pedido");
            }
        }
    };


    const handleDeleteOrder = async (orderId: string) => {
        try {
            const db = getFirestore();
            await deleteDoc(doc(db, "orders", orderId));
            setOrders(orders.filter((order) => order.id !== orderId));
            toast.success("Pedido eliminado correctamente");
        } catch (error) {
            toast.error("Error al eliminar el pedido");
        }
    };

    const headerColumns = useMemo(() => [
        { uid: "id", name: "ID" },
        { uid: "usuario", name: "Usuario" },
        { uid: "productos", name: "Productos" },
        { uid: "total", name: "Total" },
        { uid: "estado", name: "Estado" },
        { uid: "actions", name: "Acciones" },
    ], []);

    const renderCell = (order: Order, columnKey: React.Key) => {
        switch (columnKey) {
            case "id":
                return <span>{order.id}</span>;
            case "usuario":
                return <span>{order.usuario}</span>;
            case "productos":
                return (
                    <div>
                        {order.productos.map((product) => (
                            <div key={product.id}>{product.nombre} x {product.cantidad}</div>
                        ))}
                    </div>
                );
            case "total":
                return <span>${order.total.toFixed(2)}</span>;
            case "estado":
                return <span>{order.estado}</span>;
            case "actions":
                return (
                    <div className="flex justify-start gap-2">
                        <Tooltip content="Editar">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => handleEditOrder(order)}
                            >
                                <FaEdit size={20} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Eliminar" color='danger'>
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => handleDeleteOrder(order.id)}
                            >
                                <FaTrashAlt size={20} />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <Table
                aria-label="Tabla de pedidos"
                isHeaderSticky
                isCompact
                classNames={{
                    wrapper: "max-h-[582px]",
                }}
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
                <TableBody items={orders} emptyContent={"No se encontraron pedidos"}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell className="md:min-w-[110px]">{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <ModalContent>
                    <ModalHeader id="modal-title">Editar Pedido</ModalHeader>
                    <ModalBody id="modal-description">
                        {selectedOrder && (
                            <>
                                <Input
                                    label="Usuario"
                                    value={selectedOrder.usuario}
                                    onChange={(e) =>
                                        setSelectedOrder({ ...selectedOrder, usuario: e.target.value })
                                    }
                                />
                                <h3>Productos</h3>
                                {selectedOrder.productos.map((product, index) => (
                                    <div key={index}>
                                        <Input
                                            label="Nombre"
                                            value={product.nombre}
                                            onChange={(e) =>
                                                setSelectedOrder({
                                                    ...selectedOrder,
                                                    productos: selectedOrder.productos.map((p, i) =>
                                                        i === index ? { ...p, nombre: e.target.value } : p
                                                    ),
                                                })
                                            }
                                        />
                                        <Input
                                            label="Cantidad"
                                            type="number"
                                            value={product.cantidad.toString()}
                                            onChange={(e) =>
                                                setSelectedOrder({
                                                    ...selectedOrder,
                                                    productos: selectedOrder.productos.map((p, i) =>
                                                        i === index ? { ...p, cantidad: parseInt(e.target.value) } : p
                                                    ),
                                                })
                                            }
                                        />
                                        <Input
                                            label="Precio"
                                            type="number"
                                            value={product.precio.toString()}
                                            onChange={(e) =>
                                                setSelectedOrder({
                                                    ...selectedOrder,
                                                    productos: selectedOrder.productos.map((p, i) =>
                                                        i === index ? { ...p, precio: parseFloat(e.target.value) } : p
                                                    ),
                                                })
                                            }
                                        />
                                    </div>
                                ))}
                                <Input
                                    label="Total"
                                    type="number"
                                    value={selectedOrder.total.toString()}
                                    onChange={(e) =>
                                        setSelectedOrder({ ...selectedOrder, total: parseFloat(e.target.value) })
                                    }
                                />
                                <Checkbox
                                    content='Estado'

                                    checked={selectedOrder.estado === "Completado"}
                                    onChange={(e) =>
                                        setSelectedOrder({
                                            ...selectedOrder,
                                            estado: e.target.checked ? "Completado" : "Pendiente",
                                        })
                                    }
                                />
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='flat' color="danger" onClick={() => setIsEditModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleUpdateOrder}>
                            Guardar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default OrderTable;