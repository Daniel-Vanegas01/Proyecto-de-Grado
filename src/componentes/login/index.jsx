import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import "./style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("❌ Usuario o contraseña incorrectos");
    } else {
      console.log("✅ Sesión iniciada:", data);
      navigate("/home");
    }
  };

  return (
    <div className="auth-container">
      <div className="form-wrapper login">
        <h2>Inicia Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="tuemail@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="•••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit">Entrar</button>
        </form>

        <p className="switch-text">
          ¿No tienes cuenta?{" "}
          <span
            className="switch-link"
            onClick={() => navigate("/registro")}
            style={{ cursor: "pointer" }}
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
