const express = require('express');
const PdfPrinter = require('pdfmake');
const fs = require('fs')
const path = require('path')


const vfsPath = path.join(__dirname, 'fonts', 'vfs_fonts.js');
const vfs = require(vfsPath); 

const app = express()

app.use(express.json());



// Convert vfs to the fonts object pdfmake expects
const fonts = {
  Roboto: {
    normal: Buffer.from(vfs['Roboto-Regular.ttf'], 'base64'),
    bold: Buffer.from(vfs['Roboto-Medium.ttf'], 'base64'),
    italics: vfs['Roboto-Italic.ttf'] ? Buffer.from(vfs['Roboto-Italic.ttf'], 'base64') : undefined,
    bolditalics: vfs['Roboto-MediumItalic.ttf'] ? Buffer.from(vfs['Roboto-MediumItalic.ttf'], 'base64') : undefined
  }
};

const printer = new PdfPrinter(fonts);

app.get('/print', (req, res) => {
    try{
  const docDefinition = {
    content: [
      { text: 'Hello PDF!', fontSize: 16 },
      'This PDF is generated in Node.js using external base64 Roboto fonts.'
    ]
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  // Send PDF to browser
  res.setHeader('Content-Type', 'application/pdf');
 res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');

  pdfDoc.pipe(res);
  pdfDoc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating PDF');
  }
});



  

const port = 5000;
app.listen(port, ()=> {
    console.log(`Server is working on ${port}`)
})