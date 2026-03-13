"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, CalendarIcon } from "lucide-react";
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'; 
import { Button } from "../components/ui/button";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Ticket>("id_ticket");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    fetch(`http://localhost:8000/api/personal-validations.php?id_employe=${user.id}`)
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

    const exportToExcel = (data: Ticket[], fileName = 'export.xlsx') => {
          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Feuille1');
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
          saveAs(blob, fileName);
          };
  
    const handleSort = (key: keyof Ticket) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
        };
    const filteredTickets = tickets.filter((p) =>
        Object.values(p)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        );

    const sortedTickets = [...filteredTickets].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
        });
  
    const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);

    const paginatedTickets = sortedTickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
        );

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  if (!Array.isArray(tickets) || tickets.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Aucune validation 
        </h1>
        <p className="text-gray-600">Vous n'avez effectuée aucune validation de ticket.</p>
      </div>
    );

  return (
    <div className="min-h-screen m-30 p-3 ">
       <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Vos validations</h1>
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
              onClick={() => exportToExcel(tickets, 'paiements.xlsx')}
          >
          <ArrowDownTrayIcon className="h-5 w-5" />
            Expotez format Excel
          </Button>
       <input
                type="text"
                placeholder="Rechercher..."
                className="border border-b-cyan-950 p-2 rounded mb-6 w-full max-w-sm"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}
            />
     
      <table className="w-full rounded-lg shadow-2xl text-sm text-left border-collapse">

        <thead className="border-b hidden md:table-header-group bg-gray-100">
          <tr>
            <th className="px-6 py-3 font-semibold cursor-pointer"
              onClick={() => handleSort("id_ticket")}
            >ID Ticket</th>
            <th className="px-6 py-3 font-semibold cursor-pointer"
                onClick={() => handleSort("numero_ticket")}
                >
                  Num. Ticket</th>
            <th className="px-6 py-3 font-semibold cursor-pointer"
                  onClick={() => handleSort("date_achat")}
                >
                  Date achat</th>
            <th className="px-6 py-3 font-semibold cursor-pointer"
                  onClick={() => handleSort("date_expiration")}
                >
                  Date Exp.</th>
            <th className="px-6 py-3 font-semibold cursor-pointer"
                  onClick={() => handleSort("statut")}
                >
                  Satut</th>
            <th className="px-6 py-3 font-semibold cursor-pointer"
                onClick={() => handleSort("id_etudiant")}
                >
                  ID Etudiant</th>
            <th className="px-6 py-3 font-semibold cursor-pointer"
                onClick={() => handleSort("id_employe")}
                >
                  ID Employé</th>
          </tr>
        </thead>

        <tbody>
                  {paginatedTickets.map((tc) => (
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
      <div className="flex justify-center gap-2 mt-6 flex-wrap">

                <button
                    className="px-3 py-1 border rounded"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Précédent
                </button>

                <span className="px-3 py-1">
                    Page {currentPage} / {totalPages}
                </span>

                <button
                    className="px-3 py-1 border rounded"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Suivant
                </button>
      </div>
    </div>
  );
}