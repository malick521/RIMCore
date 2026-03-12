"use client"; // OBLIGATOIRE pour utiliser useSearchParams côté client

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ArrowDownTrayIcon, CreditCardIcon } from '@heroicons/react/24/solid'; 
import Loader from "@/components/Common/Loader";
import { CurrencyIcon } from "lucide-react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function PaymentPage() {
    const [paymentData, setPaymentData] = useState({
            numero: "",
            code: "",
            checkboxToggle: false,
        });

    const searchParams = useSearchParams();
    const router = useRouter();
    const method = searchParams.get("method");
    
    const [loading, setLoading] = useState(false);

    // Rediriger si aucune méthode n'est choisie
    useEffect(() => {
        if (!method) {
            router.push("/acheter-tickets");
        }
    }, [method, router]);


    const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Vérification des champs
    if (!data.numero || !data.code) {
        toast.error("Tous les champs sont obligatoires");
        setLoading(false);
        return;
    }

    // Récupérer l'ID de l'utilisateur depuis localStorage
    // Récupérer l'objet utilisateur depuis localStorage
const userStr = localStorage.getItem("user");
if (!userStr) {
    toast.error("Utilisateur non identifié");
    setLoading(false);
    return;
}

        // Parser l'objet JSON
        const user = JSON.parse(userStr);
        const userId = user.id;

        if (!userId) {
            toast.error("Utilisateur non identifié");
            setLoading(false);
            return;
        }

        // Ajouter l'ID au payload
        const payload = {
            ...data,
            method,
            userId, // maintenant ça fonctionne
        };


    try {
        const res = await fetch("http://localhost:8000/api/paiement.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload), // on envoie le payload avec userId
        });

        const result = await res.json();

        if (!res.ok) {
            toast.error(result.message || "Achat refusé");
            setLoading(false);
            return;
        }

        toast.success("Achat réussi !");
    } catch (error) {
        toast.error("Erreur serveur");
    } finally {
        setLoading(false);
    }
};



    return (
       <div className="min-h-screen mt-30 mb-30 flex flex-col items-center justify-center px-4 py-10 bg-gray-50">

    <h1 className="text-2xl sm:text-3xl font-bold mb-6">Paiement</h1>

    {method ? (
        <>
            <p className="text-sm sm:text-base text-gray-700 mb-6 text-center">
                Moyen de paiement sélectionné :{" "}
                <span className="font-semibold text-primary">
                    {method.toUpperCase()}
                </span>
            </p>

            <form
                onSubmit={handlePayment}
                className="w-full max-w-md bg-white p-6 sm:p-7 rounded-xl shadow-lg"
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-gray-800">
                    Finalisez l'achat
                </h2>

                {/* Montant */}
                <div className="mb-4">
                    <label
                        htmlFor="prix"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Montant
                    </label>

                    <input
                        type="text"
                        id="prix"
                        value="5 MRU"
                        disabled
                        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700"
                    />
                </div>

                {/* Numéro */}
                <div className="mb-4">
                    <label
                        htmlFor="number"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Numéro
                    </label>

                    <input
                        onChange={(e) =>
                            setPaymentData({ ...paymentData, numero: e.target.value })
                        }
                        type="tel"
                        id="number"
                        name="numero"
                        placeholder="Entrez votre numéro"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Code secret */}
                <div className="mb-6">
                    <label
                        htmlFor="code"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Code secret
                    </label>

                    <input
                        onChange={(e) =>
                            setPaymentData({ ...paymentData, code: e.target.value })
                        }
                        type="password"
                        id="code"
                        name="code"
                        placeholder="Entrez votre code secret"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Bouton */}
                <button
                    type="submit"
                    className="cursor-pointer flex items-center justify-center gap-2 w-full sm:w-2/3 mx-auto bg-black text-white py-3 rounded-full hover:bg-gray-900 active:scale-95 transition"
                >
                    <CreditCardIcon className="h-5 w-5" />
                    Acheter
                </button>
            </form>
        </>
    ) : (
        <p className="text-red-500">Aucun moyen de paiement sélectionné</p>
    )}
</div>
    );
}
