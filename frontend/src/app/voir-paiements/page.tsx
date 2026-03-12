"use client";

import {useState, useEffect} from 'react'
import { Button } from '../components/ui/button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'; 
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

   const exportToExcel = (data: Paiement[], fileName = 'export.xlsx') => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Feuille1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, fileName);
        };

    if (loading) return (<div className="flex justify-center items-center min-h-screen font-bold text-3xl">Chargement...</div>);
    if (paiements.length === 0) return <div className="flex justify-center items-center min-h-screen font-bold text-3xl">Aucun Paiement pour le moment.</div>;

    return (
        <>
        <div className="min-h-screen m-30">
        <h1 className="text-3xl text-center font-semibold mb-7">Gestion des Paiement : </h1>
         <Button 
            className="
                bg-emerald-800 
                shadow-lg 
                rounded-lg 
                p-3 
                mb-10 
                mx-auto 
                flex 
                flex-wrap 
                items-center 
                justify-center 
                gap-2 
                w-max
                md:flex-nowrap
            "
            onClick={() => exportToExcel(paiements, 'paiements.xlsx')}
         >
         <ArrowDownTrayIcon className="h-5 w-5" />
          Expotez format Excel
        </Button>
       <div className="relative overflow-x-auto rounded-lg shadow-2xl border">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="border-b hidden md:table-header-group bg-gray-100">
                <tr>
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
                    <tr
                    key={paiement.id_transaction}
                    className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium md:table-row block"
                    >
                    {/** Chaque td devient un mini “row” sur mobile */}
                    <td className="px-6 py-4 block md:table-cell" data-label="ID Transaction">
                        <span className="font-semibold md:hidden">ID Transaction: </span>
                        {paiement.id_transaction}
                    </td>
                    <td className="px-6 py-4 block md:table-cell" data-label="ID Ticket">
                        <span className="font-semibold md:hidden">ID Ticket: </span>
                        {paiement.id_ticket}
                    </td>
                    <td className="px-6 py-4 block md:table-cell" data-label="Montant">
                        <span className="font-semibold md:hidden">Montant: </span>
                        {paiement.montant}
                    </td>
                    <td className="px-6 py-4 block md:table-cell" data-label="Date Paiement">
                        <span className="font-semibold md:hidden">Date Paiement: </span>
                        {paiement.date_paiement}
                    </td>
                    <td className="px-6 py-4 block md:table-cell" data-label="Moyen Paiement">
                        <span className="font-semibold md:hidden">Moyen Paiement: </span>
                        {paiement.moyen_paiement}
                    </td>
                    <td className="px-6 py-4 block md:table-cell" data-label="Status">
                        <span className="font-semibold md:hidden">Status: </span>
                        {paiement.statut}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
    </>
    );

}
