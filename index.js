require("dotenv").config();
const express = require(`express`);
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const NumberPh = require("./models/number");

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

app.get("/api/persons", (request, response, next) =>
  NumberPh.find({})
  .then(result => {
    if(result){
        response.json(result);
    } else {
        response.status(404).end();
    }
  })
  .catch(error => {
    next(error);
  })
);

app.get("/info", (rquest, response, next) => {
    NumberPh.find({})
    .then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
    })
    .catch(error => next(error));
});

app.get("/api/persons/:id", (request, response) => {
  NumberPh.findById(request.params.id).then((result) => {
    response.json(result);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  NumberPh.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  const number = new NumberPh({
    name: body.name,
    number: body.number,
  });
  number
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const {number, name} = request.body;

    NumberPh.findByIdAndUpdate(
      request.params.id, 
      {number, name}, 
      {new: true, runValidators: true, context: 'query'}
      )
        .then(result => response.json(result))
        .catch(error => next(error)
      )
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({error: error.message, name: error.name})
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
