import Overlay from "../components/Overlay.tsx";
import InteractivePanel from "../components/threejs/InteractivePanel.tsx";
const Dashboard = () => {

    return (
        <div className="relative h-screen w-full">
            <Overlay/>
            <InteractivePanel/>
        </div>

    )
}

export default Dashboard;