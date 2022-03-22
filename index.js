const express = require("express");
const res = require("express/lib/response");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use(express.static("build"));

let persons = [
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
  {
    name: "Sangeetha Selvaraj",
    number: "023-456-789",
    id: 6,
  },
  {
    name: "Nanditha K",
    number: "023-456-789",
    id: 7,
  },
  {
    name: "KrishnaPrasad T O",
    number: "023-456-789",
    id: 8,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const num = persons.length;
  const date = new Date();
  response.send(`<p>Phone book has info for ${num} people</p> <p>${date}</p>`);
});

//fetch single resource
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const target = persons.find((person) => person.id === id);
  if (target) {
    response.json(target);
  } else {
    response.status(404).end();
  }
});

//delete a resource
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

//add a new entry to phonebook
app.post("/api/persons", (request, response) => {
  const entry = request.body;
  //console.log(entry);
  //response.json(entry);
  if (!entry.name || !entry.number) {
    return response.status(400).json({
      error: "Name/number is missing",
    });
  }
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  entry.id = maxId + 1;
  persons = persons.concat(entry);
  response.json(entry);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
