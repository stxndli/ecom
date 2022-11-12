import { HeartIcon } from "@heroicons/react/outline";
import { CheckIcon } from "@heroicons/react/solid"
import Head from "next/head";
import Image from "next/image"
import Header from "../../components/Header";
import {db} from "../../firebase"
import {doc, getDoc} from "firebase/firestore"
import {Product} from "../../typings"
import Footer from "../../components/Footer";
import { useState } from "react";
import {useForm, SubmitHandler} from 'react-hook-form'
import { useRecoilState } from "recoil";
import { cartState } from "../../helpers/atoms";
import { Alert, Snackbar } from "@mui/material";
interface Props{
    product:Product,
}
type Inputs = {
    size: string,
    color: string,
    qty:string
  }
export default function ProductPage({product}:Props){
    const [cart, setCart] = useRecoilState(cartState)
    const [showSnack, setShowSnack] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async ({size,color,qty},event)=>{
        const cart = window.localStorage.getItem("cart")
        if(cart){
            let newCart = JSON.parse(cart)
            let count = Object.keys(newCart).length
            newCart[count] = {product:product,quantity:qty,size:size,color:color}
            window.localStorage.setItem("cart",JSON.stringify(newCart))
            setCart(newCart)
        }
        else{
            const newCart = {0:{product:product,quantity:qty,size:size,color:color}}
            window.localStorage.setItem("cart",JSON.stringify(newCart))
            setCart(newCart)
        }
        setShowSnack(true)
    }
    return(
        <div>
        <Head>
            <title>Ecom Project</title>
            <meta name="description" content="ecommerce project" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header/>
        <div className="grid grid-rows-2 lg:items-start min-h-screen lg:h-screen w-full py-6 space-x-10 space-y-5 lg:grid-cols-2">
            <div className="relative w-[90%] mx-10 lg:h-[30rem] bg-white transition duration-200 ease-out hover:scale-105">
                <Image
                    src={product.images ? product.images[0] : ""}
                    alt="product"
                    fill={true}
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-10">
                    <div className="flex space-x-5">
                        <h1 className="text-3xl">{product.name}</h1>
                        <h1 className="font-semibold truncate line-through text-lg text-[gray] pt-1.5">{product.sale>0 ? `$${(product.oldPrice/100).toFixed(2)}` : ""}</h1>
                        <h1 className="text-2xl self-end"><span className="text-[#FF731D] text-xl">$</span>{(product.price/100).toFixed(2)}</h1>
                    </div>
                    <p className="text-xl text-bold flex gap-x-2">In Stock <CheckIcon className="w-5 h-5 self-end"/></p>
                    <div className="space-y-3">
                        <p className="text-semibold text-xl">Size {errors.size && <p className="p-1 text-[13px] font-light text-orange-500">This field is required</p>}</p>
                        <div  className="flex space-x-10">
                            {product.sizes.map((size)=>(
                                <div key={size}><input className="radio" type="radio" value={size} {...register('size', {required:true})}/> <span className="text-xl">{size}</span></div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-semibold text-xl">Color {errors.color && <p className="p-1 text-[13px] font-light text-orange-500">This field is required</p>}</p>
                        <div  className="flex space-x-10">
                        {product.colors.map((color)=>(
                                <div key={color}><input className="radio" type="radio" value={color} {...register('color', {required:true})}/> <span className="text-xl">{color}</span></div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-x-2">
                        <p className="text-xl">Quantity:</p>
                        <input type="number" className="focus:outline-none rounded-md w-14 text-black px-2" {...register('qty', {required:true,min:"1"})}></input>
                        {errors.qty && <p className="p-1 text-[13px] font-light text-orange-500">This field is required</p>}
                    </div>
                    <div className="flex space-x-2">
                    <button className="bg-[#FF731D] hover:bg-[#FF731D]/80 rounded-md p-2 w-[80%] text-xl">Add to cart</button>
                    <button className="bg-[gray] hover:bg-[gray]/80 rounded-md p-2  items-center text-xl"><HeartIcon className="w-7 h-7"/></button>
                    </div>
                </div>
            </form>

        </div>
        
        <Snackbar open={showSnack} autoHideDuration={3000} onClose={()=>setShowSnack(false)}>
            <Alert onClose={()=>setShowSnack(false)} severity="success" sx={{ width: '100%' }}>
                Item added to your shopping cart
            </Alert>
        </Snackbar>
        <Footer/>
        </div>
    )

}
export async function getServerSideProps({params}:any){
  
    const document = await getDoc(doc(db, "products",params.id));
    const product = document.data()
    if(product && product.sale>0){
        product.oldPrice = product.price
        product.price = product.price-(product.price*(product.sale/100))
    }
    return{
      props:{
        product:product,
      }
    }
  }