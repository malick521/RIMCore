import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from "@/app/components/ui/button"; // ton composant Button
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';


type Employe = {
  id_employe: number;
  prenom: string;
  nom: string;
  email: string;
  date_ajout: string;
  Admin_Id: number;
};

type EmployeeDataTableProps = {
  employes: Employe[];
  handleDelete: (id: number) => void;
  onSelectDelete?: (id: number) => void;
};

export default function EmployeeDataTable({
  employes,
  handleDelete,
  onSelectDelete, // <-- déstructuré ici !
}: EmployeeDataTableProps) {
  const columns = [
    { id: "id", name: "ID", selector: (row: Employe) => row.id_employe, sortable: true },
    { name: "Prénom", selector: (row: Employe) => row.prenom, sortable: true },
    { name: "Nom", selector: (row: Employe) => row.nom, sortable: true },
    { name: "Email", selector: (row: Employe) => row.email, sortable: true },
    { name: "Date", selector: (row: Employe) => row.date_ajout, sortable: true },
    { name: "Admin", selector: (row: Employe) => row.Admin_Id, sortable: true },
   {
  name: "Action",
  cell: (row: Employe) => (
    <Button
      className="bg-red-500 text-white w-full sm:w-auto"
      onClick={() => {
        if (onSelectDelete) {
          onSelectDelete(row.id_employe);
        } else {
          handleDelete(row.id_employe);
        }
      }}
    >
      Supprimer
    </Button>
  ),
  ignoreRowClick: true, // ✅ correct
  allowOverflow: true,   // ✅ correct
  button: true,          // ✅ correct
}
  ];

  return (
    <DataTable<Employe>
  columns={columns}
  data={employes}
  pagination
  responsive
  highlightOnHover
  striped
  defaultSortFieldId="id"
  className="rounded-lg shadow-2xl"
  noHeader={window.innerWidth < 768} // pas d’en-tête sur mobile
  customStyles={{
    rows: {
      style: {
        display: window.innerWidth < 768 ? "block" : "table-row",
        marginBottom: window.innerWidth < 768 ? "1rem" : 0,
      },
    },
    cells: {
      style: {
        display: window.innerWidth < 768 ? "flex" : "table-cell",
        justifyContent: window.innerWidth < 768 ? "space-between" : "unset",
        padding: window.innerWidth < 768 ? "0.5rem" : "0.75rem",
      },
    },
  }}
/>
  );
}