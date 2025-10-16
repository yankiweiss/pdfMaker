const express = require('express');
const PdfPrinter = require('pdfmake');
const fs = require('fs')
const path = require('path')



const app = express()

app.use(express.json());





const port = 5000;
app.listen(port, ()=> {
    console.log(`Server is working on ${port}`)
})