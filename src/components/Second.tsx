import React, {useEffect, useState} from 'react';

const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};
function Main() {
    const [selectDate, setSelectDate] = useState([{date: '2020-08-21T13:22:25.799Z'}]);
    const [doctors, setDoctors] = useState([]);

    const [param1, setParam1] = useState('');
    const [param2, setParam2] = useState('');

    const [notes, setNotes] = useState([]);
    useEffect(() => {

        fetch('http://localhost:3000/days', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.length > 0) {
                    setParam1(data[0].date);
                    setSelectDate(data);
                }
            });

        fetch(`http://localhost:3000/docs`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.length > 0) {
                    setParam2(data[0].id)
                    setDoctors(data);
                }
            });
    }, []);

    useEffect(() => {
        //GET NOTES
        fetch(`http://localhost:3000/oneday?docId=${param2}&day=${param1}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNotes(data);
            });
    }, [param1, param2]);

    function dayChangeHandler(e:any): void {
        setParam1(e.target.value);
    };
    function docChangeHandler(e:any): void {
        setParam2(e.target.value)
    };

    const optionsDay = selectDate.map((e, i) => {
        return <option value={e.date} key={i}>{e.date}</option>;
    })
    const optionsDoc = doctors ? doctors.map((e:any, i:number) => {
        return <option value={e.id} key={i}>{e.name}</option>;
    }) : null
    const trNotes = notes.map((e: any, i: number) => {
        return <tr key={i}><td>{e.isEmpty? 'Свободно' : 'Занято'}</td><td>{e.time}</td><td>{e.data.name}</td><td>{e.data.report}</td></tr>
    })
    return (
        <div className="form">
            <label>
                Выберете день:
                <select id="days" name="days" onChange={dayChangeHandler}>
                    {optionsDay}
                </select>
            </label>
            <label>
                Выберете врача:
                <select id="docs" name="docs" onChange={docChangeHandler}>
                    {optionsDoc}
                </select>
            </label>
            <table>
                <thead>
                    <tr>
                        <td>Статус</td><td>Время</td><td>ФИО</td><td>Жалобы</td>
                    </tr>
                </thead>
                <tbody>
                    {trNotes}
                </tbody>
            </table>
            <a href="./">Вернуься к записи</a>
        </div>
    );
}

export default Main;
