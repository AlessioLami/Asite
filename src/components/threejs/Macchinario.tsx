import BagOpener from "./BagOpener";
import Conveyor from "./Conveyor"
import Conveyor2 from "./Conveyor2"
import Conveyor3 from "./Conveyor3";
import Conveyor4 from "./Conveyor4";

export type ErrorProps = {
    hasError: boolean;
}

//test

const Macchinario = () => {

    return(
        <group>
            <Conveyor hasError={false}/>
            <Conveyor2 hasError={false}/>
            <Conveyor3 hasError={true}/>
            <Conveyor4 hasError={false}/>
            <BagOpener hasError={true}/>
        </group>
    )
}

export default Macchinario