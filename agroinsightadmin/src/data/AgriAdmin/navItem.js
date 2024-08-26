const navList = [
  {
    _id: 1,
    name: "Dashboard",
    icon: "bi bi-grid",
  },
  {
    _id: 2,
    name: "Fertilizers & Pesticides",
    icon: "bi bi-menu-button-wide",
    children: [
      { _id: 21, name: "Customers", icon: "bi bi-circle" },
      { _id: 22, name: "Suppliers", icon: "bi bi-circle" },
      { _id: 23, name: "Logistic", icon: "bi bi-circle" },
    ],
  },
  {
    _id: 3,
    name: "Crop Management",
    icon: "bi bi-journal-text",
  },
  {
    _id: 4,
    name: "Desease Management",
    icon: "bi bi-layout-text-window-reverse",
  },
];

export default navList;
