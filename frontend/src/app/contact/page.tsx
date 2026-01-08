"use client"
import Link from "next/link"
export default function UserPage() {

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">Contact</h1>
            <p className="mt-4 text-lg text-gray-600">Contactez-nous via le boutton ci-dessous !</p>
              <Link
                    href='mailto:24009@supnum.mr'
                    className='mt-5 lg:block bg-primary text-white hover:bg-transparent hover:text-primary border border-primary px-12 py-5 rounded-full font-medium text-xl'
                        >
                    E-mail
              </Link>
        </div>
        </>
        
        
    );
}