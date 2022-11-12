import { XIcon } from "@heroicons/react/solid"
import Image from "next/image"
import { useRecoilState } from "recoil"
import { cartState } from "../helpers/atoms"
import { ICartItem } from "../typings"
export default function CartItem({product,quantity,size,color}:ICartItem){
    const [cart, setCart] = useRecoilState(cartState)
    const handleDelete = ()=>{
        Object.keys(cart).forEach((key) => {
            if(cart[key as keyof typeof cart]["product"]["id"] === product.id && cart[key as keyof typeof cart]["size"] === size && cart[key as keyof typeof cart]["color"] === color){
                let newCart = {...cart}
                delete newCart[key as keyof typeof cart]
                if(Object.keys(newCart).length===0){
                    setCart({})
                    window.localStorage.removeItem('cart')
                }
                else{
                    setCart(newCart)
                    window.localStorage.setItem('cart',JSON.stringify(newCart))
                }
            }
        });
    }
    return(
        <div className="flex space-x-5 mb-5">
            <Image
            src={product.images ? product.images[0] : ""}
            alt="product"
            height={120}
            width={120}
            />
            <div className="relative flex flex-col justify-between py-7">
                <div className="flex space-x-5">
                    <h1>{product.name}</h1>
                    <h1>${(product.price/100).toFixed(2)}</h1>
                </div>
                
                <div className="flex space-x-5">
                    <p>Qty: {quantity}</p>
                    <p>Size: {size}</p>
                    <p>Color: {color}</p>
                </div>
                <XIcon className="h-4 w-4 absolute top-0 -right-0 text-[gray] hover:text-white cursor-pointer" onClick={handleDelete}/>
            </div>
            
        </div>
    )
}