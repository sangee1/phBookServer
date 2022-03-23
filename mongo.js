const mongoose = require("mongoose");

//console.log(process.argv[0]);
//console.log(process.argv[1]);

const url = `mongodb+srv://testdb:testdb@cluster0.uilmg.mongodb.net/phbookapp?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 2) {
  //Display all persons in phonebook
  Person.find({}).then((result) => {
    result.forEach((element) => {
      console.log(element);
    });
    mongoose.connection.close();
    process.exit();
  });
}

const name1 = process.argv[2];
const number1 = process.argv[3];

const person = new Person({
  name: name1,
  number: number1,
});

person.save().then((result) => {
  console.log(result);
  console.log(`Added ${result.name} and ${result.number} to phonebook`);
  mongoose.connection.close();
});
