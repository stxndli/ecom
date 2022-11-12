import Image from "next/image";
import { useRouter } from "next/router";
import {Product} from "../typings"
interface Props{
    product:Product
}
export function Card({product}:Props){
    const router = useRouter()
    return(
        
            <div className="h-[28rem] min-w-[260px] max-w-[400px] w-full cursor-pointer bg-[#242424] rounded-md space-y-5 justify-self-center" onClick={()=>router.push(`/product/${product.id}`)}>
            <div className="relative h-[65%] m-1">
                <Image
                    src={product.images ? product.images[0] : ""}
                    alt="product"
                    fill={true}
                />
            </div>
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between px-2">
                    <h1 className="font-semibold truncate text-md hover:underline">{product.name}</h1>
                    <h1 className="text-[#FF731D] text-lg">{product.sale>0 ? `${product.sale}% OFF` : ""}</h1>
                </div>
                <div className="flex">
                <h1 className="font-semibold px-2 truncate text-lg"><span className="text-[#FF731D]">$</span>{product.sale>0 ? `${((product.price/100)-(product.price/100)*(product.sale/100)).toFixed(2)}` : `${product.price/100}`}</h1>
                <h1 className="font-semibold truncate line-through text-sm text-[gray] pt-1.5">{product.sale>0 ? `$${product.price/100}` : ""}</h1>
                </div>
                <h1 className="truncate text-md hover:underline pl-2">Available in <span className="font-semibold">{product.colors.length}</span> colors & <span className="font-semibold">{product.sizes.length}</span>  sizes</h1>
            </div>
        </div>
    )
}