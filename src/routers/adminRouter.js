import { Navigate, Outlet } from "react-router-dom";

function useAuth() {
    const level = localStorage.getItem('isAdmin');
    return level
}
function AdminRoute() {
    const isAuth = useAuth();
    return (isAuth == 'true') ? <Outlet /> : <Navigate to='/login' />
}
export default AdminRoute;