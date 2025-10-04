import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";

import Login from "./componentes/login";
import Register from "./componentes/register";
import Home from "./componentes/home";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificar sesión actual
    async function verificarSesion() {
      const { data: { session } } = await supabase.auth.getSession();
      setUsuario(session?.user || null);
      setCargando(false);
    }

    verificarSesion();

    // Escuchar cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    // Cleanup
    return () => listener.subscription.unsubscribe();
  }, []);

  if (cargando) return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando...</p>;

  return (
    <Router>
      <Routes>
        {/* Ruta privada: home */}
        <Route path="/" element={usuario ? <Home /> : <Navigate to="/login" />} />
        
        {/* Rutas de autenticación */}
        <Route path="/login" element={!usuario ? <Login /> : <Navigate to="/" />} />
        <Route path="/registro" element={!usuario ? <Register /> : <Navigate to="/" />} />

        {/* Ruta catch-all: si escribe algo desconocido */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
