const BASE_URL = import.meta.env.VITE_API_URL
const HEALTH_URL = `${import.meta.env.VITE_API_URL}/health`

const checkServerConnection = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(HEALTH_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            throw new Error(data?.error || data?.message || 'Server is not responding');
        }

        return true;
    } catch (error) {
        // Non-blocking: log error but don't throw
        console.warn('Health check warning:', error.message);
        return true; // Allow request to proceed
    }
};

const parseResponse = async (response) => {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.error || data?.message || data?.msg || 'Request failed.');
    }
    return data;
};

export const registerUser = async (userData) => {
    await checkServerConnection();

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        return await parseResponse(response);
    } catch (error) {
        if (error.message === 'Failed to fetch' || error.message === 'NetworkError when attempting to fetch resource.' || error.message.includes('AbortError')) {
            throw new Error('Server is temporarily unavailable. Please try again in a moment.');
        }
        throw error;
    }
};

export const loginUser = async (credentials) => {
    await checkServerConnection();

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        return await parseResponse(response);
    } catch (error) {
        if (error.message === 'Failed to fetch' || error.message === 'NetworkError when attempting to fetch resource.' || error.message.includes('AbortError')) {
            throw new Error('Server is temporarily unavailable. Please try again in a moment.');
        }
        throw error;
    }
};

export const getCurrentUser = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return await parseResponse(response);
    } catch (error) {
        throw new Error(error.message || 'Failed to get user info');
    }
};

export const logoutUser = () => {
    return { message: 'Logged out successfully' };
};