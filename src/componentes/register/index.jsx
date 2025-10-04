import { useState } from "react";
import { supabase } from "../../supabase";
import "./style.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
          username,
        },
      },
    });

    if (error) {
      alert("❌ Error al registrar usuario");
    } else {
      alert("✅ Cuenta creada, revisa tu correo para confirmar");
      window.location.href = "/login";
    }
  };

  return (
    <div className="auth-container">
      <div className="form-wrapper register">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Nombre y Apellido</label>
            <input
              type="text"
              placeholder="Nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Nombre de Usuario</label>
            <input
              type="text"
              placeholder="usuario123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <button type="submit" className="btn-submit">Registrarme</button>
        </form>

        <p className="switch-text">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="switch-link">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
