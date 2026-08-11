
const Api = {
health: async () => {
        try {
            const response = await fetch('/api/health');
            const contentType = response.headers.get('content-type') || '';
            if (!response.ok) {
                const text = await response.text();
                return { status: 'error', message: text || response.statusText };
            }
            if (!contentType.includes('application/json')) {
                const text = await response.text();
                return { status: 'error', message: 'Unexpected response: ' + text };
            }
            return await response.json();
        } catch (error) {
            console.error('API health check error:', error);
            return { status: 'error', message: 'An error occurred while checking health.' };
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                const text = await response.text();
                return { status: 'error', message: text || response.statusText };
            }
            const data = await response.json();
            if (!response.ok) return { status: 'error', message: data?.message || response.statusText };
            return data;
        } catch (error) {
            console.error('API login error:', error);
            return { status: 'error', message: 'An error occurred while logging in.' };
        }
    },
    register: async (name: string, email: string, password: string) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                const text = await response.text();
                return { status: 'error', message: text || response.statusText };
            }
            const data = await response.json();
            if (!response.ok) return { status: 'error', message: data?.message || response.statusText };
            return data;
        } catch (error) {
            console.error('API register error:', error);
            return { status: 'error', message: 'An error occurred while registering.' };
        }
    }

}


export default Api;