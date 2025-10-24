import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";

import Login from "./componentes/login";
import Register from "./componentes/register";
import Home from "./componentes/home";
import SubirPrenda from "./componentes/SubirPrendas";
import Closet from "./componentes/Closet"; // <-- Importamos Closet

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function verificarSesion() {
      const { data: { session } } = await supabase.auth.getSession();
      setUsuario(session?.user || null);
      setCargando(false);
    }

    verificarSesion();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (cargando) return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando...</p>;

  return (
    <Router>
      <Routes>
        {/* Rutas privadas */}
        <Route path="/" element={usuario ? <Home /> : <Navigate to="/login" />} />
        <Route path="/subir-prendas" element={usuario ? <SubirPrenda /> : <Navigate to="/login" />} />
        <Route path="/closet" element={usuario ? <Closet /> : <Navigate to="/login" />} /> {/* <-- Nueva ruta */}

        {/* Rutas de autenticación */}
        <Route path="/login" element={!usuario ? <Login /> : <Navigate to="/" />} />
        <Route path="/registro" element={!usuario ? <Register /> : <Navigate to="/" />} />

        {/* Ruta catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
