import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const App = () => {

  const  [jockes, setJockes]=useState([]);


  useEffect (()=>{
    axios.get('/api/jockes')
    .then((response)=>{
      console.log(response.data);
      setJockes(response.data)
    }
  )

  .catch((error)=>{
    console.error('Error fetching jockes:', error);
  } );
  },[]); 

  return (
    <div>
      <h1>Welcome to Vite</h1>
      <p> Jockes: {jockes.length}</p>

      {
        jockes.map((jock,index)=>{
          return (  
          <div key= {jock.id}>
            <h3> {jock.title}</h3>
            <p>{jock.content}</p>
             </div>
        )})
      }
    </div>
  )
}

export  default App ;
