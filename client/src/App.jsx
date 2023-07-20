import { useEffect, useState } from "react";
import io from "socket.io-client";

// let socket = io("http://localhost:8000");

const socket = io("http://localhost:8000");

function App() {
  let [name, setName] = useState("");
  let [description, setDescription] = useState("");
  let [list,setList] = useState([])

  useEffect(() => {
    socket.on("connected", (message) => {
      console.log(message);
    });
    socket.on("created", (message) => {
      console.log(message);
      setList([...list,message])

    
    });

    socket.on("read", (message) => {
      console.log(message);
      setList(message)
    });


    socket.emit("read")


  }, []);

  

  let handleCreate = () => {
    socket.emit("create", {
      name,
      description,
    });
  };

  return (
    <>
      <input onChange={(e) => setName(e.target.value)} type="text" />
      <input onChange={(e) => setDescription(e.target.value)} type="text" />
      <button onClick={handleCreate}>Submit</button>

      {list.map(item=>(
        <h1>{item.name}</h1>
      ))}
    </>
  );
}

export default App;
