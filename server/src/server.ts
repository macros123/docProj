import express from 'express';
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
import func from './fillTheBase';

// Create a new express app instance
mongoose.connect('mongodb://127.0.0.1/test', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
const Schema = mongoose.Schema;

const daySchema = Schema({
    _id: Schema.Types.ObjectId,
    date: Date,
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]
})
const doctorSchema = Schema({
    _id: Schema.Types.ObjectId,
    id: Number,
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
    docId: Number,
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



////////////GET DAYS FOR PARAM
app.get('/days', function (req, res) {
    //Get days 
    console.log(`request get /days`, req.body)
    Day.find({}, function (err: any, data: any) {
        res.send(data)
    })
});

////////////GET DOCTORS
app.get('/docs', function (req, res) {
    //Get doctors by day
    Doctor.find({}, function (err: any, data: any) {
        res.send(data)
    })
});

////////////GET NOTES FOR SECOND PAGE
app.get('/oneday', function (req, res) {
    //notes by doc and day
    Note.find({docId: req.query.docId, date: req.query.day}, function (err: any, data: any) {
        res.send(data)
    })
});

////////////GET NOTES FOR PARAM
app.get('/notesd', function (req, res) {
    //notes by doc
    Note.find({docId: req.query.docId}, function (err: any, data: any) {
        res.send(data)
    })
});

////////////POST NOTES FOR PARAM
app.post('/write', function (req, res) {
    //notes by doc
    Note.findById(req.body.id, function (err: any, note: any) {
        if (err) throw err;

        note.isEmpty = false;
        note.data = {
            name: req.body.name,
            time: new Date(),
            report: req.body.report
        }
        note.save(function(err: any, data: any) {
            if (err) throw err;             
            res.send('success');
        });
    })
});

app.get('/write', function (req, res) {
    //notes by doc
    Note.find({_id: '5f3ebe582c3e891324b0922d'}, function (err: any, data: any) {
        res.send(data)
    })
});














type timeDoc = {
    doctors: Array<object>,
    days: Array<object>
}
app.post('/notess', function (req, res) {
    //Get doctors by day
    const response: timeDoc = {doctors: [], days: []};
    Doctor.find({}, function (err: any, data: any) {
        response.doctors = data
        Day.find({}, function (err: any, data1: any) {
            response.days = data1
            func.fillNotes(response, Note);
            res.send('ok')
        })
    })
});

app.post('/addd', function (req, res) {

    func.fillDays(Day, Doctor, Note, 5);
    res.send('База заполнена');

});

app.listen(3001, function () {
    console.log('App is listening on port 3001!');
});
