import logo from './logo.svg';
import './App.css';
import menubar from './components/menubar';
import { useCallback, useRef,useEffect,useLayoutEffect, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm'
import { type } from '@testing-library/user-event/dist/type';

const generator=rough.generator();

function createElement(x1,y1,x2,y2,col){
  const roughElement=generator.line(x1,y1,x2,y2, {stroke: col});
  return {x1,y1,x2,y2,roughElement};
}
function createElement2(x1,y1,x2,y2,col){
  const roughElement=generator.rectangle(x1,y1,x2-x1,y2-y1,{stroke:col});
  return {x1,y1,x2,y2,roughElement};
}

const useHistory=initialState=>{
  const [index,setIndex]=useState(0);
  const [history,setHistory]=useState([initialState]);
  const setState = (action, overwrite = false) => {
    const newState = typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex(prevState => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex(prevState => prevState - 1);
  const redo = () => index < history.length - 1 && setIndex(prevState => prevState + 1);

  return [history[index], setState, undo, redo];
};

function App() {
  const[elements, setElements,undo,redo]=useHistory([]);
  const[drawing,setDrawing]=useState(false);
  
  const canvasRef=useRef(null);
  const ctx=useRef(null);
  const colors=[
    'Black','Red','Yellow','Green','Blue','Pink','Grey','Gold','lightblue',"lightgreen"
  ];

  const task=["pen","rectangle","line"];

  const [selectedTask,setSelectedTask]=useState(task[0]);
  //const selectedTask=task[tnum];
  const [selectedcolor, setSelectedColor]=useState(colors[0]);
  const [mouseDown,setMouseDown]=useState(false);
  const [lastPosition,setPosition]=useState({
    x:0,
    y:0
  });

  const draw=useCallback((x,y)=>{
    if(mouseDown)
    {
      ctx.current.beginPath();
      ctx.current.strokeStyle=selectedcolor;
      ctx.current.lineWidth=5;
      ctx.current.lineJoin="round";
      ctx.current.moveTo(lastPosition.x,lastPosition.y);
      ctx.current.lineTo(x,y);
      ctx.current.closePath();
      ctx.current.stroke();

      setPosition({
        x,y
      });
    }
  },[lastPosition,mouseDown,selectedcolor,setPosition])

  // const drawRect = (e,x,y) => {
  //   //const {lastPosition.x,lastPosition.y,x,y } = info;
  
  //     // x2= lastPosition.x,
  //     // y2= lastPosition.y
  //  if(mouseDown)
  //   {}
  //   else
  //   {
  //   ctx.beginPath();
  //   ctx.strokeStyle = 'black';
  //   ctx.lineWidth = 10;
  //   ctx.rect(x, y, e.pageX,e.pageY);
  //   ctx.stroke();
  //  }
  // }

  const onMouseDown=(e)=>{
    // setDrawing(true);
    setMouseDown(true);
    if(selectedTask!=task[0]){
    const {clientX,clientY}=e;
    const element=createElement(clientX-108,clientY-49,clientX-108,clientY-49,selectedcolor);
    setElements(prevState => [...prevState, element]);
    }

    setPosition({
      x: e.pageX-108,
      y: e.pageY-49
    })
  }

  const onMouseUp=(e)=>{
    setMouseDown(false)
  }

  const onMouseMove=(e)=>{
    if(selectedTask==task[0]){
      draw(e.pageX-108,e.pageY-49);
    }
    if(selectedTask==task[1]){
      if(!mouseDown) return;
      const {clientX,clientY}=e;
      //console.log(clientX,clientY);
  
      const index=elements.length-1;
      const{x1,y1}=elements[index];
      const updatedElement=createElement2(x1,y1,clientX-108,clientY-49,selectedcolor);
  
      const elementsCopy=[...elements];
      elementsCopy[index]=updatedElement;
      setElements(elementsCopy,true);
      }
    if(selectedTask==task[2]){
    if(!mouseDown) return;
    const {clientX,clientY}=e;
    //console.log(clientX,clientY);

    const index=elements.length-1;
    const{x1,y1}=elements[index];
    const updatedElement=createElement(x1,y1,clientX-108,clientY-49,selectedcolor);

    const elementsCopy=[...elements];
    elementsCopy[index]=updatedElement;
    setElements(elementsCopy,true);
    }
  }
  

  useEffect(() => {
    //  if(canvasRef.current)
    // {
      const canvas=document.getElementById('canvas');
      ctx.current=canvasRef.current.getContext('2d');
      ctx.current.clearRect(0,0,canvas.width,canvas.height);
      const roughCanvas=rough.canvas(canvas);

      
      elements.forEach(({roughElement})=>roughCanvas.draw(roughElement));
},[elements]);
  // useLayoutEffect(()=>{
  //   const canvas=document.getElementById("canvas");
  //   const ctx=canvas.getContext("2d");
  //   ctx.fillStyle="green";
  //   ctx.fillRec(300,300,400,400);

  // });

  const clear=()=>{
    window.location.reload(false);
    //ctx.current.clearRect(0,0,ctx.current.canvas.width,ctx.current.canvas.height);
  }

  const download= async()=>{
    const imgg=canvasRef.current.toDataURL('painting/png');
    const blob=await( await fetch(imgg)).blob();
    const blobURL=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=blobURL;
    link.download="painting.png";
    link.click();
  }

  // const updateTask=(e)=>{
  //   selectedTask=task[tt];
  // }





  return (
    <div>
    <div className='container'
      style={{
        border:"2px solid #000",
        padding: "2px",
        margin: "5px",
        height:"30px",
        width:"600px",
      }}>
        <button style={{
          padding:"2px",background:"lightblue", padding:"4px",margin:"2px",width:"60px"
        }}>New</button>
        <button 
        onClick={download}
        style={{padding:"2px",background:"lightblue", padding:"4px",margin:"2px",width:"60px"
        }}>Save</button>
      </div>
      
      <div style={{display:"flex"}}>
        <div
          style={{
          border: "2px solid #000",
          padding: "2px",
          margin: "5px",
          marginTop:"0px",
          width: "80px",
          height: "500px"
          }}>
          <button 
          onClick={()=>setSelectedTask(task[0])}
          style={{
          padding:"2px",background:"lightblue", padding:"4px",margin:"2px",width:"75px"
          }}>Pen</button>
          
          <button 
          onClick={()=>setSelectedTask(task[2])}
          style={{
          padding:"2px",background:"lightblue", padding:"4px",margin:"2px",width:"75px"
          }}>Line</button>
          
          <button 
          onClick={()=>setSelectedTask(task[1])}
          style={{
          padding:"2px",background:"lightblue", padding:"4px",margin:"2px",width:"75px"
          }}>Rectangle</button>
          
          <select value={selectedcolor}
           onChange={(e) =>setSelectedColor(e.target.value)}
           style={{ padding:"2px",background:"white", padding:"4px",margin:"2px",width:"75px"
         }}>
            {
              colors.map(
                color=><option key={color} value={color}>{color}</option>
              )
            }
          </select>
          
          <button 
          onClick={undo}
          style={{
          padding:"2px",background:"lightblue", padding:"4px",margin:"2px",width:"75px"
          }}>Undo</button>
          
          <button
          onClick={redo}
          style={{
          padding:"2px",background:"lightblue", padding:"4px",margin:"2px",width:"75px"
          }}>Redo</button>
          <button 
          onClick={clear}
          style={{
          padding:"2px",background:"lightblue", padding:"4px",margin:"2px",width:"75px"
          }}>Clear</button>
        </div>
        <canvas
        id="canvas"
        style={{
        border: "2px solid #000",
        padding: "2px",
        margin: "5px",
        marginTop:"0px"
        }}
      width={500}
      height={500}
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    />
      </div>
    </div>
  );
}

export default App;
