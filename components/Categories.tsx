import { useRouter } from "next/router"
import { Category } from "../typings"
interface Props{
    categories:Category[]
}
export default function Categories({categories}:Props){
    const router = useRouter()
    return(
        <div className="bg-[#181818]">
            <ul className="space-x-4 flex items-center justify-between p-6">
                {
                    categories.map((cat)=>(
                        <li key={cat.id} className="hover:text-[#FF731D] cursor-pointer" onClick={()=>router.push(`/category/${cat.id}`)}>{cat.title}</li>
                    ))
                }
            </ul>
        </div>
    )
}