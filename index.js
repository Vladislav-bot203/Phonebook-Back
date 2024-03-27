require('dotenv').config();
const express = require(`express`);
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Number = require('./models/number');


morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());


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


app.get('/api/persons', (request, response) =>
    Number.find({})
        .then(result =>
            response.json(result)
        )
);


app.get('/info', (rquest, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});


app.get('/api/persons/:id', (request, response) => {
    Number.findById(request.params.id)
        .then(result => {
            response.json(result);
        })
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
    }

    const number = new Number({
        name: body.name,
        number: body.number
    })
    
    number.save().then(result => {
        response.json(result);
    })
});


app.use(unknownEndpoint);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});