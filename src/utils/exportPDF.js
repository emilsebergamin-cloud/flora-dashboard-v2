const BASE_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #5a4a42; background: #fff; }
  .page { padding: 0 4px; }
  .header { padding-bottom: 14px; border-bottom: 1.5px solid #e2d5c5; margin-bottom: 22px; }
  .header-title { font-size: 26px; font-weight: normal; color: #5a4a42; letter-spacing: 0.5px; }
  .header-sub { font-size: 11px; color: #8a7a72; margin-top: 5px; font-family: Arial, sans-serif; }
  h2 { font-size: 13px; font-weight: bold; color: #5a4a42; font-family: Arial, sans-serif;
       text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px; }
  h3 { font-size: 12px; font-weight: bold; color: #5a4a42; font-family: Arial, sans-serif; margin: 0 0 6px; }
  p, li, td, th { font-family: Arial, sans-serif; font-size: 11px; color: #5a4a42; line-height: 1.5; }
  .muted { color: #8a7a72; }
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  th { background: #f5efe6; text-align: left; padding: 7px 10px; font-size: 10px;
       text-transform: uppercase; letter-spacing: 0.8px; color: #8a7a72; border-bottom: 1px solid #e2d5c5; }
  td { padding: 8px 10px; border-bottom: 1px solid #f0e8de; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .tag { display: inline-block; background: #f5efe6; color: #5a4a42; font-size: 10px;
         padding: 1px 7px; border-radius: 20px; margin: 1px 2px 1px 0; }
  .tag-rosa { background: #dfc5c5; }
  .week-card { background: #faf7f2; border: 1px solid #e2d5c5; border-radius: 8px;
               padding: 12px 14px; margin-bottom: 10px; }
  .week-label { font-size: 10px; font-weight: bold; font-family: Arial, sans-serif;
                text-transform: uppercase; letter-spacing: 1px; color: #8a7a72; margin-bottom: 6px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px; }
  .field label { font-size: 10px; color: #8a7a72; font-family: Arial, sans-serif;
                 text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; display: block; }
  .field p { font-size: 11px; color: #5a4a42; }
  .frase-item { padding: 10px 0; border-bottom: 1px solid #f0e8de; }
  .frase-item:last-child { border-bottom: none; }
  .frase-text { font-size: 12px; color: #5a4a42; line-height: 1.5; margin-bottom: 4px; }
  .badge { font-size: 10px; background: #f5efe6; color: #5a4a42; padding: 1px 7px; border-radius: 20px;
           display: inline-block; margin-right: 4px; font-family: Arial, sans-serif; }
  .item-card { background: #fff; border: 1px solid #e2d5c5; border-radius: 8px;
               padding: 14px 16px; margin-bottom: 12px; page-break-inside: avoid; }
  .item-title { font-size: 14px; font-weight: bold; color: #5a4a42; margin-bottom: 6px; line-height: 1.3; }
  .item-meta { margin-bottom: 8px; }
  .item-section { margin-top: 8px; padding-top: 8px; border-top: 1px dashed #f0e8de; }
  .item-section label { font-size: 9px; color: #8a7a72; font-family: Arial, sans-serif;
                        text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 3px; }
  .item-section p { font-size: 11px; color: #5a4a42; line-height: 1.5; white-space: pre-wrap; }
  .footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #e2d5c5;
            font-size: 9px; color: #8a7a72; font-family: Arial, sans-serif; text-align: center; }
`;

export async function exportPDF(htmlContent, filename) {
  const html2pdf = (await import('html2pdf.js')).default;
  const container = document.createElement('div');
  container.innerHTML = `
    <!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>${BASE_STYLES}</style></head>
    <body><div class="page">${htmlContent}</div></body></html>`;

  const opt = {
    filename,
    margin: [14, 14, 14, 14],
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  const blob = await html2pdf().from(container).set(opt).output('blob');
  const file = new File([blob], filename, { type: 'application/pdf' });

  // Mobile: menú nativo de compartir (WhatsApp, Guardar en archivos, etc.)
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (err) {
      // El usuario canceló o falló — caemos al fallback
      if (err.name !== 'AbortError') console.warn('[exportPDF] share failed', err);
    }
  }

  // Fallback universal: abre el PDF en nueva pestaña (ahí tiene download/print propios)
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    // Bloqueado por popup blocker → forzar download via anchor
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// ─── Generadores por sección ──────────────────────────────────────────────────

export function buildPlanHTML(plan, fecha = new Date()) {
  const mes = fecha.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  const weeks = plan.weeks ?? {};
  const semanas = ['s1','s2','s3','s4'];
  const labels  = { s1: 'Semana 1', s2: 'Semana 2', s3: 'Semana 3', s4: 'Semana 4' };

  const weekCards = semanas.map((k) => {
    const w = weeks[k] ?? {};
    if (!w.objetivo && !w.tema) return '';
    return `
      <div class="week-card">
        <div class="week-label">${labels[k]}</div>
        <div class="grid-2">
          <div class="field"><label>Objetivo</label><p>${w.objetivo || '—'}</p></div>
          <div class="field"><label>Tema</label><p>${w.tema || '—'}</p></div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="header">
      <div class="header-title">Flora Studio</div>
      <div class="header-sub">Plan temático · ${mes.charAt(0).toUpperCase() + mes.slice(1)}</div>
    </div>
    ${plan.themeCentral ? `
      <h2>Tema central del mes</h2>
      <p style="font-size:13px;line-height:1.6;margin-bottom:6px">${plan.themeCentral}</p>` : ''}
    ${weekCards ? `<h2>Objetivos por semana</h2>${weekCards}` : ''}
    <div class="footer">Flora Dashboard v2 · Exportado el ${new Date().toLocaleDateString('es-AR')}</div>`;
}

export function buildFrasesHTML(frases) {
  if (!frases.length) return '<p class="muted">No hay frases registradas.</p>';
  const rows = frases.map((f) => `
    <div class="frase-item">
      <div class="frase-text">${f.text}</div>
      <div>
        ${f.uso ? `<span class="badge">${f.uso}</span>` : ''}
        ${f.tag ? `<span class="badge" style="background:#dfc5c5">${f.tag}</span>` : ''}
      </div>
    </div>`).join('');
  return `
    <div class="header">
      <div class="header-title">Flora Studio</div>
      <div class="header-sub">Banco de frases · ${frases.length} ${frases.length === 1 ? 'frase' : 'frases'}</div>
    </div>
    <div>${rows}</div>
    <div class="footer">Flora Dashboard v2 · Exportado el ${new Date().toLocaleDateString('es-AR')}</div>`;
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function buildContenidoHTML(items, categoria = 'Todo') {
  if (!items.length) return '<p class="muted">No hay contenido para exportar.</p>';
  const statusLabel = { idea: 'Idea', borrador: 'Borrador', listo: 'Listo', publicado: 'Publicado' };
  const tipoLabel   = { post: 'Post estático', carrusel: 'Carrusel', reel: 'Reel', story: 'Story' };
  const reelEstado  = { idea: 'Idea', guion: 'Guion', grabado: 'Grabado', editado: 'Editado', publicado: 'Publicado' };

  const cards = items.map((c) => {
    const isReel     = c.category === 'reel' || c.type === 'reel';
    const isCarrusel = c.type === 'carrusel';
    const tags       = Array.isArray(c.tags) ? c.tags : [];

    const meta = [
      c.category ? `<span class="badge tag-rosa">${escapeHtml(c.category)}</span>` : '',
      c.type     ? `<span class="badge">${escapeHtml(tipoLabel[c.type] ?? c.type)}</span>` : '',
      c.status   ? `<span class="badge">${escapeHtml(statusLabel[c.status] ?? c.status)}</span>` : '',
      c.date     ? `<span class="badge">${escapeHtml(c.date)}</span>` : '',
    ].filter(Boolean).join('');

    const sections = [];
    if (c.excerpt)
      sections.push(`<div class="item-section"><label>Descripción / idea</label><p>${escapeHtml(c.excerpt)}</p></div>`);
    if (c.cta)
      sections.push(`<div class="item-section"><label>CTA</label><p>${escapeHtml(c.cta)}</p></div>`);
    if (tags.length)
      sections.push(`<div class="item-section"><label>Tags</label><p>${tags.map(escapeHtml).map((t) => `<span class="badge">${t}</span>`).join('')}</p></div>`);

    if (isReel && c.reelData) {
      const r = c.reelData;
      const reelFields = [
        r.concepto         ? `<strong>Concepto:</strong> ${escapeHtml(r.concepto)}` : '',
        r.audio            ? `<strong>Audio:</strong> ${escapeHtml(r.audio)}` : '',
        r.textoSuperpuesto ? `<strong>Texto superpuesto:</strong> ${escapeHtml(r.textoSuperpuesto)}` : '',
        r.apareceFlora     ? `<strong>¿Aparece Flora?:</strong> ${escapeHtml(r.apareceFlora)}` : '',
        r.estadoProduccion ? `<strong>Producción:</strong> ${escapeHtml(reelEstado[r.estadoProduccion] ?? r.estadoProduccion)}` : '',
      ].filter(Boolean).join('<br>');
      if (reelFields)
        sections.push(`<div class="item-section"><label>Detalles del reel</label><p>${reelFields}</p></div>`);
    }

    if (isCarrusel && c.notasSlides)
      sections.push(`<div class="item-section"><label>Notas por slide</label><p>${escapeHtml(c.notasSlides)}</p></div>`);

    return `
      <div class="item-card">
        <div class="item-title">${escapeHtml(c.title)}</div>
        <div class="item-meta">${meta}</div>
        ${sections.join('')}
      </div>`;
  }).join('');

  return `
    <div class="header">
      <div class="header-title">Flora Studio</div>
      <div class="header-sub">Contenido · ${escapeHtml(categoria)} · ${items.length} ${items.length === 1 ? 'ítem' : 'ítems'}</div>
    </div>
    ${cards}
    <div class="footer">Flora Dashboard v2 · Exportado el ${new Date().toLocaleDateString('es-AR')}</div>`;
}
