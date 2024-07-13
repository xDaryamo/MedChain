// src/pages/HomePage.jsx

import { Link } from "react-router-dom";
import { useUser } from "../features/authentication/useAuth";
import Button from "../ui/Button";
import heroImage from "../../public/images/hero-section.jpg"; // Ensure you have an image in the assets folder

const HomePage = () => {
  const { user } = useUser();
  const isAuthenticated = !!user;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative h-[36rem] bg-gray-800 lg:h-[45rem]">
        <img
          src={heroImage}
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover object-top opacity-60"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold">Benvenuti a MedChain</h1>
          <p className="mt-4 text-lg">
            Il tuo sistema sicuro e decentralizzato di gestione dei dati clinici
          </p>
          <div className="mt-6">
            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="primary">Vai alla Dashboard</Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button variant="primary">Inizia Ora</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold">
            Perché Scegliere MedChain?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-bold">Sicuro</h3>
              <p className="text-gray-700">
                I tuoi dati sono archiviati in modo sicuro utilizzando la
                tecnologia blockchain, garantendo che siano immodificabili e
                accessibili solo da persone autorizzate.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-bold">Accessibile</h3>
              <p className="text-gray-700">
                Accedi alle tue cartelle cliniche in qualsiasi momento e luogo.
                Condividile con i fornitori di assistenza sanitaria in modo
                sicuro ed efficiente.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-bold">Facile da Usare</h3>
              <p className="text-gray-700">
                La nostra interfaccia intuitiva rende facile gestire le tue
                cartelle cliniche e rimanere informato sul tuo stato di salute.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-cyan-600 py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p>&copy; 2023 MedChain. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
