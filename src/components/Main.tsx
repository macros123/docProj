import React, {useEffect, useState} from 'react';
import './Main.css'

const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};
function Main() {
    const [doctors, setDoctors] = useState([]);
    const [notes, setNotes] = useState([]);

    const [param1, setParam1] = useState('');
    const [param2, setParam2] = useState('');

    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    //preload data to parameters
    useEffect(() => {
        //GET DOCTORS
        fetch(`http://localhost:3000/docs`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setDoctors( data)
                setParam1(data[0].id)
            }).
        catch(data => console.log('НЕТУ ФЕТЧА', data));
    }, []);

    //load data after changing parameters
    useEffect(() => {
        //GET NOTES
        getNotes();
    }, [param1]);

    function docChangeHandler(e: any): void {
        setParam1(e.target.value)
    };
    function noteChangeHandler(e:any): void {
        setParam2(e.target.value)
    };

    function handleButtonClick() {
        console.log(param2,input1, input2)
        fetch(`http://localhost:3000/write?id=${param2}&name=${input1}&report=${input2}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.msg);
                getNotes();

            }).catch(e => console.log(e));

    }

    function getNotes() {
        fetch(`http://localhost:3000/notesd?docId=${param1}`, requestOptions)
            .then(response => response.json())
            .then((data:any) => {
                if(data.length > 0) {
                    const filtered = data.filter((e: any) => {return e.isEmpty})
                    setParam2(filtered[0]._id)
                    setNotes(filtered);
                }
            });
    }

    function handleChangeInput(e: any) {
        e.target.name === 'first' ? setInput1(e.target.value) : setInput2(e.target.value);
    }

    const optionsDoc = doctors ? doctors.map((e:any, i:any) => {
        return <option value={e.id} key={i}>{e.name}</option>;
    }) : null
    const optionsNotes = notes ? notes.map((e:any, i:any) => {
        return <option value={e._id} key={i}>{e.time} {e.date.substring(8, 10)}.{e.date.substring(5, 7)}.{e.date.substring(0, 4)}</option>;
    }) : null
    return (
        <form onSubmit={handleButtonClick} className="form">
            <label>
                Выбирете доктора:
                <select id="docs" name="docs" onChange={docChangeHandler}>
                    {optionsDoc}
                </select>
            </label>
            <label>
                Выбирете время:
                <select id="notes" name="notes" onChange={noteChangeHandler}>
                    {optionsNotes}
                </select>
            </label>
            <label className="element" >
                ФИО:
                <input type="text" required value={input1} name="first" onChange={handleChangeInput} />
            </label>
            <label className="element" >
                Введите жалобы:
                <input type="text" required value={input2} name="second" onChange={handleChangeInput} />
            </label>
            <label className="element" >
                <input type="submit" required value="Записаться" />
            </label>
            <a href="./view">Посмотреть записи</a>
        </form>
    );
}

export default Main;
