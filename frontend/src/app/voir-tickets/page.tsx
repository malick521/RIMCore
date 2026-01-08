"use client";

import { useEffect, useState } from "react";

export default function VoirTicket() {
    type Ticket = {
        id_ticket: number;
        numero_ticket: string;
        date_achat: string;
        date_expiration: string;
        statut: string;
    };

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Récupérer l'utilisateur depuis localStorage
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);

        // Fetch tickets pour cet étudiant
        fetch(`http://localhost:8000/api/tickets.php?id_etudiant=${user.id}`)
            .then(res => res.json())
            .then(data => {
                setTickets(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Chargement...</div>;

    if (tickets.length === 0) {
        return (
            <div className="flex flex-col mt-30 items-center justify-center h-screen px-4">
                <h1 className="text-3xl font-bold mb-4">Aucun Ticket pour le moment.</h1>
            </div>
        );
    }

    return (

        <div className="flex flex-col mt-40 h-screen items-center px-4 space-y-4">
             <h1 className="text-3xl text-center font-semibold mb-0">Ticket(s)</h1>
             <p className="mt-4 text-lg text-gray-600 mb-7">Vous trouverez ici vos tickets et leurs status !</p>

            {tickets.map(ticket => (
                <div key={ticket.id_ticket} className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-96">
                     
                   
                    <h2 className="text-xl text-center font-bold mb-6">Numéro Ticket : {ticket.numero_ticket}</h2>
                    <p className="mb-1"><strong>Date Achat :</strong> {ticket.date_achat}</p>
                    <p className="mb-1"><strong>Expiration :</strong> {ticket.date_expiration}</p>
                    <p className="font-bold">Statut : <b className={`${ticket.statut === 'valide' ? 'text-green-500' : 'text-red-500'}`}>{ticket.statut}</b></p>
                </div>
            ))}
        </div>
    );
}
