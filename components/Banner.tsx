import Image from "next/image";
import { useRouter } from "next/router";
import { Category } from "../typings";
export default function Banner({id,title,image}:Category){
    const router = useRouter()
    return(
        <div className="flex justify-between relative mb-10  w-[400px] cursor-pointer h-[35rem] opacity-90 hover:opacity-100 transition-all duration-100 hover:scale-110" onClick={()=>router.push(`/category/${id}`)}>
            <Image
            className="absolute -z-10"
            src={image}
            alt=""
            fill={true}
            />
            <div className="absolute bottom-0 top-2/3 left-0 right-0  bg-black/30 grid items-center justify-center">
                <h1 className="text-4xl">{title}</h1>
            </div>
        </div>
    )
}