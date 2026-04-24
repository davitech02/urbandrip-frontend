const BASE_URL = import.meta.env.VITE_API_URL
const HEALTH_URL = `${import.meta.env.VITE_API_URL}/health`

const checkServerConnection = async () => {
    try {
        const response = await fetch(HEALTH_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            throw new Error(data?.error || data?.message || 'Cannot connect to server. Make sure the backend is running on port 5000.');
        }

        return true;
    } catch (error) {
        throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
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
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        return await parseResponse(response);
    } catch (error) {
        if (error.message === 'Failed to fetch' || error.message === 'NetworkError when attempting to fetch resource.') {
            throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
        }
        throw error;
    }
};

export const loginUser = async (credentials) => {
    await checkServerConnection();

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        return await parseResponse(response);
    } catch (error) {
        if (error.message === 'Failed to fetch' || error.message === 'NetworkError when attempting to fetch resource.') {
            throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
        }
        throw error;
    }
};

export const getCurrentUser = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/me`, {
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