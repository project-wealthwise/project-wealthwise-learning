import type { Metadata } from 'next';
import { Raleway, Inter, DM_Sans } from 'next/font/google';
import './globals.css';
import ModalCloseHandler from '@/components/modal-close-handler';

// Initialize Fonts
const raleway = Raleway({
    variable: '--font-title',
    subsets: ['latin']
});

const inter = Inter({
    variable: '--font-medium',
    subsets: ['latin']
});

const dm_sans = DM_Sans({
    variable: '--font-main',
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: 'Project Wealthwise Test',
    description: 'Test description',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html
            lang='en'
            className={` h-full antialiased`}
        >
            <head>
                <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Raleway' />
                <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=DM Sans' />
                <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Inter' />
            </head>
            <body className='min-h-full flex flex-col'>
                <ModalCloseHandler>{children}</ModalCloseHandler>
            </body>
        </html>
    );
}
