"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/components/ui/button";

type Admin = {
  id_admin: number;
  prenom: string;
  nom: string;
  role: string;
  email: string;
  date_ajout: string;
};

export default function TableAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<number | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);

  // =========================
  // Ajouter Admin
  // =========================

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (!data.nom || !data.prenom || !data.email || !data.password) {
      toast.error("Tous les champs sont obligatoires");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/register-admin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Inscription refusée");
        return;
      }

      toast.success("Admin créé avec succès !");
      setOpenAddModal(false);
      fetchAdmins();
    } catch {
      toast.error("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Suppression Admin
  // =========================

  const deleteAdmin = async (id: number) => {
      setLoading(true);
  
      try {
        const res = await fetch(
          "http://localhost:8000/api/delete-admin.php",
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
  
        toast.success("Admin supprimé avec succès !");
        setAdmins((prev) => prev.filter((adm) => adm.id_admin !== id));
        setOpenDelete(false);
        setSelectedAdmin(null);
  
      } catch (error) {
        toast.error("Erreur serveur");
        setOpenDelete(false);
      } finally {
        setLoading(false);
      }
  };

  // =========================
  // Charger admins
  // =========================

  const fetchAdmins = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const user = JSON.parse(userStr);
    setCurrentAdmin(user.id);

    try {
      const res = await fetch(
        `http://localhost:8000/api/voir-admin.php?id_admin=${user.id}`
      );

      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // =========================
  // Supprimer admin
  // =========================

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-3xl">
        Chargement...
      </div>
    );

  return (
    <>
      {/* TABLE DES ADMINS */}
      <div className="min-h-screen m-30">
        <h1 className="text-3xl text-center font-semibold mb-7 md:text-center">
          Gestion des Administrateurs
        </h1>

        <Button
          onClick={() => setOpenAddModal(true)}
          className="bg-primary shadow-lg rounded-lg p-3 mb-10 block mx-auto md:flex md:items-center"
        >
          Ajouter un Admin
        </Button>

       <div className="relative overflow-x-auto rounded-lg shadow-2xl border">
          <table className="w-full rounded-lg shadow-2xl text-sm text-left">
             <thead className="border-b hidden md:table-header-group bg-gray-100">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Prénom</th>
                <th className="px-6 py-3">Nom</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Date</th>
                {(currentAdmin === 1) && (<th className="px-6 py-3">Action</th>)}
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id_admin}  className="border-b block md:table-row mb-4 md:mb-0">
                  <td data-label="ID" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">ID Admin: </span>
                    {admin.id_admin}</td>
                  <td data-label="Prenom" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">Prenom: </span>
                    {admin.prenom}</td>
                  <td data-label="Nom" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">Nom: </span>
                    {admin.nom}</td>
                  <td data-label="Email" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">Email: </span>
                    {admin.email}</td>
                  <td data-label="Role" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">Role: </span>
                    {admin.role}</td>
                  <td data-label="Dajeajout" className="px-6 py-4 block md:table-cell">
                    <span className="font-semibold md:hidden">Date Ajout: </span>
                    {admin.date_ajout}</td>

                  <td className="px-6 py-4 block md:table-cell">
                      {(currentAdmin === 1 && admin.id_admin != 1) &&(
                          <Button
                            variant="destructive"
                            className="bg-red-500 text-white"
                            onClick={() => {
                              setSelectedAdmin(admin.id_admin);
                              setOpenDelete(true);
                            }}
                          >
                            Supprimer
                          </Button>
                        )}                  
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
      MODAL AJOUT ADMIN
      ========================= */}

     <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel 
              className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl 
                        overflow-y-auto max-h-[90vh]"
            >
              <DialogTitle className="text-xl font-semibold mb-4 text-center sm:text-left">
                Création d'un compte Administrateur
              </DialogTitle>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  className="w-full border p-2 rounded"
                />

                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  className="w-full border p-2 rounded"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  className="w-full border p-2 rounded"
                />

                <Button className="w-full mt-2">
                  Créer {loading && <Loader />}
                </Button>
              </form>
            </DialogPanel>
          </div>
      </Dialog>

      {/* =========================
      MODAL SUPPRESSION ADMIN
      ========================= */}
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
                  Supprimer cet admin ?
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
                  onClick={() => selectedAdmin && deleteAdmin(selectedAdmin)}
                >
                  Supprimer
                </Button>
              </div>

            </DialogPanel>

          </div>
        </div>
      </Dialog>
    </>
  );
}