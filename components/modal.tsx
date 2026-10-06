import { closeModal, onModalClosed, onModalOpened } from '@/lib/modal';
import { ReactNode, useEffect, useState } from 'react';

type ModalProps = {
    children: ReactNode,
    modalId: string
};

export function Modal({
    children,
    modalId
}: ModalProps) {
    const [visible, setVisibility] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onModalOpened((openedModalId) => {
            if (openedModalId === modalId) 
                setVisibility(true);
        });

        return unsubscribe;
    }, [modalId]);

    useEffect(() => {
        const unsubscribe = onModalClosed((closedModalId) => {
            if (closedModalId === modalId)
                setVisibility(false);
        });

        return unsubscribe;
    }, [modalId]);

    return (
        <div className="modal-container" id={modalId} style={{display: visible ? 'block' : 'none'}}>
            <div className="modal">
                <div className="close-button" onClick={closeModal}>&times;</div>
                {children}
            </div>
        </div>
    );
}