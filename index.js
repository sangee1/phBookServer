require("dotenv").config();
const express = require("express");
const res = require("express/lib/response");

const app = express();
app.use(express.static("build"));
app.use(express.json());

const cors = require("cors");
app.use(cors());

//const Person = mongoose.model("Person", personSchema);
const Person = require("./models/person");

/*let persons = [
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
];*/

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

//change for mongo DB retrieval
app.get("/api/persons", (request, response) => {
  //response.json(persons);
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/info", (request, response) => {
  const num = persons.length;
  const date = new Date();
  response.send(`<p>Phone book has info for ${num} people</p> <p>${date}</p>`);
});

//fetch single resource
//change to MongoDB

app.get("/api/persons/:id", (request, response, next) => {
  /* const id = Number(request.params.id);
  const target = persons.find((person) => person.id === id);
  if (target) {
    response.json(target);
  } else {
    response.status(404).end();
  }*/
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
      //console.log(error);
      //response.status(400).send({ error: "Malformed id in request" });
    });
});

//delete a resource
//change for mongoDB
app.delete("/api/persons/:id", (request, response, next) => {
  /*const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();*/
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

//add a new entry to phonebook
//change for mongoDB
app.post("/api/persons", (request, response, next) => {
  const entry = request.body;
  //console.log(entry);
  //response.json(entry);
  if (!entry.name || !entry.number) {
    return response.status(400).json({
      error: "Name/number is missing",
    });
  }
  /*const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  entry.id = maxId + 1;
  persons = persons.concat(entry);
  response.json(entry);*/
  const person = new Person({
    name: entry.name,
    number: entry.number,
  });
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

//Update phone number
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Person.findByIdAndUpdate(
    request.params.id,
    {
      name,
      number,
    },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: "Unknown end point" });
};

app.use(unknownEndPoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
