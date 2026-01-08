"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";

const Signin = () => {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        checkboxToggle: false,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();


const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (!data.email || !data.password) {
        toast.error("Tous les champs sont obligatoires");
        setLoading(false);
        return;
    }

    try {
            const res = await fetch("http://localhost:8000/api/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Connexion refusée");
                setLoading(false);
                return;
            }

            toast.success("Connexion réussie !");
            const userId = result.id_admin || result.id_etudiant || result.id_employe;
            localStorage.setItem("user", JSON.stringify({id:userId, nom: result.nom, prenom: result.prenom, email: result.email, role:result.role}));
            router.push(`/utilisateur?nom=${encodeURIComponent(result.nom)}&prenom=${encodeURIComponent(result.prenom)}`);
            window.location.reload();
        } catch (error) {
            toast.error("Erreur serveur");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
                <h2 className="text-3xl font-semibold text-white">Connexion</h2>
            </div>
            <form onSubmit={handleLoginSubmit}>
                <div className="mb-[22px]">
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) =>
                            setLoginData({ ...loginData, email: e.target.value })
                        }
                        className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mb-[22px]">
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        name="password"
                        onChange={(e) =>
                            setLoginData({ ...loginData, password: e.target.value })
                        }
                        className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mb-9">
                    <button
                        type="submit"
                        className="bg-primary text-white w-full py-3 rounded-lg text-18 font-medium border border-primary hover:text-white hover:bg-transparent cursor-pointer"
                    >
                        Connexion {loading && <Loader />}
                    </button>
                </div>
            </form>

            <Link
                href= '/'
                scroll={false}
                className="mb-2 inline-block text-base text-dark hover:text-primary text-white dark:hover:text-primary"
            >
                Mot de passe oublié ?
            </Link>
            <p className="text-body-secondary text-white text-base">
                Pas de compte?{" "}
                <Link href="/" className="text-primary hover:underline">
                    Inscription
                </Link>
            </p>
        </>
    );
};

export default Signin;