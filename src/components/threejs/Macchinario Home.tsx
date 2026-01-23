import BagOpener from "./BagOpener";
import Conveyor from "./Conveyor"
import Conveyor2 from "./Conveyor2"
import Conveyor3 from "./Conveyor3";
import Conveyor4 from "./Conveyor4";
import Conveyor6 from "./Conveyor6";
import Conveyor7 from "./Conveyor7";
import Tramoggia1 from "./Tramoggia1";
import Tramoggia2 from "./Tramoggia2";
import Vaglio from "./Vaglio";

const HomeMacchinario = () => {
    return(
        <group>
            <Conveyor hasError={false} hasWarning={false}/>
            <Conveyor2 hasError={false} hasWarning={false}/>
            <Conveyor3 hasError={false} hasWarning={false}/>
            <Conveyor4 hasError={true} hasWarning={false}/>
            <Conveyor6 hasError={false} hasWarning={false}/>
            <Conveyor7 hasError={false} hasWarning={false}/>
            <BagOpener hasError={true} hasWarning={false}/>
            <Vaglio hasError={true} hasWarning={false}/>
            <Tramoggia1 hasError={false} hasWarning={false}/>
            <Tramoggia2 hasError={false} hasWarning={false}/>
        </group>
    )
}

export default HomeMacchinario