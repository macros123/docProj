import React, {useEffect, useState} from 'react';
import './App.css';

const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};
function App() {
  const [selectDate, setSelectDate] = useState([{date: '2020-08-21T13:22:25.799Z'}, {date: '2020-09-21T13:22:25.799Z'}]);

  useEffect(() => {

    fetch('http://localhost:3001/days', requestOptions)
        .then(response => response.json())
        .then(data => {
          const tmp = data.slice();
          tmp.unshift({date: 'pick'});
          return setSelectDate(tmp)
        });

  }, []);

  function dayChangeHandler(e:any): void {
      console.log(e.target.value)

      fetch(`http://localhost:3001/docs?day=${e.target.value}`, requestOptions)
          .then(response => response.json())
          .then(data => {
              console.log(data)
          });
    };

    const options = selectDate.map((e, i) => {
        return <option value={e.date} key={i}>{e.date}</option>;
    })
  return (
    <div className="App">
      <label htmlFor="cars">Choose a day:</label>
      <select id="cars" name="cars" onChange={dayChangeHandler}>
          {options}
      </select>
    </div>
  );
}

export default App;
