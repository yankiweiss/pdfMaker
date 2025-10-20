const express = require('express');
const PdfPrinter = require('pdfmake');
const fs = require('fs')
const path = require('path')
const  cors = require('cors');


app.use(cors());

const vfs = require('./fonts/vfs_fonts')

const fonts = {
  Roboto: {
    normal: Buffer.from(vfs['Roboto-Regular.ttf'], 'base64'),
    bold: Buffer.from(vfs['Roboto-Medium.ttf'], 'base64'),
    italics: vfs['Roboto-Italic.ttf'] ? Buffer.from(vfs['Roboto-Italic.ttf'], 'base64') : undefined,
    bolditalics: vfs['Roboto-MediumItalic.ttf'] ? Buffer.from(vfs['Roboto-MediumItalic.ttf'], 'base64') : undefined
  }
};



const app = express()

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world!')
})

const printer = new PdfPrinter(fonts);

app.post("/print", (req, res) => {
  try {
    const docDefinition = {
      content: [
        { text: "Hello PDF!", fontSize: 16 },
        "This PDF is generated using pdfmake.",
      ],
      defaultStyle: { font: "Roboto" },
    };

    // create the PDF document
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // set response headers so browser knows it's a PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=example.pdf");

    // pipe the PDF stream directly to the HTTP response
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});



const port = 5000;
app.listen(port, ()=> {
    console.log(`Server is working on ${port}`)
})