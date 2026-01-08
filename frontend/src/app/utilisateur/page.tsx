"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserPage() {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setNom(parsedUser.nom || "");
            setPrenom(parsedUser.prenom || "");
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">
                Bienvenue, {prenom} {nom} !
            </h1>

            <p className="mt-4 text-lg text-gray-600">
                Vous êtes connecté à votre espace utilisateur.
            </p>
        </div>
    );
}
