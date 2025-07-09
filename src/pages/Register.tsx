import { useState } from 'react';
import { useRegisterMutation } from '../services/apis/authApi';
import { Toaster, toast} from 'sonner';

const Register = () => {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");
    const [register] = useRegisterMutation();

    const handleRegister = async (e: any) => {
        e.preventDefault();

        try{
            const res = await register({email: email, password: password, passwordVerify: passwordVerify})
            if(res.error?.data.message != undefined){
                toast.error(res.error?.data.message)
            }else{
                toast.success("Ti sei registrato correttamente!")
                //cleanup
                setName("");
                setSurname("");           
                setEmail("");
                setPassword("");
                setPasswordVerify("");
            }
        }catch(error){
           console.log(error) 
        }
    }

    return (
        <div>
            <Toaster position='top-center'richColors/>
            <div className="flex items-center justify-around h-screen">
                <form onSubmit={handleRegister} className="w-[400px] flex flex-col items-center justify-center text-center gap-5 p-10 border-2 rounded-lg">
                    <h1 className="w-full text-4xl font-bold">REGISTRATI</h1>
                    <input onChange={(e) => setName(e.target.value)} className="w-full p-2 rounded-lg bg-gray-200 font-semibold text-black" type="text" placeholder="Nome" required />
                    <input onChange={(e) => setSurname(e.target.value)} className="w-full p-2 rounded-lg bg-gray-200 font-semibold text-black" type="text" placeholder="Cognome" required />
                    <input onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded-lg bg-gray-200 font-semibold text-black" type="text" placeholder="Email" required />
                    <input onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded-lg bg-gray-200 font-semibold text-black" type="password" placeholder="Password" required />
                    <input onChange={(e) => setPasswordVerify(e.target.value)} className='w-full p-2 rounded-lg bg-gray-200 font-semibold text-black' type='password' placeholder='Ripeti password' required/>
                    <div className="flex flex-col gap-3 items-center justify-between w-full">
                        <button className="hover:bg-black/75 cursor-pointer p-2 rounded-lg bg-black font-semibold text-white w-full" type="submit">REGISTRATI</button>
                        <p>Hai già un'account? <a className="text-blue-500 hover:underline" href="/login">Accedi</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register