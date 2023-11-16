import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react"
//@ts-ignore
import { MailIcon } from '../assets/MailIcon.jsx'
//@ts-ignore
import { LockIcon } from '../assets/LockIcon.jsx'
import { useEffect, useState } from "react";
import { auth, storage, db} from "../Config/Config.tsx"
import { signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from "firebase/firestore";

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

 export default function App() {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailError, setEmailError] = useState('');

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

  useEffect(() => {
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

  const handleSubmit = async (e:  React.MouseEvent) => {
    e.preventDefault();

    const { email, password } = formState;

    if (!validateEmail(email)) {
      setEmailError('Por favor, ingrese un correo electrónico válido.');
      return;
    } else {
      setEmailError('');
    }

    try {
      // Autentica al usuario utilizando Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password)

      // Si la autenticación es exitosa, setIsLoggedIn(true) y limpia el formulario
      setIsLoggedIn(true);
      setFormState({
        email: '',
        password: '',
      });
    } 
    catch (error){
      console.log(error)
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

        console.log("Datos subidos correctamente");
      } catch (error) {
        console.error("Error al subir datos a Firebase", error);
      }
    } else {
      console.log("Por favor, complete todos los campos.");
    }
  };

  return (
    <div className="bg-gray-50">
      <>
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
                  <p className="text-sm font-thin text-red-500 my-auto left-1"></p>
                ) : (
                  <p className="text-sm font-thin my-auto left-1"></p>
                  
                )}
                <Button color="primary" onClick={handleSubmit}>
                  Iniciar sesion
                </Button>

              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </>
      <div className="lg:w-9/12 flex flex-col items-center justify-center m-auto bg-gray-50">
        <h1 className="text-4xl font-bold">Añadir productos</h1>
        <Button color="danger" type="submit" onClick={handleSignOut} className="mt-5">
          Cerrar sesion
        </Button>
        
        <form action="" onSubmit={handleSubmitForm} className=" bg-gray-50 h-screen w-full items-center space-y-11 p-6">
          <Input
            isRequired
            type="text"
            label="Nombre"
            labelPlacement="outside"
            placeholder="Cuaderno"
            name="nombre" 
            value={formData.nombre}
            onChange={handleInputChangeForm}

            // value={productName} 
            // onChange={(e) => setProductName(e.target.value)}
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
            // value={productMarca} 
            // onChange={(e) => setProductMarca(e.target.value)}
          />
          <Input
            isRequired
            type="text"
            label="Modelo"
            labelPlacement="outside"
            placeholder="Cuadro"
            // value={productModelo} 
            // onChange={(e) => setProductModelo(e.target.value)}
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
            // value={`${productPrice}`} 
            // onChange={(e) => setProductPrice(Number(e.target.value))}
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
          {/* {imageError && <>
            <div className="bg-red-100 font-bold text-sm w-full h-10 flex items-center content-center rounded-md">{imageError}</div>
            
          </>} */}
          <Button color="success" type="submit"  >
            Aceptar
          </Button>
        </form>
        
      </div>
    </div>
  )
}