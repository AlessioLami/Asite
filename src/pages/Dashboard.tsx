import Sidebar from "../components/Sidebar.tsx";
import InteractivePanel from "../components/threejs/InteractivePanel.tsx";
const Dashboard = () => {

    return (
        <>
        {
            /*
            <div className="flex items-center justify-between">
                <Sidebar/>
                <Map/>
            </div>
            */
        }
        <Sidebar/>
        <InteractivePanel/>
        </>

    )
}

export default Dashboard;