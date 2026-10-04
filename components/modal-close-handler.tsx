'use client';

import type { ReactNode } from 'react';
import { closeModalHandler } from '@/lib/modal';

export default function ModalCloseHandler({ children }: { children: ReactNode }) {
    return (
        <div
            style={{ display: 'contents' }}
            onClick={(e) => closeModalHandler(e.nativeEvent)}
        >
            {children}
        </div>
    );
}