import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react"
//@ts-ignore
import { MailIcon } from '../../assets/MailIcon.jsx'
//@ts-ignore
import { LockIcon } from '../../assets/LockIcon.jsx'
import { useEffect, useState } from "react";
import { auth, storage, db } from "../../Config/Config.tsx"
import { signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { toast } from 'sonner';

interface FormState {
  email: string;
  password: string;
}

interface FormData {
  nombre: string;
  marca: string;
  modelo: string;
  precio: string;
  imagen: File | null;
}

interface Producto {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  precio: number;
  imagen: string;
}

export default function App() {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loginMessage, setLoginMessage] = useState<string>('');
  const [uploadMessage, setUploadMessage] = useState<{ message: string, isError: boolean } | null>(null);

  const handleLoginMessage = (message: string) => {
    setLoginMessage(message);
    setTimeout(() => {
      setLoginMessage('');
    }, 5000); // Limpiar el mensaje después de 5 segundos
  };
  const handleUploadMessage = (message: string, isError: boolean) => {
    setUploadMessage({ message, isError });
    setTimeout(() => {
      setUploadMessage(null);
    }, 5000); // Limpiar el mensaje después de 5 segundos
  };

  const handleInputChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      console.error("Error al obtener la lista de productos", error);
    }
  };
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEliminarProducto = (producto: Producto) => {
    setProductToDelete(producto);
    setShowDeleteModal(true);
  };

  const confirmarEliminarProducto = async () => {
    if (productToDelete) {
      try {
        const productosCollection = collection(db, "productos");
        await deleteDoc(doc(productosCollection, productToDelete.id));

        // Actualizar la lista de productos después de la eliminación
        obtenerProductos();


        toast("Producto eliminado con éxito");
      } catch (error) {
        toast("Error al eliminar el producto");
      }
    }

    // Resetear los estados después de la eliminación
    setProductToDelete(null);
    setShowDeleteModal(false);
  };

  const cancelarEliminarProducto = () => {
    // Resetear los estados si el usuario cancela
    setProductToDelete(null);
    setShowDeleteModal(false);
  };

  const [editProducto, setEditProducto] = useState<Producto | null>(null);

  const handleEditarProducto = async (producto: Producto) => {
    setEditProducto(producto);
  };

  const handleGuardarEdicion = async () => {
    if (editProducto) {
      try {
        const productosCollection = collection(db, "productos");
        const productoDoc = doc(productosCollection, editProducto.id);
        await updateDoc(productoDoc, {
          nombre: editProducto.nombre,
          marca: editProducto.marca,
          modelo: editProducto.modelo,
          precio: editProducto.precio,
          imagen: editProducto.imagen,
        });

        // Limpiar el estado de edición y actualizar la lista de productos
        setEditProducto(null);
        obtenerProductos();

        console.log("Producto editado con éxito");
      } catch (error) {
        console.error("Error al editar el producto", error);
      }
    }
  }

  useEffect(() => {
    obtenerProductos();
    // Verifica el estado de autenticación cuando el componente se monta
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        onClose()
        setIsLoggedIn(true);
      } else {
        onOpen()
        setIsLoggedIn(false);
      }
    });
    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    const { email, password } = formState;

    if (!validateEmail(email)) {
      setEmailError('Por favor, ingrese un correo electrónico válido.');
      return;
    } else {
      setEmailError('');
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      setFormState({
        email: '',
        password: '',
      });
      handleLoginMessage('Inicio de sesión exitoso');
    } catch (error) {
      console.log(error);
      handleLoginMessage('Error en el inicio de sesión. Verifica tus credenciales.');
    }
  }

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      onOpen()
    }).catch((error) => {
      // An error happened.
      console.log(error.message)
    });
  }

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    marca: "",
    modelo: "",
    precio: "",
    imagen: null,
  });

  const handleInputChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        imagen: e.target.files && e.target.files[0],
      }));
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.nombre &&
      formData.marca &&
      formData.modelo &&
      formData.precio &&
      formData.imagen
    ) {
      try {

        const storageRef = ref(storage, `imagenes/${formData.imagen.name}`);
        await uploadBytes(storageRef, formData.imagen);
        const imageUrl = await getDownloadURL(storageRef);

        const productosCollection = collection(db, "productos");
        const nuevoProducto = {
          nombre: formData.nombre,
          marca: formData.marca,
          modelo: formData.modelo,
          precio: parseFloat(formData.precio),
          imagen: imageUrl,
        };

        await addDoc(productosCollection, nuevoProducto);

        // Limpiar el formulario después de la subida exitosa
        setFormData({
          nombre: "",
          marca: "",
          modelo: "",
          precio: "",
          imagen: null,
        });

        handleUploadMessage('Producto subido correctamente', false);
      } catch (error) {
        console.error("Error al subir datos a Firebase", error);
        handleUploadMessage('Error al subir el producto. Por favor, inténtalo de nuevo.', true);
      }
    } else {
      console.log("Por favor, complete todos los campos.");
    }
  };

  return (
    <div className="bg-gray-50">
      <>
        <Modal
          isOpen={showDeleteModal}
          placement="top-center"
          backdrop={"opaque"}
          hideCloseButton
          classNames={{
            backdrop: "bg-gradient-to-t from-red-500/70 to-red-900/10 backdrop-opacity-20"
          }}
        >
          <ModalContent>
            <ModalHeader>¿Estás seguro de que deseas eliminar este producto?</ModalHeader>
            <ModalFooter>
              <Button color="danger" onClick={confirmarEliminarProducto}>
                Eliminar
              </Button>
              <Button color="default" onClick={cancelarEliminarProducto}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isOpen}
          placement="top-center"
          hideCloseButton
          backdrop={"blur"}
        >
          <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1">Inicio de sesion</ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  autoFocus
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Correo"
                  placeholder="Ingresa tu correo"
                  variant="bordered"
                  value={formState.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}

                />

                {emailError && <p className="text-xs text-red-700 ml-2">{emailError}</p>}
                <Input
                  isRequired
                  endContent={
                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  type="password"
                  variant="bordered"
                  value={formState.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                {isLoggedIn ? (
                  <p className="text-sm font-thin text-green-500 my-auto left-1">{loginMessage}</p>
                ) : (
                  <p className="text-sm font-thin my-auto text-red-500 left-4">{loginMessage}</p>
                )}
                <Button color="primary" onClick={handleSubmit}>
                  Iniciar sesion
                </Button>

              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </>
      <div className="lg:w-9/12 flex flex-col items-center justify-center m-auto bg-gray-50 min-h-screen ">
        <div className="grid grid-cols-3">
          <h1 className="text-4xl font-bold col-span-2">Lista de Productos</h1>
          <Button color="success" onClick={() => setIsModalOpen(true)} className="col-end-7 col-span-2">
            Agregar Producto
          </Button>
          <Button color="danger" type="submit" onClick={handleSignOut} className="col-end-7 col-span-2">
            Cerrar sesion
          </Button>
        </div>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalContent>
              <ModalHeader>
                <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>
              </ModalHeader>
              <ModalBody>
                {/* Formulario de agregar producto */}
                <form action="" onSubmit={handleSubmitForm} className=" w-full items-center space-y-11 p-6">
                  <Input
                    isRequired
                    type="text"
                    label="Nombre"
                    labelPlacement="outside"
                    placeholder="Cuaderno"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChangeForm}
                  />
                  <Input
                    isRequired
                    type="text"
                    label="Marca"
                    labelPlacement="outside"
                    placeholder="Bazic"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChangeForm}
                  />
                  <Input
                    isRequired
                    type="text"
                    label="Modelo"
                    labelPlacement="outside"
                    placeholder="Cuadro"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChangeForm}
                  />
                  <Input
                    isRequired
                    type="number"
                    label="Precio"
                    placeholder="0.00"
                    labelPlacement="outside"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">$</span>
                      </div>
                    }
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChangeForm}
                  />
                  <Input
                    isRequired
                    type="file"
                    label="Imagen"
                    placeholder="Selecciona el archivo"
                    labelPlacement="outside"
                    // onChange={handleProductImg}
                    accept="image/*"
                    onChange={handleImagenChange}
                  />

                </form>
              </ModalBody>
              <ModalFooter>
                {uploadMessage && <p className=" font-bold text-sm w-full h-10 flex items-center content-center rounded-md text-center justify-center ${uploadMessage.isError ? 'text-red-500 bg-red-100' : 'text-green-500 bg-green-100'}">
                  {uploadMessage.message}</p>}
                <Button color="primary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button color="success" type="submit" onClick={handleSubmitForm}>
                  Agregar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        <div className="">
          <ul className="mt-4 grid grid-cols-4">
            {productos.map((producto) => (
              <li key={producto.id} className="mb-4">
                <div>
                  <strong>{producto.nombre}</strong> - {producto.marca} - {producto.modelo} - ${producto.precio}
                </div>
                <div className="flex mt-2">
                  <Button color="warning" onClick={() => handleEditarProducto(producto)}>
                    Editar
                  </Button>
                  <Button color="danger" onClick={() => handleEliminarProducto(producto)}>
                    Eliminar
                  </Button>

                </div>
              </li>
            ))}
          </ul>
        </div>
        {editProducto && (
          <Modal isOpen={Boolean(editProducto)}>
            <ModalContent>
              <ModalHeader>
                <h2 className="text-2xl font-bold mb-4">Editar Producto</h2>
              </ModalHeader>
              <ModalBody>
                <form onSubmit={(e) => e.preventDefault()} className=" w-full items-center space-y-4 ">
                  <Input
                    label="Nombre"
                    placeholder="Nombre del producto"
                    value={editProducto.nombre}
                    onChange={(e) => setEditProducto({ ...editProducto, nombre: e.target.value })}
                  />
                  <Input
                    label="Marca"
                    placeholder="Marca del producto"
                    value={editProducto.marca}
                    onChange={(e) => setEditProducto({ ...editProducto, marca: e.target.value })}
                  />
                  <Input
                    label="Modelo"
                    placeholder="Modelo del producto"
                    value={editProducto.modelo}
                    onChange={(e) => setEditProducto({ ...editProducto, modelo: e.target.value })}
                  />
                  <Input
                    label="Precio"
                    placeholder="Precio del producto"
                    type="number"
                    value={editProducto.precio.toString()}
                    onChange={(e) => setEditProducto({ ...editProducto, precio: parseFloat(e.target.value) })}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={handleGuardarEdicion}>
                  Guardar Edición
                </Button>
                <Button color="default" onClick={() => setEditProducto(null)}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

      </div>
    </div>
  )
}
