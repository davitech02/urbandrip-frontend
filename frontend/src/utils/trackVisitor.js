import API from '../services/api';

export const trackVisitor = async (pagePath) => {
    try {
        const visitorId = localStorage.getItem('ud_visitor_id') || crypto.randomUUID();
        const deviceType = window.innerWidth <= 768 ? 'mobile' : 'desktop';
        await API.post('/api/visitors/track', {
            visitor_id: visitorId,
            page_url: pagePath,
            referrer: document.referrer || null,
            device_type: deviceType,
            browser: navigator.userAgent
        });
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
};
