type ModalOpenCallback = (modalId: string, data: any) => void;
type ModalCloseCallback = (modalId: string) => void;

const modalOpenCallbacks: ModalOpenCallback[] = [];
export function onModalOpened(callback: ModalOpenCallback) {
    modalOpenCallbacks.push(callback);
}

const modalCloseCallbacks: ModalCloseCallback[] = [];
export function onModalClosed(callback: ModalCloseCallback) {
    modalCloseCallbacks.push(callback);
}

const modalStack: string[] = [];
export function openModal(modalId: string, data?: any) {
    modalStack.push(modalId);
    for (const callback of modalOpenCallbacks) 
        callback(modalId, data);
    
}

export function closeModal() {
    const modalId: string = modalStack.pop() || '';
    for (const callback of modalCloseCallbacks) 
        callback(modalId);
    
}

export function closeModalHandler(e: Event) {
    if ((e.target as HTMLElement).classList.contains('modal-container'))
        closeModal();
}