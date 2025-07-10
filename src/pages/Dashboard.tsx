import { useSelector } from "react-redux";
import Overlay from "../components/Overlay.tsx";
import InteractivePanel from "../components/threejs/InteractivePanel.tsx";
import type { RootState } from "../store.ts";

const Dashboard = () => {

    const user = useSelector((state: RootState) => state.auth.user)
    const role = useSelector((state: RootState) => state.auth.role).toUpperCase()
    
    return (
        <div className="relative h-screen w-full">
            <Overlay email={user} role={role}/>
            <InteractivePanel/>
        </div>

    )
}

export default Dashboard;