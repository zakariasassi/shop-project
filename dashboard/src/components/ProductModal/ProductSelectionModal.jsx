import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Add this line to prevent screen readers from reading content outside the modal

const ProductSelectionModal = ({ isOpen, onRequestClose, products, selectedProductIds, onSelectProduct }) => {
    return (
        <Modal
            isOpen={true}
            onRequestClose={onRequestClose}
            contentLabel="Select Products"
            className="grid w-screen"
            overlayClassName="overlay"
        >
            <h2 className="mb-4 text-2xl font-bold">Select Products</h2>
            {products.products.map(product => (
                <label key={product.id} className="block mb-2">
                    <input
                        type="checkbox"
                        value={product.id}
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => onSelectProduct(product.id)}
                        className="mr-2"
                    />
                    {product.TradeName}
                </label>
            ))}
            <button
                className="w-full p-2 mt-4 text-white bg-blue-500 rounded"
                onClick={onRequestClose}
            >
                Close
            </button>
        </Modal>
    );
};

export default ProductSelectionModal;
