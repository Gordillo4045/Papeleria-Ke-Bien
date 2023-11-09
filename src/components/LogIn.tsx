import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react"
// @ts-ignore
import {MailIcon} from '../assets/MailIcon.jsx'
// @ts-ignore
import {LockIcon} from '../assets/LockIcon.jsx'
import { useState } from "react"
import { auth } from "../Config/Config.tsx"
import { signInWithEmailAndPassword } from "firebase/auth";

export default function App() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
       
    const onLogin = (e:React.MouseEvent) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = '/controlpanel'
            //const user = userCredential.user;
            //console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        })
    }
    //<Button onPress={onOpen} color="primary">Iniciar sesion</Button>
    //
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
    <>
    <Button onPress={onOpen} color="primary">Iniciar sesion</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
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
                  onChange={(e)=> setEmail(e.target.value)}
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
                  onChange={(e)=> setPassword(e.target.value)}
                  value={password}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onClick={onLogin}>
                  Iniciar sesion
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
