import { FiLogOut } from "react-icons/fi"

const Overlay = () => {
    return(
        <div className="absolute pointer-events-none  w-full h-screen flex items-start z-100">
            <div className="flex flex-col justify-center gap-10 p-5 my-2 pointer-events-auto">
                <h1 className="text-5xl font-bold max-w-[300px] text-white">SELEZIONE RIFIUTI URBANI</h1>
                <div className="w-full">
                    <h1 className="text-4xl font-bold text-white">STATO</h1>
                    <h1 className="text-4xl font-bold text-white">ERRORI</h1>
                </div>
                <div className="flex items-center justify-start w-full bg-black p-3 rounded-xl">
                    <h1 className="font-bold p-2 rounded-xl bg-white">WI</h1>
                    <div className="font-bold text-white px-3">
                        <h1>user@gmail.com</h1>
                        <h1>Role: ADMIN</h1>
                    </div>
                    <button className="bg-white p-4 rounded-xl"><FiLogOut/></button>
                </div>
            </div>
            <div className="w-full h-screen flex flex-col justify-between p-5 py-8">
               <div className="bg-black rounded-xl h-screen max-h-[50px] w-full flex justify-center items-center">
               <h1 className="text-2xl font-bold text-white">GIOVEDI 10/07/2025 15:18</h1>
                </div> 
                <div className="bg-black rounded-xl h-screen max-h-[50px] w-full flex justify-center items-center">
                    <h1 className="text-2xl font-bold text-white">AsiteSens</h1>
                </div>
            </div>
            <div className="max-w-[300px] w-full p-5 my-2 pointer-events-auto">
                <h1 className="text-4xl font-bold text-white">LISTA ERRORI</h1>
            </div>
        </div>
    )
}

export default Overlay