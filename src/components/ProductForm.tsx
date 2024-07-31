import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Button,
    ButtonGroup
} from "@nextui-org/react";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../Config/Config";
import { toast } from 'sonner';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    editProduct?: Producto | null;
}

interface FormData {
    nombre: string;
    marca: string;
    modelo: string;
    precio: string;
    imagen: File | null;
    existencias: string;
}

interface Producto {
    id: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    imagen: string;
    existencias: string;
}

export default function ProductForm({ isOpen, onClose, editProduct }: ProductFormProps) {
    const [formData, setFormData] = useState<FormData>({
        nombre: "",
        marca: "",
        modelo: "",
        precio: "",
        imagen: null,
        existencias: "",
    });

    useEffect(() => {
        if (editProduct) {
            setFormData({
                nombre: editProduct.nombre,
                marca: editProduct.marca,
                modelo: editProduct.modelo,
                precio: editProduct.precio.toString(),
                imagen: null,
                existencias: editProduct.existencias,
            });
        } else {
            setFormData({
                nombre: "",
                marca: "",
                modelo: "",
                precio: "",
                imagen: null,
                existencias: "",
            });
        }
    }, [editProduct]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, imagen: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nombre || !formData.marca || !formData.modelo || !formData.precio || !formData.existencias) {
            toast.error("Por favor, complete todos los campos obligatorios.");
            return;
        }

        try {
            let imageUrl = editProduct?.imagen || "";

            if (formData.imagen) {
                const storageRef = ref(storage, `imagenes/${formData.imagen.name}`);
                await uploadBytes(storageRef, formData.imagen);
                imageUrl = await getDownloadURL(storageRef);
            }

            const productosCollection = collection(db, "productos");

            if (editProduct) {
                await updateDoc(doc(productosCollection, editProduct.id), {
                    nombre: formData.nombre,
                    marca: formData.marca,
                    modelo: formData.modelo,
                    precio: parseFloat(formData.precio),
                    imagen: imageUrl,
                    existencias: parseInt(formData.existencias),
                });
                toast.success("Producto actualizado correctamente");
            } else {
                await addDoc(productosCollection, {
                    nombre: formData.nombre,
                    marca: formData.marca,
                    modelo: formData.modelo,
                    precio: parseFloat(formData.precio),
                    imagen: imageUrl,
                    existencias: parseInt(formData.existencias),
                });
                toast.success("Producto agregado correctamente");
            }

            onClose();
        } catch (error) {
            console.error("Error al procesar el producto:", error);
            toast.error("Error al procesar el producto. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    <h2 className="text-2xl font-bold">
                        {editProduct ? "Editar Producto" : "Agregar Producto"}
                    </h2>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit} className="w-full items-center space-y-11 p-6">
                        <Input
                            label="Nombre"
                            labelPlacement="outside"
                            placeholder="Nombre del producto"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            isRequired
                        />
                        <Input
                            label="Marca"
                            labelPlacement="outside"
                            placeholder="Marca del producto"
                            name="marca"
                            value={formData.marca}
                            onChange={handleInputChange}
                            isRequired
                        />
                        <Input
                            label="Modelo"
                            labelPlacement="outside"
                            placeholder="Modelo del producto"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleInputChange}
                            isRequired
                        />
                        <Input
                            label="Precio"
                            labelPlacement="outside"
                            placeholder="Precio del producto"
                            name="precio"
                            type="number"
                            value={formData.precio}
                            onChange={handleInputChange}
                            isRequired
                        />
                        <Input
                            label="Existencias"
                            labelPlacement="outside"
                            placeholder="Existencias del producto"
                            name="existencias"
                            type="number"
                            value={formData.existencias}
                            onChange={handleInputChange}
                            isRequired
                        />
                        {!editProduct &&
                            <Input
                                isRequired
                                type="file"
                                label="Imagen"
                                placeholder="Selecciona el archivo"
                                labelPlacement="outside"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block "
                                classNames={{
                                    input: [
                                        "pt-2",
                                    ],
                                }}
                            />
                        }
                        <ModalFooter>
                            <ButtonGroup>
                                <Button color="primary" type='submit'>
                                    {editProduct ? "Guardar Cambios" : "Agregar Producto"}
                                </Button>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}