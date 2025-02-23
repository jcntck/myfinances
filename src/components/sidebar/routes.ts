import { ChartPie, CreditCard, Settings2 } from "lucide-react";

export const routes = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartPie,
    breadcrumbs: ["Dashboard"],
  },
  {
    title: "Transações",
    url: "#",
    icon: CreditCard,
    isActive: true,
    items: [
      {
        title: "Débito",
        url: "/transacao/debito",
        breadcrumbs: ["Transações", "Debito"],
      },
      {
        title: "Crédito",
        url: "/transacao/credito",
        breadcrumbs: ["Transações", "Crédito"],
      },
    ],
  },
  {
    title: "Configurações",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "Categorias",
        url: "/categoria",
        breadcrumbs: ["Configurações", "Categorias"],
      },
    ],
  },
];
