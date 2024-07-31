import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react"
// @ts-ignore
import { MailIcon } from '../../assets/MailIcon.jsx'
// @ts-ignore
import { LockIcon } from '../../assets/LockIcon.jsx'
import { useEffect, useState } from "react"
import { auth } from "../../Config/Config.tsx"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  const onLogin = (e: React.MouseEvent) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        //window.location.href = '/controlpanel'
        setIsLoggedIn(true);
        //const user = userCredential.user;
        //console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      })
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        hideCloseButton
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
                label="Email"
                placeholder="Ingresa tu correo"
                variant="bordered"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Input
                isRequired
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Password"
                placeholder="Ingresa tu contrasena"
                type="password"
                variant="bordered"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </ModalBody>
            <ModalFooter>
              {isLoggedIn ? (
                <p>Usuario no autenticado</p>
              ) : (
                <p>Usuario autenticado</p>

              )}

              <Button color="primary" onClick={onLogin}>
                Iniciar sesion
              </Button>

            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
