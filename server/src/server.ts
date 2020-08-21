import express from 'express';
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
import func from './fillTheBase';

// Create a server instances
mongoose.connect('mongodb://127.0.0.1/test', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
const Schema = mongoose.Schema;

//initial schemas
const daySchema = func.daySchema
const doctorSchema = func.doctorSchema
const noteSchema = func.noteSchema

const Note = mongoose.model('Note', noteSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Day = mongoose.model('Day', daySchema);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: true }));


//drop db before load data into
db.dropDatabase().then(() =>
{
    func.fillDaysDocs(Day, Doctor, Note, 5);
})

type timeDoc = {
    doctors: Array<object>,
    days: Array<object>
}

//fill db after timeout
const fill = function () {
    const response: timeDoc = {doctors: [], days: []};
    Doctor.find({}, function (err: Error, data: Array<object>) {
        response.doctors = data
        Day.find({}, function (err: Error, data1: Array<object>) {
            console.log('Base has filled')
            response.days = data1
            func.fillNotes(response, Note);
        })
    })
}
setTimeout(fill, 3000)


////////////GET DAYS FOR PARAM
app.get('/days', function (req, res) {
    //Get days
    console.log(`request get /days`, req.body)
    Day.find({}, function (err: Error, data: Array<object>) {
        res.send(data)
    })
});

////////////GET DOCTORS
app.get('/docs', function (req, res) {
    //Get doctors by day
    console.log(`request get /docs`, req.body)
    Doctor.find({}, function (err: Error, data: Array<object>) {
        res.send(data)
    })
});

////////////GET NOTES FOR SECOND PAGE
app.get('/oneday', function (req, res) {
    //notes by doc and day
    Note.find({docId: req.query.docId, date: req.query.day}, null, {sort: {_id: 1}}, function (err: Error, data: Array<object>) {
        res.send(data)
    })
});

////////////GET NOTES FOR PARAM
app.get('/notesd', function (req, res) {
    //notes by doc
    Note.find({docId: req.query.docId}, null, {sort: {_id: 1}}, function (err: Error, data: Array<object>) {
        res.send(data)
    })
});

////////////POST CHANGED NOTE
app.post('/write', function (req, res) {
    Note.findById(req.query.id, function (err: Error, note: any) {
        if (err) throw err;

        note.isEmpty = false;
        note.data = {
            name: req.query.name,
            time: new Date(),
            report: req.query.report
        }
        note.save(function(err: Error) {
            if (err) throw err;
            res.send({msg: 'succes'});
        });
    })
});

app.get('/write', function (req, res) {
    //notes by doc
    Note.findById(req.query.id, function (err: Error, data: Array<object>) {
        res.send(data)
    })
});

app.listen(3001, function () {
    console.log('App is listening on port 3001!');
});
