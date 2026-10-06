import { ResourceProps } from '@/lib/curriculum';

export default function CurriculumSlideshowResource({
    resource
}: ResourceProps) {
    const presentationId 
        = resource.link.match(/https:\/\/docs\.google\.com\/presentation\/d\/(.*?)[\/?&]/)?.[1]
        || '';
    const embedUrl = `https://docs.google.com/presentation/d/${presentationId}/embed`;

    return (
        <>
            <div
                style={{ 
                    left: 0, 
                    width: '100%', 
                    height: 0, 
                    position: 'relative', 
                    paddingBottom: '56.25%', 
                    paddingTop: 30 
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
                />
            </div>
        </>
    );
}