import { jsPDF } from "jspdf";

export const generateReport = (data: any) => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text('Informe de visita tecnica', 10, 20);
  doc.line(10, 25, 200, 25);

  doc.text(`Nombre: ${data.pdf.nombre}`, 15, 40);
  doc.text(`Fecha: ${data.pdf.fecha}`, 120, 40);
  doc.text(`Localidad: ${data.pdf.localidad}`, 15, 50);
  doc.rect(10, 30, 180, 25); // Dibuja un rectángulo alrededor del nombre, la fecha y la localidad

  doc.text(`Tipo de visita: ${data.pdf.tipoDeVisita}`, 15, 70);
  doc.rect(10, 60, 180, 12); // Dibuja un rectángulo alrededor del tipo de visita

  doc.text(`Problema encontrado: ${data.pdf.problemaEncontrado}`, 10, 80);

  doc.text(`Detalle del problema: ${data.pdf.detalleProblema}`, 10, 90);

  doc.text(`Trabajo realizado: ${data.pdf.trabajoRealizado}`, 10, 100);

  doc.text(`Detalle del trabajo: ${data.pdf.detalleTrabajo}`, 10, 110);

  doc.text(`Observaciones: ${data.pdf.observaciones}`, 10, 120);

  doc.text(`Ticket ID: ${data.pdf.ticketId}`, 10, 130);
  doc.save("reporte.pdf");
};