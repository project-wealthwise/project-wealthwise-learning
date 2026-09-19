"use client";
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const headerData = [
    { title: 'Home', href: '/'},
    { title: 'Account', href: '/account'}
];

export default function Header() {
    const path = usePathname();
    const headerItems = headerData.map((data, i) =>
        <a href={data.href} className={path == data.href ? 'font-bold underline' : ''} key={i}>
            {data.title}
        </a>
    );

    return (
        <div className="header">
            <div className="header-grid">
                <a href="/">
                    <Image 
                        className="header-logo" 
                        src="/img/logos/base.png"
                        alt="Project Wealthwise Logo"
                        height={30}
                        width={60}
                    />
                </a>
                {headerItems}
            </div>
        </div>
    )
}