const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@cluster0.gqwtice.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set(`strictQuery`, false);

mongoose.connect(url);

const numberSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Number = mongoose.model('Number', numberSchema);

const number = new Number({
    name: process.argv[3],
    number: process.argv[4]
})

if(number.name && number.number){
number.save().then(result => {
    console.log(`added ${number.name} number ${number.number} to phonebook`);
    mongoose.connection.close();
})
} else {
    Number.find({}).then(result => {
        result.forEach(element => {
            console.log(element)
        });
        mongoose.connection.close()
    })
}