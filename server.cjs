const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Włącz CORS
app.use(cors());

// Middleware do parsowania JSON i plain text
app.use(bodyParser.text());
app.use(bodyParser.json());

// Endpoint do zapisywania plików w /inputs
app.put('/inputs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', 'inputs', filename);

  // Tworzenie katalogu, jeśli nie istnieje
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Zapisywanie pliku
  fs.writeFile(filePath, req.body, (err) => {
    if (err) {
      console.error(`Error saving file ${filename}:`, err);
      return res.status(500).send('Error saving file');
    }
    res.send('File saved successfully');
  });
});

// Endpoint do zapisywania lub nadpisywania /examples.json
app.put('/examples', (req, res) => {
  const examplesFilePath = path.join(__dirname, 'public', 'examples.json');
  const newExamples = req.body; // JSON z nowymi wartościami

  // Odczytaj istniejący plik
  fs.readFile(examplesFilePath, 'utf8', (err, data) => {
    let examples = {};

    if (!err && data) {
      try {
        examples = JSON.parse(data); // Parsowanie istniejących danych
      } catch (parseErr) {
        console.error('Error parsing existing examples.json:', parseErr);
      }
    }

    // Aktualizuj wartości
    Object.keys(newExamples).forEach((day) => {
      examples[day] = newExamples[day];
    });

    // Zapisz zaktualizowane dane
    fs.writeFile(examplesFilePath, JSON.stringify(examples, null, 2), (err) => {
      if (err) {
        console.error('Error saving examples.json:', err);
        return res.status(500).send('Error saving examples.json');
      }
      res.send('Examples.json updated successfully');
    });
  });
});

// Endpoint do tworzenia plików /src/components/days/${day}/parseInput.js i solve.js
app.post('/create-day/:day', (req, res) => {
  const day = req.params.day;
  const basePath = path.join(__dirname, 'src', 'components', 'days', day);

  // Upewnij się, że katalog istnieje
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  const files = {
    'parseInput.js': `export function parseInput(input) {    
    return [input];
}
`,
    'solve.js': `export function solvePart1(...input) { 
    return null;
}

export function solvePart2(...input) { 
    console.log(input);
    return null;
}
`,
  };

  // Tworzenie plików, jeśli nie istnieją
  Object.entries(files).forEach(([filename, content]) => {
    const filePath = path.join(basePath, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    }
  });

  res.send(`Files created for day ${day}`);
});

// Start serwera
app.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});
