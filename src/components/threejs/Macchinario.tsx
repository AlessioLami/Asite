import BagOpener from "./BagOpener";
import Conveyor from "./Conveyor"
import Conveyor2 from "./Conveyor2"
import Conveyor3 from "./Conveyor3";
import Conveyor4 from "./Conveyor4";
import Vaglio from "./Vaglio";

export type ErrorProps = {
    hasError: boolean;
}


const Macchinario = () => {

    return(
        <group>
            <Conveyor hasError={false}/>
            <Conveyor2 hasError={true}/>
            <Conveyor3 hasError={true}/>
            <Conveyor4 hasError={false}/>
            <BagOpener hasError={false}/>
            <Vaglio hasError={true}/>
        </group>
    )
}

export default Macchinario