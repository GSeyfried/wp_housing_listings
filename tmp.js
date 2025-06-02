function showEmailInput() {
  const html = HtmlService.createHtmlOutputFromFile('EmailInput')
    .setWidth(500)
    .setHeight(350);
  SpreadsheetApp.getUi().showModalDialog(html, 'Enter Email');
}

function filterAndEmailResults(email, bodyText) {
    if (!email) throw new Error('No email provided.');

    const trimmedBody = (bodyText || '').trim();
    const finalEmailBody =
        trimmedBody === '' ? 'Attached are the documents you requested.' : trimmedBody;

    const searchSpreadsheetId = '1zEabIIrZvxovE6bcD-wYyRArn72jYfamBvCS3AMMXAs'; // ← your sheet ID
    const resultsSheetName = 'Results';
  try {
    const ss = SpreadsheetApp.openById(searchSpreadsheetId);
    const resultsSh = ss.getSheetByName(resultsSheetName);
    const searchSh = ss.getSheetByName('Search');
    if (!resultsSh) throw new Error(`Sheet '${resultsSheetName}' not found.`);

    /* ---------- language ---------- */
    const language = (searchSh.getRange('C19').getValue() || '')
      .toString().toLowerCase().trim() || 'english';
    const isSpanish = language === 'spanish';

    /* ---------- data & header map ---------- */
    const data = resultsSh.getDataRange().getValues();
    const headers = data[0];
    const hMap = headers.reduce((m, h, i) => (m[h.toString().toLowerCase()] = i, m), {});

    const catCol = hMap['category'] ?? hMap['categoría'];
    if (catCol === undefined) throw new Error('Category column missing.');

    /* ---------- doc scaffold ---------- */
    const doc = DocumentApp.create(isSpanish ? 'Guía de Vivienda' : 'Affordable Housing Guide');
    const body = doc.getBody();
    body.setMarginTop(15).setMarginBottom(15).setMarginLeft(15).setMarginRight(15);

    const header = doc.addHeader();
    header.appendParagraph(isSpanish ? 'Guía de Vivienda' : 'Housing Guide')
      .setFontFamily('Arial').setFontSize(14).setBold(true)
      .setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    header.appendParagraph(
      isSpanish
        ? 'Esta guía de vivienda muestra una lista de propiedades que podrían adaptarse a sus necesidades.'
        : 'This housing guide shows a list of properties that might suit your needs.'
    )
      .setFontFamily('Arial').setFontSize(10)
      .setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    header.appendHorizontalRule();

    const categories = isSpanish
      ? {
        "Viviendas SUBSIDIADAS con restricción de ingresos": {
          bullets: [
            "Todas las propiedades en esta página están destinadas a inquilinos de bajos ingresos y tienen restricciones de ingresos. Para saber si califica, contacte directamente con cada propiedad",
            "Muchas propiedades subsidiadas están reservadas para personas mayores y/o personas con discapacidades.",
            "¿Cuánto cuesta el alquiler?",
            "   Las unidades subsidiadas cobran alquiler basado en el 30% del ingreso mensual de su hogar.",
            "   Los servicios públicos como agua, alcantarillado y recolección de basura están incluidos en el alquiler.",
            "Los Housing Choice Vouchers no son aceptados en estas propiedades.",
            "¿Está dispuesto a vivir en cualquier parte de Montana? Los apartamentos subsidiados en otras partes del estado frequentemente tienen listas de espera más cortas.\n"
          ]
        },
        "Viviendas ASEQUIBLES con restricción de ingresos": {
          bullets: [
            "La mayoría de las propiedades en esta página son para hogares de ingresos bajos/moderados y tienen restricciones de ingresos",
            "Los Housing Choice Vouchers pueden ser aceptados en estos lugares. Contacte con la propiedad para confirmar.\n"
          ]
        },
        "Gestión de propiedades y apartamentos de precio de mercado": {
          bullets: [
            "Esta es una lista general de compañías de administración de propiedades en Bozeman. Los precios del alquiler y la asequibilidad pueden variar.",
            "Muchas compañías de administración publican unidades disponibles en sus propios sitios web.\n"
          ]
        }
      }
      : {
        "Income-Restricted SUBSIDIZED Rentals": {
          bullets: [
            "All properties on this page are intended for lower-income renters and have income restrictions. To see if you qualify, contact each property directly.",
            "Many subsidized properties are reserved for seniors and/or people with disabilities.",
            "How much is rent?",
            "   Subsidized units charge rent based on 30% of your household’s monthly income.",
            "   Utilities such as water, sewer, and trash service are included in rent.",
            "Housing Choice Vouchers are not accepted at these properties.",
            "Are you open to living anywhere in Montana? Subsidized apartments in other parts of the state often have shorter waitlists.\n"
          ]
        },
        "Income-Restricted AFFORDABLE Rentals": {
          bullets: [
            "Most properties on this page are for low/moderate income households and are income-restricted.",
            "Housing Choice Vouchers may be accepted at these locations. Contact the property to confirm.\n"
          ]
        },
        "Property Management and Market Rate Apartments": {
          bullets: [
            "This is a general list of property management companies in Bozeman. Rent prices and affordability will vary.",
            "Many property management companies post available units on their individual websites.\n"
          ]
        }
      };

    Logger.log("Language: " + language);
    Logger.log("Headers: " + headers.join(", "));
    Logger.log("Category Index: " + catCol);

    /* ---------- build each category section ---------- */
    for (const [cat, cfg] of Object.entries(categories)) {
      const rows = data.slice(1).filter(r => r[catCol] === cat);
      if (!rows.length) continue;
      if (body.getNumChildren() > 0) body.appendPageBreak();

      body.appendParagraph(cat).setFontFamily('Arial').setFontSize(12).setBold(true)
        .setAlignment(DocumentApp.HorizontalAlignment.CENTER);

      cfg.bullets.forEach(b =>
        body.appendListItem(b).setFontFamily('Arial').setFontSize(10)
          .setGlyphType(DocumentApp.GlyphType.BULLET)
          .setIndentStart(b.startsWith('   ') ? 50 : 0)
      );

      /* ---- 4-column table ---- */
      const tblHdr = isSpanish
        ? ['Detalles 1', 'Info 1', 'Detalles 2', 'Info 2']
        : ['Property Details 1', 'Additional Information 1',
          'Property Details 2', 'Additional Information 2'];

      const tblRows = [];
      for (let i = 0; i < rows.length; i += 2) {
        const pack = r => {
          if (!r) return ['', ''];
          const g = c => r[hMap[c]] ?? 'N/A';
          return [
            `${g('property name')}\n${g('property manager')}\n${g('address')} | ${g('city')}\n${g('phone')}\n${g('website')}`,
            g(isSpanish ? 'descripción' : 'description (auto)')
          ];
        };
        const [d1, info1] = pack(rows[i]);
        const [d2, info2] = pack(rows[i + 1]);
        tblRows.push([d1, info1, d2, info2]);
      }

      const table = body.appendTable([tblHdr, ...tblRows]);
      table.setBorderWidth(1).setBorderColor('#000');

      /* ---- style rows ---- */
      for (let r = 0; r < table.getNumRows(); r++) {
        const row = table.getRow(r);
        for (let c = 0; c < row.getNumCells(); c++) {
          const cell = row.getCell(c).editAsText();
          cell.setFontSize(10).setFontFamily('Arial');
          if (r === 0) { cell.setBold(true); continue; }

          /* italicise 2nd line (manager) */
          const txt = cell.getText();
          const firstNL = txt.indexOf('\n');
          const secondNL = txt.indexOf('\n', firstNL + 1);
          if (firstNL >= 0 && secondNL > firstNL) {
            cell.setItalic(firstNL + 1, secondNL - 1, true);
          }

          /* bold property name (1st line) */
          if (firstNL > 0) cell.setBold(0, firstNL - 1, true);
        }
      }
    }

    /* ---------- finish & email ---------- */
    doc.saveAndClose();
    const pdf = DriveApp.getFileById(doc.getId()).getAs('application/pdf');
    GmailApp.sendEmail(
      email,
      isSpanish ? 'Guía de Vivienda Asequible' : 'Affordable Housing Guide',
      finalEmailBody,
      { attachments: [pdf] }
    );
    DriveApp.getFileById(doc.getId()).setTrashed(true);

    let housingGraphic = null;
    try {
      housingGraphic = DriveApp.getFileById("1hRLiqyJsFxu1uc7koeMnBmiHxS17jURg").getBlob();
    } catch (error) {
      Logger.log(`Error retrieving housing graphic: ${error.message}`);
    }

    const pdfFile = DriveApp.getFileById(doc.getId());
    const pdfBlob = pdfFile.getAs('application/pdf');

    const attachments = [pdfBlob];
    if (housingGraphic) attachments.push(housingGraphic);

    GmailApp.sendEmail(email, isSpanish ? "Guía de Vivienda Asequible" : "Affordable Housing Guide", finalEmailBody, {
      attachments: attachments
    });

    pdfFile.setTrashed(true);

    logPDFUsage({
      email,
      language,
      resultsCount: data.length - 1, // exclude header
      pdfSent: true,
      error: ""
    });
    Logger.log(`Email successfully sent to ${email}.`);
  } catch (error) {
    Logger.log(`Error in filterAndEmailResults: ${error.message}`);
    // ❌ LOG FAILURE
    logPDFUsage({
      email: email || "N/A",
      language: language || "Unknown",
      resultsCount: 0,
      pdfSent: false,
      error: error.message
    });
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * remove an empty first page from the document by:
 * - Removing consecutive empty paragraphs
 * - Removing consecutive page breaks
 * Stops at the first sign of real content.
 */
function removeBlankFirstPage(document) {
  try {
    const body = document.getBody();
    // We'll iterate from the top, removing empty paragraphs or page breaks,
    // then stop once we find real content.

    while (body.getNumChildren() > 0) {
      const element = body.getChild(0);
      const type = element.getType();

      // If it's a PAGE_BREAK, remove it and continue checking further elements
      if (type === DocumentApp.ElementType.PAGE_BREAK) {
        body.removeChild(element);
        continue;
      }

      // If it's a PARAGRAPH, check if it's empty
      if (type === DocumentApp.ElementType.PARAGRAPH) {
        const text = element.asParagraph().getText().trim();
        if (text === '') {
          // Empty paragraph => remove it and continue
          body.removeChild(element);
          continue;
        } else {
          // Non-empty paragraph => this is real content, so stop removing
          break;
        }
      }

      // If it's *not* a page break or empty paragraph (e.g. a table, image, etc.),
      // we assume it's real content, so stop removing.
      break;
    }
    return document; // Return the modified document

  } catch (error) {
    Logger.log(`Non-critical error in removeBlankFirstPage: ${error.message}`);
    return document; // Return the unmodified document if something goes wrong
  }
}

function logPDFUsage({ email, language, resultsCount, pdfSent, error }) {
  const logSheetName = "Logs";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = ss.getSheetByName(logSheetName);

  if (!logSheet) {
    logSheet = ss.insertSheet(logSheetName);
    logSheet.hideSheet(); // keep it hidden
    logSheet.appendRow(["Timestamp", "Email", "Language", "Results Count", "PDF Sent", "Error Message"]);
  }

  logSheet.appendRow([
    new Date(),
    email,
    language,
    resultsCount,
    pdfSent ? "Yes" : "No",
    error || ""
  ]);
}

