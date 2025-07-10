import BagOpener from "./BagOpener";
import Conveyor from "./Conveyor"
import Conveyor2 from "./Conveyor2"
import Conveyor3 from "./Conveyor3";
import Conveyor4 from "./Conveyor4";

export type ErrorProps = {
    hasError: boolean;
}

const Macchinario = () => {

    return(
        <group>
            <Conveyor hasError={false}/>
            <Conveyor2 hasError={false}/>
            <Conveyor3 hasError={false}/>
            <Conveyor4 hasError={false}/>
            <BagOpener hasError={false}/>
        </group>
    )
}

export default Macchinario