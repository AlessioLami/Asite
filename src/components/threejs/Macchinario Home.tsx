import BagOpener from "./BagOpener";
import Conveyor from "./Conveyor"
import Conveyor2 from "./Conveyor2"
import Conveyor3 from "./Conveyor3";
import Conveyor4 from "./Conveyor4";
import Conveyor5 from "./Conveyor5";
import Conveyor6 from "./Conveyor6";
import Conveyor7 from "./Conveyor7";
import Tramoggia1 from "./Tramoggia1";
import Tramoggia2 from "./Tramoggia2";
import Vaglio from "./Vaglio";

const HomeMacchinario = () => {
    return(
        <group>
            <Conveyor hasError={false}/>
            <Conveyor2 hasError={false}/>
            <Conveyor3 hasError={false}/>
            <Conveyor4 hasError={true}/>
            <Conveyor6 hasError={false}/>
            <Conveyor7  hasError={false}/>
            <BagOpener hasError={true}/>
            <Vaglio hasError={true}/>
            <Tramoggia1 hasError={false}/>
            <Tramoggia2 hasError={false}/>
        </group>
    )
}

export default HomeMacchinario