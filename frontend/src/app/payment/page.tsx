"use client"; // OBLIGATOIRE pour utiliser useSearchParams côté client

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";

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
        <div className="flex flex-col mt-30 items-center justify-center h-screen px-4">
            <h1 className="text-3xl font-bold mb-4">Paiement</h1>

            {method ? (
                <>    <p className="text-lg ">
                        Moyen de paiement sélectionné :{" "}
                        <span className="font-semibold text-primary">
                            {method.toUpperCase()}
                        </span>
                    </p>

                   <form onSubmit={handlePayment} className="w-full max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
                        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                            Finalisez l'achat
                        </h2>

                        {/* Prix (disabled) */}
                        <div className="mb-4">
                            <label htmlFor="prix" className="block text-gray-700 font-medium mb-1">
                            Montant
                            </label>
                            <input
                             type="text"
                            id="prix"
                            placeholder="5 MRU"
                            disabled
                            className="w-full p-3 rounded-lg border border-blue-700 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            
                            />
                        </div>

                        {/* Numéro */}
                        <div className="mb-4">
                            <label htmlFor="number" className="block text-gray-700 font-medium mb-1">
                            Numéro
                            </label>
                            <input
                             onChange={(e) =>
                            setPaymentData({ ...paymentData, numero: e.target.value })
                        }
                           
                            type="number"
                            id="number"
                            name="numero"
                            placeholder="Entrez votre numéro"
                            className="w-full p-3 rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Code secret */}
                        <div className="mb-6">
                            <label htmlFor="code" className="block text-gray-700 font-medium mb-1">
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
                            className="w-full p-3 rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Bouton */}
                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Acheter {loading && <Loader />}
                        </button>
                    </form>

                </>
            ) : (
                <p className="text-red-500">Aucun moyen de paiement sélectionné</p>
            )}
        </div>
    );
}
