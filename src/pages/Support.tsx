
import Header from "../components/Header";
import TopNav from "../components/TopNav";
import { MessageCircle } from "lucide-react";

const Support = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white">
    <Header />
    <TopNav />
    <main className="max-w-lg w-full mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Support client</h1>
      <div className="bg-white p-6 rounded-xl shadow text-center flex flex-col items-center gap-6">
        <MessageCircle size={38} className="mx-auto text-blue-500" />
        <div className="text-lg text-gray-800 font-semibold">Contact rapide WhatsApp</div>
        <a
          href="https://wa.me/22788082987"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition mb-2"
        >
          Discuter sur WhatsApp
        </a>
        <div className="text-base text-gray-600">Ou contactez-nous par e-mail :<br />
          <a href="mailto:support@facture227.com" className="text-blue-700 underline">support@facture227.com</a>
        </div>
      </div>
    </main>
  </div>
);

export default Support;
