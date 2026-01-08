"use client";

import { useSearchParams } from "next/navigation"
import Image from "next/image"
import CardBox from "../../components/Home/shared/CardBox"
import { useState, useEffect } from "react";
const UserProfile = () => {
   
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setNom(parsedUser.nom || "");
            setPrenom(parsedUser.prenom || "");
            setEmail(parsedUser.email || "");
        }
    }, []);

  


    return (
        <>
            <div className="flex flex-col gap-6 mt-30">
                <CardBox className="p-6 bg-background overflow-hidden border-none rounded-xl shadow-xs">
                    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl relative w-full words-break">
                        <div>
                            <Image src={"/images2/profile/user-1.jpg"} alt="image" width={80} height={80} className="rounded-full" />
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center w-full">
                            <div className="flex flex-col sm:text-left text-center gap-1.5">
                                <h5 className="card-title">{prenom} {nom}</h5>
                            </div>
                        </div>
                    </div>
                </CardBox>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-6 rounded-xl shadow-xs bg-background md:p-6 p-4 relative w-full words-break">
                        <h5 className="card-title">Informations Personnelles</h5>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div><p className="text-xs text-gray-500">Prenom</p><p>{prenom}</p></div>
                            <div><p className="text-xs text-gray-500">Nom</p><p>{nom}</p></div>
                            <div><p className="text-xs text-gray-500">Email</p><p>{email}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
