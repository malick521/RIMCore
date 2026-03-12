"use client";

import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'; 
import Loader from "@/components/Common/Loader";
import { CircleCheckIcon } from "lucide-react";



export default function ValidezTicket() {
    const [loading, setLoading] = useState(true);

    
  
 const verifyTicket = async (e: React.FormEvent<HTMLFormElement>) => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!data.numero_ticket) {
            toast.error("Veuillez saisir un code !");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8000/api/verify-ticket.php?id_employe=${user.id}`, {
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

            toast.success(result.message);
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
        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50">
    
            <div className="text-center max-w-xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    Validation des tickets
                </h1>

                <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">
                    Entrez le numéro pour verifier sa validité
                </p>
            </div>

            <form 
                onSubmit={verifyTicket}
                className="mt-8 sm:mt-10 w-full max-w-md bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-xl"
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
                    Saisissez le numéro
                </h2>

                <input
                    className="w-full border border-gray-300 p-3 sm:p-4 rounded-lg text-base sm:text-lg mb-5 outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                    name="numero_ticket" 
                    type="text"
                    placeholder="Entrez le code du ticket"
                />

                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full sm:w-2/3 mx-auto bg-black text-white py-3 rounded-full hover:bg-gray-900 active:scale-95 transition"
                >
                    <CircleCheckIcon className="h-5 w-5" />
                    Vérifier
                </button>
            </form>

        </div>
    );
}
