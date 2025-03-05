import React, { useState, useEffect } from 'react';
import {
    Input,
    Button,
    ButtonGroup,
    Image,
    Tooltip,
    Textarea,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody
} from "@heroui/react";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../Config/Config";
import { toast } from 'sonner';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    editProduct?: Producto | null;
    onUpdate: () => void;
}

interface FormData {
    nombre: string;
    marca: string;
    modelo: string;
    precio: string;
    categoria: string;
    descripcion: string;
    imagen: File | null;
    existencias: string;
}

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

export default function ProductForm({ isOpen, onClose, editProduct, onUpdate }: ProductFormProps) {
    const [formData, setFormData] = useState<FormData>({
        nombre: "",
        marca: "",
        modelo: "",
        precio: "",
        categoria: "",
        descripcion: "",
        imagen: null,
        existencias: "",
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (editProduct) {
            setFormData({
                nombre: editProduct.nombre,
                marca: editProduct.marca,
                modelo: editProduct.modelo,
                categoria: editProduct.categoria,
                precio: editProduct.precio.toString(),
                descripcion: editProduct.descripcion,
                imagen: null,
                existencias: editProduct.existencias,
            });
            setPreviewUrl(editProduct.imagen);
        } else {
            setFormData({
                nombre: "",
                marca: "",
                modelo: "",
                precio: "",
                categoria: "",
                descripcion: "",
                imagen: null,
                existencias: "",
            });
            setPreviewUrl(null);
        }
    }, [editProduct, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, imagen: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, imagen: null }));
        setPreviewUrl(null);
    };

    const processProduct = async () => {
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
                categoria: formData.categoria,
                descripcion: formData.descripcion,
                imagen: imageUrl,
                existencias: parseInt(formData.existencias),
            });
        } else {
            await addDoc(productosCollection, {
                nombre: formData.nombre,
                marca: formData.marca,
                modelo: formData.modelo,
                precio: parseFloat(formData.precio),
                categoria: formData.categoria,
                descripcion: formData.descripcion,
                imagen: imageUrl,
                existencias: parseInt(formData.existencias),
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nombre || !formData.marca || !formData.modelo || !formData.precio || !formData.existencias || !formData.categoria || !formData.descripcion) {
            toast.error("Por favor, complete todos los campos obligatorios.");
            return;
        }

        if (!formData.imagen && !editProduct) {
            toast.error("La imagen es obligatoria. Por favor, suba una imagen del producto.");
            return;
        }

        try {
            toast.promise(
                processProduct(),
                {
                    loading: 'Procesando producto...',
                    success: () => {
                        const successMessage = editProduct ? 'Producto actualizado correctamente' : 'Producto agregado correctamente';
                        onUpdate();
                        return successMessage;
                    },
                    error: 'Error al procesar el producto. Por favor, inténtalo de nuevo.',
                }
            );
            onClose();

        } catch (error) {

        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
            <DrawerContent>
                <DrawerHeader>
                    <h2 className="text-2xl font-bold">
                        {editProduct ? "Editar Producto" : "Agregar Producto"}
                    </h2>
                </DrawerHeader>
                <DrawerBody>
                    <form onSubmit={handleSubmit} className="w-full items-center space-y-11 px-6">
                        <Input
                            label="Nombre"
                            labelPlacement="outside"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            variant='underlined'
                            autoFocus
                        />
                        <Input
                            label="Marca"
                            labelPlacement="outside"
                            name="marca"
                            value={formData.marca}
                            onChange={handleInputChange}
                            variant='underlined'
                        />
                        <Input
                            label="Modelo"
                            labelPlacement="outside"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleInputChange}
                            variant='underlined'
                        />
                        <Input
                            label="Precio"
                            labelPlacement="outside"
                            name="precio"
                            type="number"
                            value={formData.precio}
                            onChange={handleInputChange}
                            variant='underlined'
                        />
                        <Input
                            label="Existencias"
                            labelPlacement="outside"
                            name="existencias"
                            type="number"
                            value={formData.existencias}
                            onChange={handleInputChange}
                            variant='underlined'
                        />
                        <Input
                            label="Categoria"
                            labelPlacement="outside"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleInputChange}
                            variant='underlined'
                        />
                        <Textarea
                            label="Descripcion"
                            labelPlacement='outside'
                            name='descripcion'
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            variant='underlined'
                        />
                        {!previewUrl && (
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-38 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 ">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click para subir.</span> </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 600x400px)</p>
                                    </div>
                                    <Input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageChange} errorMessage="SUbe una imagen" />
                                </label>
                            </div>
                        )}
                        {previewUrl && (
                            <div className="relative flex justify-center items-center">
                                <Image src={previewUrl} isBlurred isZoomed alt="Vista previa" className="rounded-md max-w-full max-h-36 bg-white" />
                                <Tooltip content="Eliminar imagen" color='danger' showArrow={true}>
                                    <Button
                                        type="button"
                                        color='danger'
                                        isIconOnly
                                        radius='full'
                                        size='sm'
                                        variant='shadow'
                                        className="absolute z-10 top-0 right-0 "
                                        onClick={handleRemoveImage}
                                    >
                                        X
                                    </Button>
                                </Tooltip>
                            </div>
                        )}

                        <div className='flex justify-end pt-0 pr-0'>
                            <ButtonGroup>
                                <Button color="primary" type='submit'>
                                    {editProduct ? "Guardar Cambios" : "Agregar Producto"}
                                </Button>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                            </ButtonGroup>
                        </div>
                    </form>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
