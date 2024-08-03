import { useCart } from './CartContext';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: ModalProps) => {
    const { cart, removeFromCart } = useCart();

    return (
        <Modal isOpen={isOpen} onClose={onClose} placement='center' size='full'>
            <ModalContent>
                <ModalHeader>Carrito de Compras</ModalHeader>
                <ModalBody>
                    {cart.length === 0 ? (
                        <p>No hay productos en el carrito</p>
                    ) : (
                        cart.map((product) => (
                            <div key={product.id} className='flex gap-10'>
                                <p>{product.nombre} - {product.cantidad} x ${product.precio.toFixed(2)}</p>
                                <Button onPress={() => removeFromCart(product.id)}>Eliminar</Button>
                            </div>
                        ))
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CartModal;
