"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, CalendarIcon } from "lucide-react";

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
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    fetch(`http://localhost:8000/api/tickets.php?id_etudiant=${user.id}`)
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
        <p className="text-gray-600">Vous n'avez pas encore acheté de ticket.</p>
      </div>
    );

  return (
    <div className="min-h-screen mb-30 mt-30 bg-gray-50 px-4 py-10 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Mes Tickets</h1>
      <p className="text-gray-600 text-center mb-8">
        Retrouvez ici tous vos tickets et leur statut
      </p>

      <div className="flex flex-col gap-6 w-full max-w-md">
        {tickets.map((ticket) => (
          <div
            key={ticket.id_ticket}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
          >
            <div
              className={`absolute top-0 right-0 h-full w-2 ${
                ticket.statut === "valide" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>

            <div className="p-6 flex flex-col gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center">
                Ticket #{ticket.numero_ticket}
              </h2>

              <div className="flex justify-between items-center text-gray-600 text-sm sm:text-base">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Achat: {ticket.date_achat}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Expire: {ticket.date_expiration}</span>
                </div>
              </div>

              <div className="flex items-center justify-center mt-2">
                {ticket.statut === "valide" ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-1" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-500 mr-1" />
                )}
                <span
                  className={`font-semibold ${
                    ticket.statut === "valide" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {ticket.statut.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}