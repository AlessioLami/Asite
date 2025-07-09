import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"

const ProtectedRoute = ({allowedRoles}: {allowedRoles: string[]}) => {
    const user = useSelector(state => state.auth.user)
    const role = useSelector(state => state.auth.role)

    if(!user){
        return <Navigate to="/login" replace/>
    }

    if(!allowedRoles.includes(role)){
        return <Navigate to="/login" replace/>
    }

    return <Outlet/>
}

export default ProtectedRoute