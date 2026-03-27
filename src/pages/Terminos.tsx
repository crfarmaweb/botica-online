import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Legal.css';

export default function Terminos() {
  return (
    <>
      <SEO 
        title="Términos y Condiciones | CR Pharma"
        description="Términos y condiciones de uso de la tienda online CR Pharma."
      />
      <div className="legal-page">
        <div className="legal-container">
          <h1>Términos y Condiciones</h1>
          <p className="legal-date">Última actualización: Marzo 2026</p>

          <section>
            <h2>1. Información General</h2>
            <p>
              CR Pharma es una parafarmacia online propiedad de CR Farmacéuticos S.L., 
              con CIF XXX y domicilio en Madrid, España. El acceso y uso de este sitio web 
              constituye un acuerdo legally binding entre usted y CR Pharma.
            </p>
          </section>

          <section>
            <h2>2. Condiciones de Uso</h2>
            <p>
              El usuario se compromete a utilizar el sitio web de conformidad con la ley, 
              el presente aviso legal, las Condiciones Generales de Contratación y demás 
              avisos, reglamentos de uso e instrucciones puestos en su conocimiento.
            </p>
            <p>
              Queda prohibido el uso del sitio web con fines ilícitos o que puedan损坏 
              la imagen de CR Pharma o de terceros.
            </p>
          </section>

          <section>
            <h2>3. Productos y Precios</h2>
            <p>
              Los productos ofertados en CR Pharma están destinados a particulares y 
              profesionales de la salud. Los precios mostrados incluyen el IVA aplicable.
            </p>
            <p>
              CR Pharma se reserva el derecho a modificar los precios en cualquier momento, 
              siendo aplicable el precio vigente en el momento de la confirmación del pedido.
            </p>
          </section>

          <section>
            <h2>4. Proceso de Compra</h2>
            <p>Para realizar un pedido:</p>
            <ol>
              <li>Seleccione los productos deseados</li>
              <li>Complete sus datos de entrega</li>
              <li>Seleccione método de pago</li>
              <li>Confirme el pedido</li>
            </ol>
          </section>

          <section>
            <h2>5. Envíos y Entregas</h2>
            <p>
              Realizamos envíos a toda España peninsular. Los pedidos realizados antes de 
              las 14:00 horas se procesan el mismo día laborable.
            </p>
            <p>
              El tiempo de entrega estimado es de 24-48 horas laborables. 
              Para envíos a Baleares, el tiempo estimado es de 48-72 horas.
            </p>
          </section>

          <section>
            <h2>6. Devoluciones</h2>
            <p>
              Conforme a la legislación vigente, el consumidor tiene derecho a devolver 
              cualquier producto en el plazo de 14 días naturales desde la recepción, 
              sin necesidad de justificación.
            </p>
            <p>
              Los gastos de devolución correrán a cargo del cliente, excepto en caso 
              de producto defectuoso o error en el envío.
            </p>
          </section>

          <section>
            <h2>7. Protección de Datos</h2>
            <p>
              Los datos personales recabados serán tratados conforme a nuestra 
              <Link to="/privacidad">Política de Privacidad</Link>.
            </p>
          </section>

          <section>
            <h2>8. Propiedad Intelectual</h2>
            <p>
              Todos los contenidos del sitio web (textos, imágenes, logotipos, etc.) 
              son propiedad de CR Pharma o de terceros que han autorizado su uso.
            </p>
          </section>

          <section>
            <h2>9. Responsabilidad</h2>
            <p>
              CR Pharma no será responsable de los daños derivados del uso indebido 
              del sitio web ni de las购买的 realizadas a través del mismo.
            </p>
          </section>

          <section>
            <h2>10. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con estos términos, puede contactar 
              con nosotros en <strong>info@crpharma.es</strong>
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
