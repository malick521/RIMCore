"use client";

import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "@/components/Common/Loader";



export default function ValidezTicket() {
    const [loading, setLoading] = useState(true);

    
  
 const verifyTicket = async (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!data.code) {
            toast.error("Veuillez saisir un code !");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/verify-ticket.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
                });

            const result = await res.json();

            if (!res.ok) {
            toast.error(result.message || "Verification echouée");
            setLoading(false);
            return;
            }

            toast.success("Ticket Verifié !");
            // router.push("/signin");
        } 
        
        catch (error) {
            toast.error("Erreur serveur");
        } 
        
        finally {
            setLoading(false);
        }
};
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">
               Validation des tickets
            </h1>

            <p className="mt-4 text-lg text-gray-600">
                Page dediee a la validation des tickets
            </p>

            <form onSubmit={verifyTicket}className="mt-15 p-5 min-w-3xl text-center bg-white rounded-lg shadow-2xl">
                <h2 className="text-3xl text-center mb-8">Validez Ticket</h2>
                <input className="w-full border border-neutral-950 p-4 rounded-lg mb-5" type="text" placeholder="Entrez Code" />
                <button className="cursor-pointer bg-black w-1/2 text-white p-3 rounded-full">Vérifier {loading && <Loader />}</button>
            </form>
        </div>
    );
}
