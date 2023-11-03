import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react"
// @ts-ignore
import {MailIcon} from '../assets/MailIcon.jsx'
// @ts-ignore
import {LockIcon} from '../assets/LockIcon.jsx'
import { useState } from "react"
//import { auth } from "../Config/Config.tsx"

export default function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  //const [errorMsg, setErrorMsg] = useState('')
  //const [successMsg, setSuccessMsg] = useState('')

//   const handleLogin=(e)=>{
//     e.preventDefault()
//     auth
//   }

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
                <Button color="primary" onPress={onClose}>
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
