import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react"
// @ts-ignore
import { MailIcon } from '../assets/MailIcon.jsx'
// @ts-ignore
import { LockIcon } from '../assets/LockIcon.jsx'
import { useEffect, useState } from "react";
import { auth } from "../Config/Config.tsx"
import { signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
//import {db, storage} from "../Config/Config"
interface FormState {
  email: string;
  password: string;
}

export default function App() {
  const [formProducts, setFormProducts] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    precio: '',
    imagen: null,
 })

//  const handleChange = (e) => {
//   if (e.target.name === 'imagen') {
//     setForm({ ...form, imagen: e.target.files[0] });
//   } else {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }
// }

  const [title, setTitle] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState(null)

  const [imageError, setImageError] = useState('')

  const [successMsg, setSucessMsg] = useState('')
  const [uploadError, setUploadError] = useState('')
  const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG']
  // @ts-ignore
  const handleProductImg = (e) => {
    e.preventDefault();
    let selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile && types.includes(selectedFile.type)) {
        setImage(selectedFile)
        setImageError('')
      } else {
        setImage(null)
        setImageError('Selecciona un tipo valido jpg o png')
      }
    } else {
      console.log('porfavor selecciona el archivo')
    }
  }
  // @ts-ignore
  const handleAddProducts = (e) => {
    e.preventDefault();
    // console.log(title,marca,modelo,price)
    // console.log(image)
    //const uploadTask=storage.ref(`product-images/${image.name}`).put(image)
  }

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

  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
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

      } else {
        onOpen()

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
                  <p className="text-sm font-thin text-red-500 my-auto left-1">Usuario no autenticado</p>
                ) : (
                  <p className="text-sm font-thin my-auto left-1">Usuario autenticado</p>
                  
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
        {successMsg && <>
          <div className="sucess-msg">{successMsg}</div>
        </>}
        <form action="" onSubmit={handleAddProducts} className="flex flex-col bg-gray-50 h-screen w-full items-center space-y-14 p-6">
          <Input
            isRequired
            type="text"
            label="Nombre"
            labelPlacement="outside"
            placeholder="Cuaderno"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <Input
            isRequired
            type="text"
            label="Marca"
            labelPlacement="outside"
            placeholder="Bazic"
            onChange={(e) => setMarca(e.target.value)}
            value={marca}
          />
          <Input
            isRequired
            type="text"
            label="Modelo"
            labelPlacement="outside"
            placeholder="Cuadro"
            onChange={(e) => setModelo(e.target.value)}
            value={modelo}
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
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
          <Input
            isRequired
            type="file"
            label="Imagen"
            placeholder="Selecciona el archivo"
            labelPlacement="outside"
            onChange={handleProductImg}
          />
          {imageError && <>
            <div className="error-msg">{imageError}</div>
            <br />
          </>}
          <Button color="success" type="submit" >
            Aceptar
          </Button>
        </form>
        {uploadError && <>
          <br />
          <div className="error-msg">{uploadError}</div>

        </>}
      </div>
    </div>
  )
}