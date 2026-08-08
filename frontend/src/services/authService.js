const BASE_URL = import.meta.env.VITE_API_URL

const parseResponse = async (response) => {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.error || data?.message || data?.msg || 'Request failed.');
    }
    return data;
};

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        return await parseResponse(response);
    } catch (error) {
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Unable to connect to server. Please try again later.');
        }
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        return await parseResponse(response);
    } catch (error) {
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Unable to connect to server. Please try again later.');
        }
        throw error;
    }
};

export const getCurrentUser = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return await parseResponse(response);
    } catch {
        throw new Error('Failed to verify authentication');
    }
};

export const logoutUser = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return await response.json().catch(() => ({ message: 'Logged out successfully' }));
    } catch {
        return { message: 'Logged out successfully' };
    }
};
