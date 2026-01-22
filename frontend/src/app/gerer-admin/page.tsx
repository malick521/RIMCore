"use client";
import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "@/components/Common/Loader";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button";

type Admin = {
    id_admin: number;
    prenom: string;
    nom: string;
    role: string;
    email:string;
    date_ajout: string;
};



export default function TableEmployes() {
    const [admins, setAdmin] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<"personal" | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!data.nom || !data.prenom || !data.email || !data.password) {
            toast.error("Tous les champs sont obligatoires");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/register-admin.php", {
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
            // router.push("/signin");
        } 
        
        catch (error) {
            toast.error("Erreur serveur");
        } 
        
        finally {
            setLoading(false);
        }
};


    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);

        fetch(`http://localhost:8000/api/voir-admin.php?id_admin=${user.id}`)
            .then(res => res.json())
            .then(data => {
                setAdmin(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

// Lorsque le modal s'ouvre, on charge les données actuelles dans le formulaire

   if (loading) return (<div className="flex justify-center items-center min-h-screen font-bold text-3xl">Chargement...</div>);
    if (admins.length === 0) return <div className="flex justify-center items-center min-h-screen font-bold text-3xl">Aucun Admin pour le moment.</div>;

    return (
        <>
        <div className="min-h-screen m-30">
        <h1 className="text-3xl text-center font-semibold mb-7">Gestion des Administrateurs : </h1>
         <Button onClick={() => { setModalType("personal"); setOpenModal(true); }} className="flex items-center bg-primary gap-1.5 shadow-lg rounded-lg p-3 mb-10">
                                        Ajoutez un admin
        </Button>
        <div className="relative overflow-x-auto bg-neutral-primary-soft rounded-lg shadow-2xl border border-default">
            <div className="p-4 flex items-center justify-between space-x-4">
                <label htmlFor="input-group-1" className="sr-only">Rechercher</label>
                <div className="flex flex-row justify-between relative ">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="text" id="input-group-1" className="block w-full max-w-96 ps-9 pe-3 py-2 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Rechercher" />
                </div>
            </div>

            <table className="w-full text-sm text-left text-body">
                <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input id="table-checkbox" type="checkbox" className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft" />
                                <label htmlFor="table-checkbox" className="sr-only">Table checkbox</label>
                            </div>
                        </th>
                        <th className="px-6 py-3 font-semibold">ID</th>
                        <th className="px-6 py-3 font-semibold">Prénom</th>
                        <th className="px-6 py-3 font-semibold">Nom</th>
                        <th className="px-6 py-3 font-semibold">Email</th>
                        <th className="px-6 py-3 font-semibold">Role</th>
                        <th className="px-6 py-3 font-semibold">Date Ajout</th>
                        <th className="px-6 py-3 font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin) => (
                        <tr key={admin.id_admin} className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium">
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <input type="checkbox" className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft" />
                                </div>
                            </td>
                            <td className="px-6 py-4">{admin.id_admin}</td>
                            <td className="px-6 py-4">{admin.nom}</td>
                            <td className="px-6 py-4">{admin.prenom}</td>
                            <td className="px-6 py-4">{admin.email}</td>
                            <td className="px-6 py-4">{admin.role}</td>
                            <td className="px-6 py-4">{admin.date_ajout}</td>
                            <td className="flex items-center px-6 py-4 space-x-3">
                                <a href="#" className="font-medium text-fg-brand hover:underline">Modifier</a>
                                <a href="#" className="font-medium text-danger hover:underline">Supprimer</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>





    <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle className="mb-4">
                {modalType === "personal" ? "Inscription " : "Not important"}
            </DialogTitle>
            </DialogHeader>

    {modalType === "personal" ? (
            <>
                <form onSubmit={handleSubmit }>
                    <h2 className="text-2xl text-center font-semibold mb-5">Créer votre compte </h2>
                    <input type="text" className="w-full mb-3 border border-gray-950 p-2 rounded-lg" name="prenom" placeholder="Prénom" />
                    <input type="text" className="w-full mb-3 border border-gray-950 p-2 rounded-lg" name="nom" placeholder="Nom" />
                    <input type="email" className="w-full mb-3 border border-gray-950 p-2 rounded-lg" name="email" placeholder="Email" />
                    <input type="password" className="w-full mb-3 border border-gray-950 p-2 rounded-lg" name="password" placeholder="Mot de passe" />
                    <button className="cursor-pointer bg-primary text-white p-3 rounded-lg">S'inscrire {loading && <Loader />}</button>
                </form> 
                 <p className="text-body-secondary mt-7 mb-4 text-black text-base">
                        En créant un compte, vous acceptez notre{" "}
                        <a href="#!" className="text-primary hover:underline">
                            Politique {" "}
                        </a>
                        de{" "}
                        <a href="#!" className="text-primary hover:underline">
                            confidentialité.
                        </a>
                  </p>        
            </>

    ) : (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
       
      </div>
    )}

    <DialogFooter className="flex gap-2 mt-4">
      <Button
        color="lighterror"
        className="rounded-md bg-lighterror dark:bg-darkerror text-error hover:bg-error hover:text-white"
        onClick={() => setOpenModal(false)}
      >
        Fermer
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
    );
}
