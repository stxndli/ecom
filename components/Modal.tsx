import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid"
import MuiModal from "@mui/material/Modal"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"
import {modalState} from "../helpers/atoms"
interface Props{
    success:boolean
}
export default function Modal({success}:Props){
    const router = useRouter()
    const [show, setShow] = useRecoilState(modalState)
    return(
        <MuiModal open={show} onClose={()=>setShow(false)} className="fixed mx-auto my-auto w-[60%] h-[50%]  z-50 ">
            <div className="flex flex-col items-center justify-center rounded-md bg-[white] w-full h-full space-y-5">
                <h1 className="text-3xl text-black">{success ? "Payment Successful" : "Payment Failed"}</h1>
                {success ? <CheckCircleIcon className="h-12 w-12 text-green-500"/> : <XCircleIcon className="h-12 w-12 text-red-500"/>}
                <p className="text-lg text-black">{success ? "Thank you ! your order was completed and will be delivered soon" : "An error was encountred while processing your payment, Please try again later"}</p>
                <button className="w-36 rounded-md p-2 bg-[#FF731D]" onClick={()=>{router.push("/");setShow(false)}}>Continue</button>
            </div>
        </MuiModal>
    )
}