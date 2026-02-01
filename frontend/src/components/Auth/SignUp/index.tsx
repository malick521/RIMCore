"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "@/components/Common/Loader";
const SignUp = () => {
    const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!data.nni || !data.nom || !data.prenom || !data.email || !data.password) {
            toast.error("Tous les champs sont obligatoires");
            setLoading(false);
            return;
        }

        if((data.nni as string).length < 10 || (data.nni as string).length > 10) {
            toast.error("Le NNI doit contenir 10 chiffres");
            setLoading(false);
            return; // Stop le submit si erreur
        }

        try {
            const res = await fetch("http://localhost:8000/api/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
                });

            const result = await res.json();

            if (!res.ok) {
            toast.error(result.message || "Inscription refusée");
            setLoading(false);
            return;
            }

            toast.success("Compte créé avec succès !");
            //router.push("/signin");
        } 
        
        catch (error) {
            console.error("FETCH ERROR :", error);
            toast.error("Erreur serveur");
        } 
        
        finally {
            setLoading(false);
        }
};


    return (
        <>
            <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
                <h2 className="text-3xl font-semibold text-white">Inscription</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-[22px]">
                    <input
                        type="text"
                        placeholder="NNI"
                        name="nni"
                        className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
                    />
                </div>
                 <div className="mb-[22px]">
                    <input
                        type="text"
                        placeholder="Prenom"
                        name="prenom"
                        className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mb-[22px]">
                    <input
                        type="text"
                        placeholder="Nom"
                        name="nom"
                        className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
                    />
                </div> 
                <div className="mb-[22px]">
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mb-[22px]">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mb-9">
                    <button
                        type="submit"
                        className="text-white cursor-pointer flex w-full items-center text-18 font-medium justify-center rounded-md bg-primary px-5 py-3 text-darkmode transition duration-300 ease-in-out hover:bg-transparent hover:text-primary border-primary border "
                    >
                        S'inscrire {loading && <Loader />}
                    </button>
                </div>
            </form>
            <p className="text-body-secondary mb-4 text-white text-base">
                En créant un compte, vous acceptez notre{" "}
                <a href="#!" className="text-primary hover:underline">
                    Politique 
                </a>
                de
                <a href="#!" className="text-primary hover:underline">
                    confidentialité.
                </a>
            </p>

            <p className="text-body-secondary text-white text-base">
                Vous avez déjà un compte?
                <Link href="/" scroll={false} className="pl-2 text-primary hover:underline">
                   Connectez-vous
                </Link>
            </p>
        </>
    );
};

export default SignUp;
