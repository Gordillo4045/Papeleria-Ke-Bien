import { BiSolidTrashAlt } from 'react-icons/bi';
import { useCart } from './CartContext';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Card, CardBody, CardHeader, ModalFooter } from "@nextui-org/react";
import { FiMinus, FiPlus } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: ModalProps) => {
    const { cart, removeFromCart, updateQuantity } = useCart();

    const totalItems = cart.reduce((total, product) => total + product.cantidad, 0);
    const subtotal = cart.reduce((total, product) => total + (product.precio * product.cantidad), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    return (
        <Modal isOpen={isOpen} onClose={onClose} placement='top-center' size='2xl' scrollBehavior='inside'
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                },
            }}
        >
            <ModalContent>
                <ModalHeader>Carrito de Compras</ModalHeader>
                <ModalBody>
                    <AnimatePresence>
                        {cart.length === 0 ? (
                            <p className='text-sm text-center text-gray-500 pointer-events-none'>No hay productos en el carrito</p>
                        ) : (
                            cart.map((product) => (
                                <motion.div
                                    key={product.id}
                                    className='flex gap-10 justify-between items-center'
                                    initial={{ x: "-100%", opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: "-100%", opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    layout
                                >
                                    <p className='flex-grow '>{product.nombre} {product.marca} </p>
                                    <div className="flex items-center justify-between ">
                                        <div className="flex items-center">
                                            <button onClick={() => updateQuantity(product.id, Math.max(1, product.cantidad - 1))} className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                                                <FiMinus />
                                            </button>
                                            <input type="text" className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white" value={product.cantidad} readOnly />
                                            <button onClick={() => updateQuantity(product.id, product.cantidad + 1)} className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                                                <FiPlus />
                                            </button>
                                        </div>
                                    </div>
                                    <span className='min-w-20'>${(product.precio).toFixed(2)}</span>
                                    <Button onPress={() => removeFromCart(product.id)} variant='light' color='danger' startContent={<BiSolidTrashAlt />}>Eliminar</Button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                    <Card>
                        <CardHeader className='font-medium'>Resumen del Pedido</CardHeader>
                        <CardBody className='flex gap-3'>
                            <div className="flex justify-between">
                                <span>Total de artículos:</span>
                                <span>{totalItems}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Impuestos (16%):</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <Button>Comprar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CartModal;