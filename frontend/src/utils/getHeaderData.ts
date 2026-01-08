import {menuDataStudent} from "@/components/Layout/Header/Navigation/menuDataStudent"
import { menuDataEmploye } from "@/components/Layout/Header/Navigation/menuDataEmploye";
import { menuDataAdmin } from "@/components/Layout/Header/Navigation/menuDataAdmin";
import { HeaderItem } from "@/types/menu";

export function getHeaderData() : HeaderItem[] {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) return [
    { label: "Services", href: "#product" },
    { label: "Fonctionnalités", href: "#features" },
  ];

  if (user.role === "etudiant") return menuDataStudent;
  if (user.role === "employe") return menuDataEmploye;
  if (user.role === "administrateur") return menuDataAdmin;

  return [];
}
