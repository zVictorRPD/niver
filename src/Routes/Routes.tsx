import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home/index';
import { AuthLayout } from '../layouts/AuthLayout';
import { Login } from '../pages/Login/index';
import { Register } from '../pages/Register';
import { Niver } from '../pages/Niver';
import { LoggedLayout } from '../layouts/LoggedLayout/index';
import { AuthMiddleware, LoggedMiddleware } from './AuthMiddleware';
import { EditUser } from '../pages/EditUser';

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/auth"
                element={
                    <LoggedMiddleware>
                        <AuthLayout />
                    </LoggedMiddleware>
                }
            >
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
            </Route>
            <Route
                path="/logged"
                element={
                    <AuthMiddleware>
                        <LoggedLayout />
                    </AuthMiddleware>
                }
            >
                <Route path="/logged" element={<Niver />} />
                <Route path="/logged/edit-user" element={<EditUser />} />
            </Route>
            <Route path="*" element={<h1>404</h1>} />
        </Routes>
    )
}