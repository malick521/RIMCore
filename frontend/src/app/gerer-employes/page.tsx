"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type Employe = {
  id_employe: number;
  prenom: string;
  nom: string;
  email: string;
  date_ajout: string;
  Admin_Id: number;
};

export default function TableEmployes() {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<number | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<number | null>(null);

  // Fonction création employé
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());

    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      data.id = user.id;
    }

    if (!data.nom || !data.prenom || !data.email || !data.password) {
      toast.error("Tous les champs sont obligatoires");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8000/api/register-employe.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Inscription refusée");
        return;
      }
      toast.success(result.message);
      setOpenAdd(false);
      setSelectedEmp(null);
      fetchEmps()

    } catch (error) {
      toast.error("Erreur serveur ici");
    } finally {
      setLoading(false);
    }
  };

  // Fonction suppression employé
  const deleteEmp = async (id: number) => {
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8000/api/delete-employe.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({id}),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Suppression refusée");
        return;
      }

      toast.success("Employé supprimé avec succès !");
      setEmployes((prev) => prev.filter((emp) => emp.id_employe !== id));
      setOpenDelete(false);
      setSelectedEmp(null);

    } catch (error) {
      toast.error("Erreur serveur front");
      setOpenDelete(false);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchEmps = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const user = JSON.parse(userStr);
    setCurrentAdmin(user.id);

    try {
      const res = await fetch(
        `http://localhost:8000/api/employes.php?id_admin=${user.id}`
      );

      const data = await res.json();
      setEmployes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  // Fetch liste des employés
  useEffect(() => {
      fetchEmps();
    }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-3xl">
        Chargement...
      </div>
    );

  return (
    <>
      {/* TABLE DES EMPLOYES */}
      <div className="min-h-screen m-30">
        <h1 className="text-3xl text-center font-semibold mb-7">
          Gestion des Employés
        </h1>

       <Button
        onClick={() => setOpenAdd(true)}
        className="bg-primary shadow-lg rounded-lg p-3 mb-10 block mx-auto md:flex md:items-center"
      >
        Ajouter un Employe
      </Button>

       <div className="relative overflow-x-auto rounded-lg shadow-2xl border">
  <table className="w-full text-sm text-left">
    <thead className="border-b hidden md:table-header-group bg-gray-100">
      <tr>
        <th className="px-6 py-3">ID</th>
        <th className="px-6 py-3">Prénom</th>
        <th className="px-6 py-3">Nom</th>
        <th className="px-6 py-3">Email</th>
        <th className="px-6 py-3">Date</th>
        <th className="px-6 py-3">Admin</th>
        <th className="px-6 py-3">Action</th>
      </tr>
    </thead>

     <tbody>
              {employes.map((emp) => (
                <tr key={emp.id_employe}  className="border-b block md:table-row mb-4 md:mb-0">
                  <td data-label="ID" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">ID Employe: </span>
                    {emp.id_employe}</td>
                  <td data-label="Prenom" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">Prenom: </span>
                    {emp.prenom}</td>
                  <td data-label="Nom" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">Nom: </span>
                    {emp.nom}</td>
                  <td data-label="Email" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">Email: </span>
                    {emp.email}</td>
                  <td data-label="Date ajout" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">Date Ajout: </span>
                    {emp.date_ajout}</td>
                  <td data-label="Date ajout" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">ADMIN: </span>
                    {emp.Admin_Id}</td>

                  <td className="px-6 py-4 block md:table-cell">
                          <Button
                            variant="destructive"
                            className="bg-red-500 text-white"
                            onClick={() => {
                              setSelectedEmp(emp.id_employe);
                              setOpenDelete(true);
                            }}
                          >
                            Supprimer
                          </Button>                  
                  </td>
                </tr>
              ))}
            </tbody>
  </table>
</div>
      </div>

      {/* MODAL AJOUT EMPLOYE */}
      <Dialog open={openAdd} onClose={setOpenAdd} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">

            <DialogPanel className="w-full max-w-md sm:max-w-lg rounded-lg bg-white p-5 sm:p-6 shadow-xl overflow-hidden">
              
              <DialogTitle className="text-xl font-semibold mb-4 text-center sm:text-left">
                Création d'un compte employé
              </DialogTitle>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="prenom"
                  placeholder="Prénom"
                  className="w-full border rounded p-2"
                />
                <input
                  name="nom"
                  placeholder="Nom"
                  className="w-full border rounded p-2"
                />
                <input
                  name="email"
                  placeholder="Email"
                  className="w-full border rounded p-2"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                  className="w-full border rounded p-2"
                />

                <Button className="w-full mt-2">
                  Créer {loading && <Loader />}
                </Button>
              </form>

            </DialogPanel>

          </div>
        </div>
      </Dialog>

      {/* MODAL SUPPRESSION */}
      <Dialog open={openDelete} onClose={setOpenDelete} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-900/50" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            
            <DialogPanel className="bg-gray-800 rounded-lg p-5 sm:p-6 w-full max-w-sm sm:max-w-lg text-white shadow-xl">
              
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                </div>

                <DialogTitle className="text-base sm:text-lg font-semibold">
                  Supprimer cet employé ?
                </DialogTitle>
              </div>

              <p className="mt-3 text-sm text-gray-400">
                Cette action est définitive.
              </p>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => setOpenDelete(false)}
                >
                  Annuler
                </Button>

                <Button
                  className="w-full sm:w-auto bg-red-500 text-white"
                  onClick={() => selectedEmp && deleteEmp(selectedEmp)}
                >
                  {loading ? "Suppression..." : "Supprimer"}
                </Button>

              </div>
            </DialogPanel>

          </div>
        </div>
      </Dialog>
    </>
  );
}

   