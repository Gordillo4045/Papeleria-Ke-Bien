import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmationModal({ isOpen, onConfirm, onCancel }: DeleteConfirmationModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} placement="center">
            <ModalContent>
                <ModalHeader>Confirmar Eliminación</ModalHeader>
                <ModalBody>
                    <p>¿Estás seguro de que deseas eliminar este producto?</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onPress={onConfirm}>
                        Eliminar
                    </Button>
                    <Button color="default" onPress={onCancel}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}