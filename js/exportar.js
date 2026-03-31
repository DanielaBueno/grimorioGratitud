/**
 * @module Exportar
 * @description Gestiona todos los formatos de exportación del Grimorio.
 * Genera y descarga archivos en JSON, Markdown, CSV y PDF.
 * Depende de: Almacenamiento, fechas, configuracion, jsPDF (CDN).
 */
const Exportar = (() => {

  // ── Utilidad de descarga ─────────────────────────────────

  function descargarArchivo(contenido, nombreArchivo, tipoMime) {
    const enlace = document.createElement('a');
    enlace.href     = URL.createObjectURL(new Blob([contenido], { type: tipoMime }));
    enlace.download = nombreArchivo;
    enlace.click();
    mostrarTostada('Exportado correctamente ✨');
  }

  function obtenerEntradasOrdenadas() {
    return Object.entries(Almacenamiento.leerTodasLasEntradas())
      .sort(([a], [b]) => a.localeCompare(b));
  }

  // ── JSON ─────────────────────────────────────────────────

  function exportarJSON() {
    const entradas = Object.fromEntries(obtenerEntradasOrdenadas());
    const cartas   = Almacenamiento.leerCartas();
    const contenido = JSON.stringify({ entradas, cartas }, null, 2);
    descargarArchivo(contenido, 'grimorio-gratitud.json', 'application/json');
  }

  // ── Markdown ─────────────────────────────────────────────

  function exportarMarkdown() {
    const entradas = obtenerEntradasOrdenadas();
    let md = '# Grimorio de Gratitud\n\n';

    entradas.forEach(([fecha, entrada]) => {
      md += `## ${formatearFecha(fecha)}\n\n`;
      if (entrada.animo) {
        md += `**Luna:** ${ESTADOS_ANIMO[entrada.animo - 1]?.emoji} ${ESTADOS_ANIMO[entrada.animo - 1]?.etiqueta}\n\n`;
      }
      if (entrada.actividades?.length) {
        const nombresActividades = entrada.actividades
          .map(id => ACTIVIDADES.find(a => a.id === id)?.etiqueta || id)
          .join(', ');
        md += `**Actividades:** ${nombresActividades}\n\n`;
      }
      if (entrada.etiquetas?.length) {
        md += `**Etiquetas:** ${entrada.etiquetas.join(' ')}\n\n`;
      }
      if (entrada.gratitudes?.length) {
        md += '**Gratitudes:**\n';
        entrada.gratitudes.filter(Boolean).forEach((texto, i) => {
          md += `${i + 1}. ${texto}\n`;
        });
        md += '\n';
      }
      if (entrada.nota) {
        md += `**Nota:** ${entrada.nota}\n\n`;
      }
      md += '---\n\n';
    });

    const cartas = Almacenamiento.leerCartas();
    if (cartas.length) {
      md += '\n# Cartas a mi yo\n\n';
      cartas.forEach(carta => {
        const tipoCarta = carta.tipo === 'pasado' ? '💛 A mi yo del pasado' : '🌱 A mi yo del futuro';
        md += `## ${tipoCarta} — ${formatearFecha(carta.fecha)}\n`;
        if (carta.titulo) md += `### ${carta.titulo}\n`;
        md += `\n${carta.cuerpo}\n\n---\n\n`;
      });
    }

    descargarArchivo(md, 'grimorio-gratitud.md', 'text/markdown');
  }

  // ── CSV ──────────────────────────────────────────────────

  function exportarCSV() {
    const entradas = obtenerEntradasOrdenadas();
    const encabezado = 'fecha,animo,etiqueta_animo,actividades,etiquetas,gratitud_1,gratitud_2,gratitud_3,nota,dia_dificil\n';

    const filas = entradas.map(([fecha, entrada]) => {
      const animo        = entrada.animo || '';
      const etiquetaAnimo = entrada.animo ? ESTADOS_ANIMO[entrada.animo - 1]?.etiqueta : '';
      const actividades  = (entrada.actividades || [])
        .map(id => ACTIVIDADES.find(a => a.id === id)?.etiqueta || id)
        .join('|');
      const etiquetas    = (entrada.etiquetas || []).join('|');
      const gratitudes   = entrada.gratitudes || ['', '', ''];

      const escaparCSV = valor => `"${(valor || '').replace(/"/g, '""')}"`;
      return [fecha, animo, etiquetaAnimo, actividades, etiquetas,
        gratitudes[0], gratitudes[1], gratitudes[2],
        entrada.nota || '', entrada.diaDificil ? 'sí' : 'no'
      ].map(escaparCSV).join(',');
    });

    descargarArchivo(encabezado + filas.join('\n'), 'grimorio-gratitud.csv', 'text/csv');
  }

  // ── PDF ──────────────────────────────────────────────────

  function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc     = new jsPDF({ unit: 'pt', format: 'a4' });
    const entradas = obtenerEntradasOrdenadas();
    const ANCHO    = doc.internal.pageSize.getWidth();
    const MARGEN   = 50;
    let posicionY  = 60;

    function verificarNuevaPagina(espacioNecesario = 20) {
      if (posicionY + espacioNecesario > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        posicionY = 60;
      }
    }

    // Portada
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(200, 168, 75);
    doc.text('GRIMORIO DE GRATITUD', ANCHO / 2, posicionY, { align: 'center' });
    posicionY += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(160, 150, 120);
    doc.text(`Exportado el ${formatearFecha(fechaComoTexto())}`, ANCHO / 2, posicionY + 10, { align: 'center' });
    posicionY += 36;

    // Entradas
    entradas.forEach(([fecha, entrada]) => {
      verificarNuevaPagina(80);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(232, 223, 192);
      doc.text(formatearFecha(fecha), MARGEN, posicionY);

      if (entrada.animo) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(90, 125, 92);
        doc.text(
          `${ESTADOS_ANIMO[entrada.animo - 1]?.emoji} ${ESTADOS_ANIMO[entrada.animo - 1]?.etiqueta}`,
          ANCHO - MARGEN, posicionY, { align: 'right' }
        );
      }
      posicionY += 18;

      (entrada.gratitudes || []).filter(Boolean).forEach((texto, i) => {
        verificarNuevaPagina(20);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(176, 160, 122);
        const lineas = doc.splitTextToSize(`${['i.', 'ii.', 'iii.'][i]} ${texto}`, ANCHO - MARGEN * 2);
        doc.text(lineas, MARGEN + 8, posicionY);
        posicionY += lineas.length * 14;
      });

      if (entrada.nota) {
        verificarNuevaPagina(20);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(120, 112, 88);
        const lineas = doc.splitTextToSize(entrada.nota, ANCHO - MARGEN * 2);
        doc.text(lineas, MARGEN, posicionY);
        posicionY += lineas.length * 14;
      }

      posicionY += 8;
      doc.setDrawColor(60, 80, 50);
      doc.line(MARGEN, posicionY, ANCHO - MARGEN, posicionY);
      posicionY += 14;
    });

    doc.save('grimorio-gratitud.pdf');
    mostrarTostada('PDF generado ✨');
  }

  return { exportarJSON, exportarMarkdown, exportarCSV, exportarPDF };
})();
