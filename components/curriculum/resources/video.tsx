import { ResourceProps } from '@/lib/curriculum';

export default function CurriculumVideoResource({
    resource
}: ResourceProps) {
    const videoId 
        = resource.link.match(/https:\/\/(www\.)?youtube\.com\/watch\?v=(.*?)($|&)/)?.[1]
        || resource.link.match(/https:\/\/youtu\.be\/(.*?)($|\?)/)?.[1]
        || '';
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
    console.log(videoId, resource.link);

    return (
        <>
            <div 
                style={{
                    left: 0, 
                    width: '100%', 
                    height: 0, 
                    position: 'relative', 
                    paddingBottom: '56.25%' 
                }}
            >
                <iframe 
                    src={embedUrl} 
                    style={{ 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        position: 'absolute', 
                        border: 0 
                    }} 
                    allowFullScreen 
                    scrolling="no" 
                    allow="accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *;" referrerPolicy="strict-origin"
                />
            </div>
        </>
    );
}