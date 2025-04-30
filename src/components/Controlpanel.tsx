import { useState, useEffect } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Link,
} from "@heroui/react";
import { IoHome, IoExitOutline } from "react-icons/io5";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../Config/Config";
import { toast } from 'sonner';

import LoginForm from './LoginForm';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface Producto {
    id: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    categoria: string;
    descripcion: string;
    imagen: string;
    existencias: string;
}

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Producto | null>(null);
    const [editProducto, setEditProducto] = useState<Producto | null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
                setIsLoginModalOpen(false);
                obtenerProductos();
            } else {
                setIsLoggedIn(false);
                setIsLoginModalOpen(true);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            setIsLoggedIn(false);
            setIsLoginModalOpen(true);
            toast.success("Sesión cerrada exitosamente");
        }).catch((error) => {
            console.log(error.message);
            toast.error("Error al cerrar sesión");
        });
    };

    const obtenerProductos = async () => {
        try {
            const productosCollection = collection(db, "productos");
            const productosSnapshot = await getDocs(productosCollection);

            const productosData: Producto[] = [];
            productosSnapshot.forEach((doc) => {
                const producto = { id: doc.id, ...doc.data() } as Producto;
                productosData.push(producto);
            });

            setProductos(productosData);
        } catch (error) {
            toast.error("Error al obtener la lista de productos");
        }
    };

    const handleEditarProducto = (producto: Producto) => {
        setEditProducto(producto);
        setIsProductFormOpen(true);
    };

    const handleEliminarProducto = (producto: Producto) => {
        setProductToDelete(producto);
        setShowDeleteModal(true);
    };

    const confirmarEliminarProducto = async () => {
        if (productToDelete) {
            try {
                const productosCollection = collection(db, "productos");
                await deleteDoc(doc(productosCollection, productToDelete.id));
                obtenerProductos();
                toast.success("Producto eliminado con éxito");
            } catch (error) {
                toast.error("Error al eliminar el producto");
            }
        }
        setProductToDelete(null);
        setShowDeleteModal(false);
    };

    const handleProductFormClose = () => {
        setIsProductFormOpen(false);
        setEditProducto(null);
        obtenerProductos();
    };
    return (
        <div className="container min-h-screen md:mx-auto">
            <Navbar>
                <NavbarBrand>
                    <div className="flex items-end justify-between">
                        <p className="font-bold text-xl text-inherit [text-wrap:wrap] md:[text-wrap:nowrap] md:text-3xl ">
                            Papeleria Ke Bien
                        </p>
                        <span className="text-default-400 text-sm">ControlPanel</span>
                    </div>
                </NavbarBrand>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button as={Link} color="secondary" href="/" variant="light" startContent={<IoHome />}>
                            <p className="font-semibold">Home</p>
                        </Button>
                    </NavbarItem>
                    {isLoggedIn && (
                        <NavbarItem>
                            <Button
                                color="danger"
                                variant="flat"
                                onPress={handleSignOut}
                                startContent={<IoExitOutline />}
                            >
                                Salir
                            </Button>
                        </NavbarItem>
                    )}
                </NavbarContent>
            </Navbar>
            <div className="flex flex-row p-4 max-w-6xl md:mx-auto shadow-inner rounded-xl mx-4">

                <LoginForm
                    isOpen={isLoginModalOpen}
                    onClose={() => setIsLoginModalOpen(false)}
                />

                <ProductForm
                    isOpen={isProductFormOpen}
                    onClose={handleProductFormClose}
                    editProduct={editProducto}
                    onUpdate={obtenerProductos}
                />

                {isLoggedIn && (
                    <ProductTable
                        productos={productos}
                        onAddNew={() => setIsProductFormOpen(true)}
                        onEdit={handleEditarProducto}
                        onDelete={handleEliminarProducto}
                        onRefresh={obtenerProductos}
                    />
                )}

                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onConfirm={confirmarEliminarProducto}
                    onCancel={() => setShowDeleteModal(false)}
                />
            </div>
        </div>
    );
}