import { createContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../utils/axios';
import { useToasts } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useStorage';

interface User {
    name: string,
    email: string,
    avatar?: string,
    created_at: string,
    access_token: string,
}

interface AuthContextData {
    user: User,
    updateUserData: (user: User) => void,
    onSignUp: (name: string, email: string, password: string) => Promise<void>,
    onLogin: (email: string, password: string) => Promise<void>,
    onLogout: () => void,
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User);
    const [storageUser, setStorageUser] = useLocalStorage('user');

    const { successToast, errorToast } = useToasts();
    const navigate = useNavigate();

    function updateUserData(user: User) {
        setUser(user);
    }

    async function onSignUp(name: string, email: string, password: string) {
        try {
            const response = await api.post('auth/register', {
                name,
                email,
                password
            });
            setStorageUser(response.data);
            updateUserData(response.data);
            successToast("Cadastro", "Cadastro realizado com sucesso");
            api.defaults.headers['Authorization'] = `Bearer ${response.data.access_token}`;
            navigate('/logged');
        } catch (error: any) {
            if (error?.response?.data?.message) {
                errorToast("Erro ao fazer cadastro", error?.response?.data?.message);
            } else {
                errorToast("Erro ao fazer cadastro", "Ocorreu um erro ao fazer cadastro");
            }
        }
    }

    async function onLogin(email: string, password: string) {
        try {
            const response = await api.post('auth/login', {
                email,
                password
            });
            setStorageUser(response.data);
            updateUserData(response.data);
            successToast("Login", "Login realizado com sucesso");
            api.defaults.headers['Authorization'] = `Bearer ${response.data.access_token}`;
            navigate('/logged');
        } catch (error: any) {
            console.log(error);

            if (error?.response?.data.message) {
                errorToast("Erro ao fazer login", error?.response?.data.message);
            } else {
                errorToast("Erro ao fazer login", "Ocorreu um erro ao fazer login");
            }
        }
    }

    function onLogout() {
        setUser({} as User);
        setStorageUser('');
        api.defaults.headers['Authorization'] = '';
    }

    useEffect(() => {
        if (storageUser?.access_token) {
            updateUserData(storageUser);
            api.defaults.headers['Authorization'] = `Bearer ${storageUser?.access_token}`;
        }
    }, [])

    return (
        <AuthContext.Provider value={
            {
                user,
                updateUserData,
                onSignUp,
                onLogin,
                onLogout
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}

