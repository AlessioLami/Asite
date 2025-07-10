import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

const ProtectedRoute = ({allowedRoles}: {allowedRoles: string[]}) => {
    const user = useSelector((state: RootState) => state.auth.user)
    const role = useSelector((state: RootState) => state.auth.role)

    if(!user){
        return <Navigate to="/login" replace/>
    }

    if(!allowedRoles.includes(role)){
        return <Navigate to="/login" replace/>
    }

    return <Outlet/>
}

export default ProtectedRoute