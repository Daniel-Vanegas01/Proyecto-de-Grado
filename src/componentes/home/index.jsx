import React from "react";
import "./style.css";

function Home() {
  return (
    <div>
      <header>
        <nav className="menu">
          <img
            src="https://github.com/Daniel-Vanegas01/Proyecto-final/blob/main/logo.png?raw=true"
            alt="Logo"
            className="logo"
          />
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Tendencias</a></li>
            <li><a href="#">Inspiración</a></li>
          </ul>
          <a href="#contacto" className="btn-contacto">Contáctenos</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-texto">
          <h2>
            Descubre tu <span className="resaltado">Estilo Único</span>
          </h2>
          <p>
            Explora nuevos looks, inspírate y busca expresar tu personalidad a través de los estilos que podemos ofrecerte. ¡Viste tu pasión!
          </p>
          <div className="botones">
            <a href="#" className="btn-principal">Subir prendas</a>
            <a href="#" className="btn-secundario">Explorar Looks</a>
          </div>
        </div>

        <div className="hero-imagenes">
          <img
            src="https://txcdn-prod-a1art.xiaopiu.com/assets/images/app_1945413840531910658/1945675807552712705/1814ec5b-8f95-4919-b3f0-b298f078f738.jpeg"
            alt="Moda urbana"
          />
          <img
            src="https://txcdn-prod-a1art.xiaopiu.com/assets/images/app_1945413840531910658/1945675807552712705/84dffb89-ab15-4c01-8e01-82dead023c2a.jpeg"
            alt="Grupo juvenil moda"
          />
          <img
            src="https://txcdn-prod-a1art.xiaopiu.com/assets/images/app_1945413840531910658/1945675807552712705/d841f4d3-1651-491c-aa67-8adfdb9977e1.jpeg"
            alt="Accesorios modernos"
          />
        </div>
      </section>
    </div>
  );
}

export default Home;
