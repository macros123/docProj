import express from 'express';
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
import fillDays from './fillTheBase';

// Create a new express app instance
mongoose.connect('mongodb://127.0.0.1/test', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
const Schema = mongoose.Schema;

const daySchema = Schema({
    _id: Schema.Types.ObjectId,
    date: Date,
    doctors: [{
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
    }]
})
const doctorSchema = Schema({
    _id: Schema.Types.ObjectId,
    date: Date,
    name: String,
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]
})
const noteSchema = Schema({
    _id: Schema.Types.ObjectId,
    isEmpty: Boolean,
    time: String,
    docId: Schema.Types.ObjectId,
    date: Date,
    data: {
        name: String,
        time: Date,
        report: String
    }
})

noteSchema.statics.getAll = function () {
    return this.find({time: '09-00'});
}

const Note = mongoose.model('Note', noteSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Day = mongoose.model('Day', daySchema);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/oneday', function (req, res) {
    //One day info
    Note.find({docId: req.body.docId, date: req.body.day}, function (err: any, data2: any) {
        res.send(data2)
    })
});
app.get('/days', function (req, res) {
    //Get days
    console.log(`request get /days`, req.body)
    Day.find({}, function (err: any, data: any) {
        res.send(data)
    })
});
app.get('/docs', function (req, res) {
    //Get doctors by day
    Doctor.find({date: req.query.day}, function (err: any, data: any) {
        res.send(data)
    })
});
app.get('/notes', function (req, res) {
    //Get doctors by day
    Note.find({docId: req.query.docId}, function (err: any, data: any) {
        res.send(data)
    })
});


app.post('/addd', function (req, res) {

    fillDays(Day, Doctor, Note, 5);
    res.send('База заполнена');

});

app.listen(3001, function () {
    console.log('App is listening on port 3001!');
});
