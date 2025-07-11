import { useSelector } from "react-redux";
import Overlay from "../components/Overlay.tsx";
import InteractivePanel from "../components/threejs/InteractivePanel.tsx";
import type { RootState } from "../store.ts";
import { useGetLogsQuery } from "../services/apis/logsApi.ts";

const Dashboard = () => {

    const user = useSelector((state: RootState) => state.auth.user)
    const role = useSelector((state: RootState) => state.auth.role).toUpperCase()

    const { data, isLoading} = useGetLogsQuery({dateStart: "2025-07-01T-06:00Z", dateStop: "2025-07-10T06:00Z"})

    
    return (
        <div className="relative w-full overflow-clip min-h-screen">
            <Overlay email={user} role={role}/>
            <InteractivePanel/>
        </div>

    )
}

export default Dashboard;