import {SearchIcon, ShoppingCartIcon} from "@heroicons/react/outline"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { XIcon } from "@heroicons/react/solid"
import { useRecoilState } from "recoil"
import { cartState } from "../helpers/atoms"
import { SubmitHandler, useForm } from "react-hook-form"
type Inputs = {
    query:string
}
export default function Header(){
    const [isScrolled, setIsScrolled] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [cartItemsCount, setCartItemsCount] = useState(0)
    const [cart, setCart] = useRecoilState(cartState)
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async ({query},event)=>{
        router.push(`/search?q=${query}`)
    }
    useEffect(()=>{
        const handleScroll = ()=>{
            if(window.scrollY > 0){
                setIsScrolled(true)
            }
            else{
                setIsScrolled(false)
            }
        }
        window.addEventListener("scroll", handleScroll)
        setCart(JSON.parse(window.localStorage.getItem("cart") || "{}"))
        return ()=>{
            window.removeEventListener("scroll", handleScroll)
        }
    },[])
    useEffect(()=>{
        setCartItemsCount(Object.keys(cart).length)
    },[cart])
    return(
        <div>
            <header className={`${isScrolled && "bg-[#141414]"}`}>
            <h1 className={`${showSearch ? "hidden":"flex"} md:flex font-[Satisfy] text-3xl cursor-pointer`} onClick={()=>router.push("/")}>Fashion</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={`${showSearch ? "flex w-full" : "hidden"} md:flex md:w-[50%] justify-center`}>
                <input className="rounded-l-md !outline-none text-black pl-5 w-full" placeholder="Search ..." {...register('query')}/>
                <button className="bg-[#FF731D] rounded-r-md p-1"><SearchIcon className="h-7 w-7"/></button>
            </form>
            <div className="flex space-x-5">
                <div className={`${showSearch ? "hidden":"flex"} md:flex relative h-7 w-7 cursor-pointer`} onClick={()=>router.push("/cart")}>
                    <ShoppingCartIcon className="hover:text-[#FF731D]"/>
                    {cartItemsCount>0 && <span className="absolute flex items-center justify-center -top-4 -right-2 bg-[#FF731D] rounded-full p-0.5 w-5 h-5 font-semibold">{cartItemsCount}</span>}
                </div>
                {showSearch ? <XIcon className="flex w-7 h-7 md:hidden cursor-pointer hover:text-[#FF731D]" onClick={()=>setShowSearch(!showSearch)}/> : <SearchIcon className="flex w-7 h-7 md:hidden cursor-pointer hover:text-[#FF731D]" onClick={()=>setShowSearch(!showSearch)}/>}
            </div>
        </header>
        <div className="mt-20"></div>
        </div>
    )
}