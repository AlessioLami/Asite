import { useSelector } from "react-redux";
import Map from "../components/Map"
import type { RootState } from "../store";
import Sidebar from "../components/Sidebar";
const Dashboard = () => {

    console.log(useSelector((state: RootState) => state.auth.user))
    console.log(useSelector((state: RootState) => state.auth.role))

    return (
        <div className="flex items-center justify-between h-screen w-full gap-10">
            <Sidebar/>
            <Map/>
        </div>
    )
}

export default Dashboard;