
const Api = {
health: async () => {
        try {
            const response = await fetch('/api/health');
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
            return await response.json();
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
            return await response.json();
        } catch (error) {
            console.error('API register error:', error);
            return { status: 'error', message: 'An error occurred while registering.' };
        }
    }

}


export default Api;