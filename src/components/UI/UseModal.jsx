import { Modal } from 'antd';
const UseModal = ({ children, title, isModaOpen, handleCancel, handleOk, okText, cancelText }) => {
    return (
        <Modal
            title={title}
            open={isModaOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={okText}
            cancelText={cancelText}
        >
            {children}
        </Modal>
    );
};

export default UseModal;
