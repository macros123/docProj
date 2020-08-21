
const mongoose =  require('mongoose');

const Schema = mongoose.Schema;
const fillDaysDocs = (Day: any, Doctor: any, Note: any, count: number): void => {
    const doctors = [
        'Школвский Борис Елизарович',
        'Воронова Татьяна Ильевна',
        'Барсова Лилия Олеговна',
        'Барсова Лилия Олеговна'
    ];
    for(let i in doctors) {
        const doc = new Doctor({
            _id: new mongoose.Types.ObjectId(),
            id: i,
            name: doctors[i],
        });
        doc.save(function (err: Error) {
            if (err) {
                console.log('qwert!');
            }
        })
    }

    const today = new Date();
    const tomorrow = new Date(today);
    for(let i = 0; i < count; i++) {
        const oneDay = new Day({
            _id: new mongoose.Types.ObjectId(),
            date: tomorrow.setDate(tomorrow.getDate() + 1),
        });

        oneDay.save(function (err: Error) {
            if (err) {
                console.log('errror!');
                return;
            }
            tomorrow.setDate(tomorrow.getDate() + 1)
        })
    }
}

const fillNotes = (data: any, Note: any): void => {
    const doctors = data.doctors;
    const days = data.days;
    for(let x of doctors) {
        for (let y of days) {
            for(let i = 9; i < 18; i+=0.5) {
                const note = new Note({
                    _id: new mongoose.Types.ObjectId(),
                    isEmpty: true,
                    time: Math.round(i-i%1).toString().padStart(2, '0').concat( (i%1 > 0) ? '-30' : '-00'),
                    docId: x.id,
                    date: y.date,
                    data: {
                        name: '',
                        time: new Date(),
                        report: ''
                    }
                });
                note.save();
            }
        }
    }

}
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
export default {fillDaysDocs, fillNotes, daySchema, doctorSchema, noteSchema};
