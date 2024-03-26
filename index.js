const express = require(`express`);
const app = express();
const morgan = require('morgan');
const cors = require('cors');


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
})

// const requestLogger = (request, respone, next) => {
//     console.log("Method: ", request.method);
//     console.log("Path: ", request.path);
//     console.log("Body ", request.body);
//     console.log("---");
//     next();
// }


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors());
app.use(express.json());
// app.use(requestLogger);
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res)
    ].join(' ')
}));


const GenerateId = () => {
    return Math.floor(Math.random() * (1000));
}


app.get('/api/persons', (request, response) => {
    response.json(persons);
});


app.get('/info', (rquest, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).send("<p><b>Error 404: The person id is not found</b></p>");
    }
});


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});


app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name && !body.number) {
        return response.status(400).json({
            error: "Content missing"
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(404).json({
            error: "Person already exists"
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: GenerateId(),
    }

    persons = persons.concat(person);

    response.json(person);
})


app.use(unknownEndpoint);


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});