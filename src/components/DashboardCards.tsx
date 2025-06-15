
const DASHBOARD_DATA = [
  {
    label: "Factures restantes (démo gratuite)",
    value: "5",
    description: "Factures incluses dans la démo gratuite",
    color: "bg-blue-100 text-blue-800",
  },
  {
    label: "Clients",
    value: "0",
    description: "Ajoutez vos premiers clients",
    color: "bg-green-100 text-green-800",
  },
  {
    label: "Produits / Services",
    value: "0",
    description: "Ajoutez vos produits ou services",
    color: "bg-yellow-100 text-yellow-800",
  }
];

const DashboardCards = () => (
  <section className="w-full grid md:grid-cols-3 gap-6 my-10">
    {DASHBOARD_DATA.map((d, i) => (
      <div
        key={i}
        className={`rounded-xl shadow p-6 flex flex-col items-center justify-center ${d.color} min-h-[110px]`}
      >
        <div className="text-3xl font-bold mb-2">{d.value}</div>
        <div className="text-lg font-semibold">{d.label}</div>
        <div className="text-sm text-gray-500 mt-1">{d.description}</div>
      </div>
    ))}
  </section>
);

export default DashboardCards;
