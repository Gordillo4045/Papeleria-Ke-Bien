import { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Button
} from "@heroui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Config/Config";
import { toast } from 'sonner';
//@ts-ignore
import { MailIcon } from '../assets/MailIcon';
//@ts-ignore
import { LockIcon } from '../assets/LockIcon';

interface LoginFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginForm({ isOpen, onClose }: LoginFormProps) {
    const [formState, setFormState] = useState({
        email: '',
        password: '',
    });
    const [emailError, setEmailError] = useState('');

    const handleInputChange = (name: string, value: string) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        const { email, password } = formState;

        if (!validateEmail(email)) {
            setEmailError('Por favor, ingrese un correo electrónico válido.');
            return;
        } else {
            setEmailError('');
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setFormState({
                email: '',
                password: '',
            });
            toast.success("Inicio de sesión exitoso");
            onClose();
        } catch (error) {
            toast.error("Error en el inicio de sesión. Verifica tus credenciales.");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="top-center"
            hideCloseButton
            isDismissable={false}
            isKeyboardDismissDisabled={true}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Inicio de sesión</ModalHeader>
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
                        errorMessage={emailError}
                    />
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
                    <Button color="primary" onPress={handleSubmit}>
                        Iniciar sesión
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}