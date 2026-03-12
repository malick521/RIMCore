"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, CalendarIcon } from "lucide-react";

export default function VoirTicket() {
  type Ticket = {
    id_ticket: number;
    numero_ticket: string;
    id_etudiant: number;
    id_employe: number;
    date_achat: string;
    date_expiration: string;
    statut: string;
  };

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    fetch(`http://localhost:8000/api/all-tickets.php?id_admin=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        // ⚡ Assure-toi que data est un tableau
        if (Array.isArray(data)) {
          setTickets(data);
        } else if (data?.tickets) {
          setTickets(data.tickets);
        } else {
          setTickets([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  if (!Array.isArray(tickets) || tickets.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Aucun Ticket pour le moment
        </h1>
        <p className="text-gray-600">Aucun n'a été acheté de ticket.</p>
      </div>
    );

  return (
    <div className="min-h-screen m-30">

      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Historique Tickets</h1>
      <table className="w-full text-sm text-left border-collapse">

        <thead className="border-b hidden md:table-header-group bg-gray-100">
          <tr>
            <th className="px-6 py-3">ID Ticket</th>
            <th className="px-6 py-3">Num. Ticket</th>
            <th className="px-6 py-3">Date achat</th>
            <th className="px-6 py-3">Date Exp.</th>
            <th className="px-6 py-3">Satut</th>
            <th className="px-6 py-3">ID Etudiant</th>
            <th className="px-6 py-3">ID Employé</th>
          </tr>
        </thead>

        <tbody>
                  {tickets.map((tc) => (
                    <tr key={tc.id_ticket}  className="border-b block md:table-row mb-4 md:mb-0">
                      <td data-label="ID" className="px-6 py-4 block md:table-cell">
                        <span className="font-semibold md:hidden">ID Ticket: </span>
                        {tc.id_ticket}</td>
                      <td data-label="Prenom" className="px-6 py-4 block md:table-cell">
                        <span className="font-semibold md:hidden">Num. Ticket: </span>
                        {tc.numero_ticket}</td>
                      <td data-label="Nom" className="px-6 py-4 block md:table-cell">
                        <span className="font-semibold md:hidden">Date Achat: </span>
                        {tc.date_achat}</td>
                      <td data-label="Nom" className="px-6 py-4 block md:table-cell">
                        <span className="font-semibold md:hidden">Date Exp.: </span>
                        {tc.date_expiration}</td>
                      <td data-label="Email" className="px-6 py-4 block md:table-cell">
                        <span className="font-semibold md:hidden">Statut: </span>
                        {tc.statut}</td>
                      <td data-label="Date ajout" className="px-6 py-4 block md:table-cell">
                        <span className="font-semibold md:hidden">ID Etudiant: </span>
                        {tc.id_etudiant}</td>
                      <td data-label="Date ajout" className="px-6 py-4 block md:table-cell">
                        <span className="font-semibold md:hidden">ID Employé: </span>
                        {tc.id_employe}</td>
                    </tr>
                  ))}
                </tbody>
      </table>

    </div>
  );
}