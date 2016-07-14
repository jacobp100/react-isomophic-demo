const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { filter, matches, uniqueId } = require('lodash/fp');

const server = new Express();
server.use(bodyParser.json());
server.use(cors());

const database = {
  cats: [
    { id: uniqueId(), name: 'Sprinkles', age: 8, gender: 'male' },
    { id: uniqueId(), name: 'Boots', age: 5, gender: 'male' },
    { id: uniqueId(), name: 'Waffles', age: 9, gender: 'female' },
  ],
};

server.get('/cats', (req, res) => {
  res.json(filter(matches(req.query), database.cats));
});

server.put('/cats', (req, res) => {
  const cat = Object.assign({}, req.body, { id: uniqueId() });
  database.cats.push(cat);

  res.json(cat);
});

server.delete('/cats/:id', (req, res) => {
  const id = req.params.id;
  const catIndex = database.cats.findIndex(catEntry => catEntry.id === id);

  if (catIndex === -1) {
    res.status(500).send(`Failed to find cat with id ${id}`);
    return;
  }

  database.cats.splice(catIndex, 1);

  res.json('');
});

server.post('/cats/:id', (req, res) => {
  const id = req.params.id;
  const cat = database.cats.find(catEntry => catEntry.id === id);

  if (!cat) {
    res.status(500).send(`Failed to find cat with id ${id}`);
    return;
  }

  Object.assign(cat, req.body);
  res.json(cat);
});

server.listen(8081);
