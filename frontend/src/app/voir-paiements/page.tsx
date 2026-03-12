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
            className='bg-emerald-700 shadow-lg rounded-lg p-3 mb-10 block mx-auto md:flex md:items-center'
            onClick={() => exportToExcel(paiements, 'paiements.xlsx')}
         >
         <ArrowDownTrayIcon className="h-5 w-5" />
          Expotez format Excel
        </Button>
        <div className="relative overflow-x-auto rounded-lg shadow-2xl border">
          <table className="w-full text-sm text-left">
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
                        <tr key={paiement.id_transaction} className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium">
                            <td data-label="IDTR" className="px-6 py-4 block md:table-cell">{paiement.id_transaction}</td>
                            <td data-label="IDTC" className="px-6 py-4 block md:table-cell">{paiement.id_ticket}</td>
                            <td data-label="Montant" className="px-6 py-4 block md:table-cell">{paiement.montant}</td>
                            <td data-label="Date" className="px-6 py-4 block md:table-cell">{paiement.date_paiement}</td>
                            <td data-label="Moyen" className="px-6 py-4 block md:table-cell">{paiement.moyen_paiement}</td>
                            <td data-label="Satus" className="px-6 py-4 block md:table-cell">{paiement.statut}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    </>
    );

}
