"use client";

import {useState, useEffect} from 'react'

type Paiement = { 
id_transaction: number;
id_ticket: number;
montant: number;
date_paiement :string;
moyen_paiement: string;
statut: string;

};

export default function VoirPaiement() {
  

    const [paiements, setPaiement] = useState<Paiement[]>([]);
    const [loading, setLoading] = useState(true);

        useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);

        fetch(`http://localhost:8000/api/voir-paiements.php?id_admin=${user.id}`)
            .then(res => res.json())
            .then(data => {
                setPaiement(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return (<div className="flex justify-center items-center min-h-screen font-bold text-3xl">Chargement...</div>);
    if (paiements.length === 0) return <div className="flex justify-center items-center min-h-screen font-bold text-3xl">Aucun Paiement pour le moment.</div>;

    return (
        <>
        <div className="min-h-screen m-30">
        <h1 className="text-3xl text-center font-semibold mb-7">Gestion des Paiement : </h1>
        <div className="relative overflow-x-auto bg-neutral-primary-soft rounded-lg shadow-lg border border-default">
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
                        <th className="px-6 py-3 font-semibold">ID Transaction</th>
                        <th className="px-6 py-3 font-semibold">ID Ticket</th>
                        <th className="px-6 py-3 font-semibold">Montant</th>
                        <th className="px-6 py-3 font-semibold">Date Paiement</th>
                        <th className="px-6 py-3 font-semibold">Moyen Paiement</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {paiements.map((paiement) => (
                        <tr key={paiement.id_transaction} className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium">
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <input type="checkbox" className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft" />
                                </div>
                            </td>
                            <td className="px-6 py-4">{paiement.id_transaction}</td>
                            <td className="px-6 py-4">{paiement.id_ticket}</td>
                            <td className="px-6 py-4">{paiement.montant}</td>
                            <td className="px-6 py-4">{paiement.date_paiement}</td>
                            <td className="px-6 py-4">{paiement.moyen_paiement}</td>
                            <td className="px-6 py-4">{paiement.statut}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    </>
    );

}
