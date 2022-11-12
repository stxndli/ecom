import Head from "next/head";
import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import Header from "../components/Header";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CardSection from "../components/CreditCard";
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import {useForm, SubmitHandler} from 'react-hook-form'
import Spinner from "../helpers/spinner";
import { cartState, modalState } from "../helpers/atoms";
import { useRecoilState } from "recoil"
import Modal from "../components/Modal";
import { useRouter } from "next/router";
const api = process.env.NEXT_PUBLIC_STRIPE
const stripePromise = loadStripe(api!);
type Inputs = {
    name: string,
    phone: string,
    shippingAddress:string
  }
export default function CartPage(){
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [totalAmount, setTotalAmount] = useState(0)
    const [cart, setCart] = useRecoilState(cartState)
    const router = useRouter()
    const checkout = async()=>{
        setLoading(true)
        const data = await fetch("/api/paymentIntent",{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({amount:totalAmount}),
          }).then((res)=>res.json())
        setClientSecret(data.clientSecret)
        setLoading(false)
    }
    useEffect(()=>{
        let total = 0
        for(const e in cart){
            total += cart[e as keyof typeof cart]["product"]["price"]*cart[e as keyof typeof cart]["quantity"]
        }
        setTotalAmount(total)
    },[cart])
    return(
        <div>
            <Head>
            <title>Ecom Project</title>
            <meta name="description" content="ecommerce project" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header/>
            <h1 className="text-3xl ml-12 mb-12">Your Cart</h1>
            <div className="flex flex-col lg:grid lg:grid-cols-2 pl-5 md:pl-12 lg:ml-[5%] space-y-5 items-center">
                <div>
                    {
                        Object.keys(cart).length>0 ? Object.keys(cart).map((key,i)=>(
                            <CartItem key={i} product={cart[key as keyof typeof cart]["product"]} quantity={cart[key as keyof typeof cart]["quantity"]} size={cart[key as keyof typeof cart]["size"]} color={cart[key as keyof typeof cart]["color"]}/>
    
                        )
                        
                        )
                        : <h1 className="text-lg mb-10">Your cart is empty. <span className="text-[#FF731D] hover:underline text-md cursor-pointer" onClick={()=>router.push("/")}>Go back</span></h1>
                    }
                    <h1 className="text-xl space-x-5"><span>Total:</span> <span>${(totalAmount/100).toFixed(2)}</span></h1>
                </div>
                    {!clientSecret &&
                        <div className="lg:self-start">
                            <div className="mt-5"></div>
                            <button className={`p-2 bg-[#FF731D] ${Object.keys(cart).length===0 && "opacity-80"} rounded-md w-full lg:w-[50%] lg:ml-[20%] text-xl text-white font-semibold ${loading && "flex justify-center"}`} onClick={checkout} disabled={Object.keys(cart).length===0}>{!loading ? "Proceed to checkout" : <Spinner/>}</button>
                        </div>
                    }
                    <div className={`transition-all duration-150 ${!clientSecret && "translate-x-[200%] hidden"}`}><Elements stripe={stripePromise}>
                            <Checkout clientSecret={clientSecret!}/>
                    </Elements></div>
            </div>
        </div>
    )
}
interface Props{
    clientSecret:string
}
const Checkout = ({clientSecret}:Props)=>{
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useRecoilState(modalState)
    const [success, setSuccess] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async ({name,phone,shippingAddress},event)=>{
        setLoading(true)
        event!.preventDefault();

        if (!stripe || !elements) return

        const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
            name: name,
            phone: phone,
            },
        }
        });

        if (result.error) {
            setSuccess(false)
            setShowModal(true)
        } else {
        if (result.paymentIntent.status === 'succeeded') {
            setSuccess(true)
            setShowModal(true)
        }
        }
        setLoading(false)
};

  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label>Full Name{errors.name && <p className="p-1 text-[13px] font-light text-orange-500">This field is required</p>}</label><input type="text" className="checkoutInput" placeholder="Full Name" {...register('name', {required:true})}/>
        <label>Phone Number{errors.phone && <p className="p-1 text-[13px] font-light text-orange-500">This field is required</p>}</label><input type="number" className="checkoutInput" placeholder="Phone Number" {...register('phone', {required:true})}/>
        <label>Shipping Address{errors.name && <p className="p-1 text-[13px] font-light text-orange-500">This field is required</p>}</label><input type="text" className="checkoutInput" placeholder="Shipping Address" {...register('shippingAddress', {required:true})}/>
        <CardSection />
        <button className={`p-2 bg-[#FF731D] rounded-md w-[30%] ml-[20%] text-lg mt-10 ${loading || !stripe ? "flex justify-center":""}`}>{loading || !stripe ? <Spinner/> : "Confirm order"}</button>
        </form>
        <Modal success={success}/>
    </div>
    );
}