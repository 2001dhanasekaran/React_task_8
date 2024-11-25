import { EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import './style.css'
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


const appToaster = Toaster.create({
    position:"TOP",
  });
export default function Status(){
    const [title,setTitle]=useState([]);
    const [newTitle,setNewtitle]=useState("");
    const [newStatus,setNewStatus]=useState("");

    useEffect(()=>{
        fetch('https://jsonplaceholder.typicode.com/todos/')
        .then(response => response.json())
        .then(json => setTitle(json))
        .catch(error => console.error("Error fetching data:", error)); // Error handling
    },[]);

    function addUser(){
        if(newTitle && newStatus){
            const id= title.length > 0 ? Math.max(...title.map((titles)=>titles.id))+1:1;
            const userId=title.length>0 ? Math.max(...title.map((titles)=>titles.userId))+1:1;
            fetch('https://jsonplaceholder.typicode.com/todos/',{
                method:"POST",
                body:JSON.stringify({
                    id,
                    userId, 
                    title : newTitle, 
                    completed: newStatus
                }),
                headers:{
                    "Content-Type":"application/json; charset=UTF-8",
                }
            })
            .then((response)=>response.json())
            .then((data)=>{
                setTitle([...title,{...data, id}]);

                appToaster.show({
                    message:"New user added",
                });
                setNewtitle("");
                setNewStatus("");
            })
            .catch(error => console.error("Error adding user:", error)); // Error handling
        }
    }
    function changeHandle(id,key,value){
        setTitle((title)=>{
            return title.map(titles=>{
                return titles.id=== id? {...titles,[key]: value}: titles;
            })
        })
    }
    function update(id){
        const titles=title.find((titles)=>titles.id === id);
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`,{
            method:"PUT",
            body:JSON.stringify(titles),
            headers:{
                "Content-Type":"application/JSON: charset-UTF-8"
            }
        }

        )
        .then((response)=>response.json())
        .then((data)=>{
            appToaster.show({
                message:"User status updated!",
                intent:'success'
            })
        })
        .catch(error => console.error("Error updating user:", error)); // Error handling
    }

    function Delete(id){
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`,{
            method:"delete",
            headers:{
                "Content-Type":"application/JSON; charset-UTF-8"
            }
        })
        .then((response)=>response.json())
        .then(()=>{
            setTitle((titles)=>{
                return title.filter(titles=>titles.id!==id)
            })
            appToaster.show({
                message:"User deleted!",
                intent:"danger",
                timeout:3000
            })
        })
        .catch(error => console.error("Error deleting user:", error)); // Error handling
    }

    return(
        <div className="container">
            <div><h2>Users completion status</h2></div>
            <table className='table table-light table-striped' style={{
                textAlign:'center',
            }} >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Title</th>
                        <th>Completed</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{title.map(titles=>
                    <tr key={titles.id}>
                        <td>{titles.id}</td>
                        <td>{titles.userId}</td>
                        <td><EditableText value={titles.title} onChange={value=>changeHandle(titles.id,'title',value)}/></td>
                        <td>
                            <input type='checkbox' checked={titles.completed} onChange={e=>changeHandle(titles.id, 'completed', e.target.checked)}/>

                        </td>
                        <td style={{
                            display:'inline-flex'
                        }}>
                            <button className="btn btn-outline-primary" onClick={()=>update(titles.id)}>Edit</button>
                            <button className="btn btn-outline-danger" onClick={()=>Delete(titles.id)}>Del</button>
                        </td>
                    </tr>
                )}
                    <tr></tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td><InputGroup 
                        value={newTitle}
                        onChange={(e)=>setNewtitle(e.target.value)}
                        placeholder="Title"
                        /></td>
                        <td><InputGroup 
                        value={newStatus}
                        onChange={(e)=>setNewStatus(e.target.value)}
                        placeholder="Status"
                        /></td>
                        <td>            
                            <button className="btn btn-outline-success" onClick={addUser}>Create</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}