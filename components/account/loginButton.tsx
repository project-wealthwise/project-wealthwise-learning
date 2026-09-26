import Image from 'next/image';

type LoginProps = {
    src: string,
    text: string,
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void,
    style?: React.CSSProperties,
    imgAlt?: string,
    imgWidth?: number,
    imgHeight?: number,
};

export default function LoginButton({
    src,
    text, 
    callback, 
    style = {},
    imgAlt = 'Logo',
    imgWidth = 25,
    imgHeight = 25
}: LoginProps) {
    return (
        <button className="pww-button font-medium" onClick={e => callback(e)} style={style}>
            <Image 
                className="header-logo" 
                src={src}
                alt={imgAlt}
                height={imgHeight}
                width={imgWidth}
            />
            {text}
        </button>
    );
}