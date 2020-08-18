import express = require('express');
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
 
// Create a new express app instance
mongoose.connect('mongodb://127.0.0.1/info', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;

const notes = (/*isEmpty: boolean = true, name?: string, date?: Date, report?: string, time?: string*/id: number): void => {
    const temp = [];
    for(let i = 9; i < 18; i+=0.5) {
        temp.push({
            isEmpty: true,
            time: Math.round(i-i%1).toString().padStart(2, '0').concat( (i%1 > 0) ? '-30' : '-00'),
            docId: id,
            data: {
                name: '',
                time: new Date(),
                report: ''
            }
        })
    }
    console.log(temp);
    
   // db.collection('notes').insertMany(temp)    
}


db.on('error', console.error.bind(console, 'MongoDB connection error:')); 


const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/', function (req, res) {
    notes(1);
    
    res.send('Hello 1111!');
});








app.listen(3001, function () {
    console.log('App is listening on port 3001!');
});