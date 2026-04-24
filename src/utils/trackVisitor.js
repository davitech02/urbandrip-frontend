import API from '../services/api';

export const initializeVisitorTracking = () => {
    // Generate or retrieve visitor ID
    let visitorId = localStorage.getItem('ud_visitor_id');
    
    if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('ud_visitor_id', visitorId);
    }
    
    return visitorId;
};

export const trackVisitor = async (pagePath) => {
    try {
        const visitorId = localStorage.getItem('ud_visitor_id') || crypto.randomUUID();
        
        // Determine device type
        const deviceType = window.innerWidth <= 768 ? 'mobile' : 'desktop';
        
        // Get browser info
        const browserInfo = navigator.userAgent;
        
        await API.post('/visitors/track', {
            visitor_id: visitorId,
            page_url: pagePath,
            referrer: document.referrer || null,
            device_type: deviceType,
            browser: browserInfo
        });
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
};
