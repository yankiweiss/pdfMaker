const PdfPrinter = require('pdfmake');
const path = require('path');
const vfs = require('../fonts/vfs_fonts');

const fonts = {
  Roboto: {
    normal: Buffer.from(vfs['Roboto-Regular.ttf'], 'base64'),
    bold: Buffer.from(vfs['Roboto-Medium.ttf'], 'base64'),
    italics: vfs['Roboto-Italic.ttf'] ? Buffer.from(vfs['Roboto-Italic.ttf'], 'base64') : undefined,
    bolditalics: vfs['Roboto-MediumItalic.ttf'] ? Buffer.from(vfs['Roboto-MediumItalic.ttf'], 'base64') : undefined
  }
};

const printer = new PdfPrinter(fonts);

export default function handler(req, res) {
  try {
    // Optional: accept JSON payload from POST
    const { tenantName, inspectionDate } = req.body || {};

    const docDefinition = {
      content: [
        { text: 'Boiler Inspection Report', fontSize: 18, bold: true },
        { text: `Tenant: ${tenantName || 'N/A'}` },
        { text: `Date: ${inspectionDate || 'N/A'}` },
        '\nThis PDF is generated using pdfmake on Vercel.'
      ],
      defaultStyle: { font: 'Roboto' }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="inspection_report.pdf"');

    pdfDoc.pipe(res);
    pdfDoc.end();

  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating PDF');
  }
}