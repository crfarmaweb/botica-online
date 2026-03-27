import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Legal.css';

export default function Privacidad() {
  return (
    <>
      <SEO 
        title="Política de Privacidad | CR Pharma"
        description="Política de privacidad y protección de datos de CR Pharma."
      />
      <div className="legal-page">
        <div className="legal-container">
          <h1>Política de Privacidad</h1>
          <p className="legal-date">Última actualización: Marzo 2026</p>

          <section>
            <h2>1. Responsable del Tratamiento</h2>
            <p>
              <strong>CR Farmacéuticos S.L.</strong><br />
              CIF: XXX<br />
              Domicilio: Madrid, España<br />
              Email: info@crpharma.es
            </p>
          </section>

          <section>
            <h2>2. Finalidad del Tratamiento</h2>
            <p>Los datos personales recabados se utilizarán para:</p>
            <ul>
              <li>Gestionar su registro como usuario</li>
              <li>Procesar sus pedidos y entregas</li>
              <li>Atender sus consultas y solicitudes</li>
              <li>Enviar comunicaciones comerciales (con su consentimiento)</li>
              <li>Mejorar nuestros servicios y experiencia de usuario</li>
            </ul>
          </section>

          <section>
            <h2>3. Base Legal</h2>
            <p>El tratamiento de sus datos se basa en:</p>
            <ul>
              <li><strong>Ejecución del contrato:</strong> Para procesar pedidos y entregas</li>
              <li><strong>Consentimiento:</strong> Para comunicaciones comerciales</li>
              <li><strong>Interés legítimo:</strong> Para mejora de servicios</li>
              <li><strong>Cumplimiento legal:</strong> Para obligaciones fiscales</li>
            </ul>
          </section>

          <section>
            <h2>4. Categorías de Datos</h2>
            <p>Recopilamos los siguientes datos:</p>
            <ul>
              <li><strong>Identificación:</strong> Nombre, apellidos</li>
              <li><strong>Contacto:</strong> Email, teléfono, dirección</li>
              <li><strong>Transacción:</strong> Historial de pedidos</li>
              <li><strong>Navegación:</strong> IP, cookies, comportamiento en site</li>
            </ul>
          </section>

          <section>
            <h2>5. Destinatarios</h2>
            <p>Sus datos podrán comunicarse a:</p>
            <ul>
              <li>Empresas de logística y transporte para entregas</li>
              <li>Entidades bancarias para pagos</li>
              <li>Autoridades competentes (cuando sea requerido legalmente)</li>
            </ul>
            <p>No vendemos sus datos a terceros.</p>
          </section>

          <section>
            <h2>6. Transferencias Internacionales</h2>
            <p>
              Los datos se almacenan en servidores dentro del Espacio Económico Europeo (EEE). 
              No se realizan transferencias internacionales de datos.
            </p>
          </section>

          <section>
            <h2>7. Plazo de Conservación</h2>
            <p>Conservaremos sus datos:</p>
            <ul>
              <li><strong>Cuenta de usuario:</strong> Mientras mantenga su cuenta activa</li>
              <li><strong>Pedidos:</strong> Durante 3 años para obligaciones fiscales</li>
              <li><strong>Marketing:</strong> Hasta que retire su consentimiento</li>
            </ul>
          </section>

          <section>
            <h2>8. Derechos del Usuario</h2>
            <p>Usted tiene derecho a:</p>
            <ul>
              <li><strong>Acceso:</strong> Conocer qué datos tenemos</li>
              <li><strong>Rectificación:</strong> Corregir datos incorrectos</li>
              <li><strong>Supresión:</strong> Solicitar eliminación de sus datos</li>
              <li><strong>Oposición:</strong> Opponerse al tratamiento</li>
              <li><strong>Limitación:</strong> Restringir el tratamiento</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
            </ul>
            <p>
              Para ejercer estos derechos, envíe un email a <strong>info@crpharma.es</strong> 
              adjuntando copia de su DNI.
            </p>
          </section>

          <section>
            <h2>9. Cookies</h2>
            <p>
              Utilizamos cookies propias y de terceros para mejorar su experiencia 
              y analizar el tráfico. Puede configurar o rechazar las cookies 
              a través de nuestro banner de cookies.
            </p>
          </section>

          <section>
            <h2>10. Menores de Edad</h2>
            <p>
              Nuestros servicios no están dirigidos a menores de 18 años. 
              No recopilamos intencionadamente datos de menores.
            </p>
          </section>

          <section>
            <h2>11. Modificaciones</h2>
            <p>
              Podemos modificar esta política en cualquier momento. 
              Le informaremos de cambios significativos a través del sitio web 
              o por email.
            </p>
          </section>

          <section>
            <h2>12. Contacto</h2>
            <p>
              Para cualquier consulta sobre esta política, contacte con nuestro 
              Delegado de Protección de Datos en: <strong>info@crpharma.es</strong>
            </p>
          </section>

          <div className="legal-back">
            <Link to="/">Volver a la tienda</Link>
          </div>
        </div>
      </div>
    </>
  );
}
