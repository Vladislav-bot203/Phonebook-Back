//BNHC2R2CoJf7x0G4
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
    name: "Vladislav Fullstack",
    number: "3335522557"
})

number.save().then(result => {
    console.log('number saved');
    mongoose.connection.close();
})

// NodeIterator.find({}).then(result => {
//     result.forEach(element => {
//         console.log(element)
//     });
//     mongoose.connection.close()
// })