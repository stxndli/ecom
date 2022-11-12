import Image from "next/image";
import Link from "next/link";

export default function Footer(){
    return(
        <div className="flex flex-col mt-10 space-y-1 items-center justify-center w-full h-24 bg-[#242424]">
            <Link href="https://github.com/stxndli/next-ecom">
            <Image
                src="/github.png"
                alt="Github"
                height={32}
                width={32}
                className="cursor-pointer bg-white rounded-full"
            />
            </Link>
        </div>
    )
}