import React from 'react'

const Createchannel = () => {
  return (
    <div>
        <h3 style={{fontFamily:"cursive"}}>Create Channel</h3><br></br>
        <label htmlFor="Title"style={{fontFamily:"cursive"}} >Channel Name:</label><br></br><br></br>
        <input type="text" placeholder='Name' style={{border:"1px solid red", borderRadius:"5px",padding:"5px"}}/><br></br><br></br><br></br>
        <label htmlFor="Channel"style={{fontFamily:"cursive"}} >Channel Description:</label><br></br><br></br>
        <textarea placeholder='Description' style={{border:"1px solid red", borderRadius:"5px",width:"200px",height:"100px"}}/><br></br><br></br>
        <button style={{color:"Whitesmoke",backgroundColor:'red',padding:"4px" ,marginRight:"100px"}}>Cancel</button>
        <button style={{color:"Whitesmoke",backgroundColor:'red',padding:"4px"}}>Create Channel</button>
    </div>
  )
}

export default Createchannel; 
