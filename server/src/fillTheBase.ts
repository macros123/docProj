
const mongoose =  require('mongoose');

const fillDay = (Note: any, doc: any, date: Date): void => {
    for(let i = 9; i < 18; i+=0.5) {
        const note = new Note({
            _id: new mongoose.Types.ObjectId(),
            isEmpty: true,
            time: Math.round(i-i%1).toString().padStart(2, '0').concat( (i%1 > 0) ? '-30' : '-00'),
            docId: doc,
            date: date,
            data: {
                name: '',
                time: new Date(),
                report: ''
            }
        });
        note.save();
    }
}

const fillDoctorDay = (Doctor: any, Note: any, date: Date): void => {
    const doctors = [
        'Школвский Борис Елизарович',
        'Воронова Татьяна Ильевна',
        'Барсова Лилия Олеговна',
        'Барсова Лилия Олеговна'
    ];

    for(let i of doctors) {
        const doc = new Doctor({
            _id: new mongoose.Types.ObjectId(),
            date: date,
            name: i,
        });
        doc.save(function (err: any) {
            if (err) {
                console.log('qwert!');
                return;
            }
            fillDay(Note, doc._id, date);
        })
    }

}

const fillDays = (Day: any, Doctor: any, Note: any, count: number):void => {

    const today = new Date();
    const tomorrow = new Date(today);
    for(let i = 0; i < count; i++) {
        const oneDay = new Day({
            _id: new mongoose.Types.ObjectId(),
            date: tomorrow.setDate(tomorrow.getDate() + 1),
        });

        oneDay.save(function (err: any) {
            if (err) {
                console.log('errror!');
                return;
            }
            tomorrow.setDate(tomorrow.getDate() + 1)
            fillDoctorDay(Doctor, Note, oneDay.date);
        })
    }

}
export default fillDays;
