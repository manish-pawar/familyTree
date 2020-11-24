import React , {Children, useState} from 'react';
import './App.css';
import ChartsFamily from "./ChartsFamily";

function App() {

  const [userdata, setUserData] = useState({ firstName: '', lastName:'', Age: 0, Gender:'', Relation:'' })
  const [userRelation, setUserRelation] = useState({ selectPerson: '', is:'', of:'' });
  const [formToggle, setFormToggle] = useState(true);
  const [chartToggle, setChartToggle] = useState(false);
  
  
  let fTree = localStorage.getItem("FamilyTree");
  
  let nameList12 = JSON.parse(localStorage.getItem("namelistsFamily"));
  
  var data = {}
  
  let errorText = '';
  const onChartsee = () => {
    setChartToggle(true);
  }
  function namIterator(children) {
    
    var names = []
    console.log(children.length)
    if ( children.length === 0){
      return names
    }
    else{

      for(var j = 0; j < children.length; j++)
      {     
            let namelist1 = JSON.parse(localStorage.getItem("namelistsFamily"))
            namelist1.push([`${children[j].userdata.firstName} ${children[j].userdata.lastName}`
                        , children[j].depth , j ]);
            localStorage.setItem("namelistsFamily" , JSON.stringify(namelist1)); 
                      
            
            // var klist = namIterator(children[j].childrens)
            
            var nlist= [...names, namIterator(children[j].childrens).slice()];
            // names.push(namIterator(children[j].childrens));
      }
      return nlist
    }
    
  }
  
  
  const gettingNames = () => {
    var gnTree = JSON.parse(fTree);
    if (Object.keys(gnTree).length !== 0){
        console.log(gnTree)
          let b = []
          localStorage.setItem("namelistsFamily" , JSON.stringify(b)); 
          let namelist11 = JSON.parse(localStorage.getItem("namelistsFamily"));
          namelist11.push([`${gnTree.userdata.firstName} ${gnTree.userdata.lastName}`, 0, 0])
          
          localStorage.setItem("namelistsFamily" , JSON.stringify(namelist11)); 

        
        if ( gnTree.childrens.length > 0){
        
        var children = gnTree.childrens;
        var  Nlist= namIterator(children);
          console.log(Nlist);
        }
    }
    
  };
      
    

  const onGenderChange = (value) => {
    setUserData(  { ...userdata , Gender: value})
  }

  const onAddedData = (e) => {
        e.preventDefault();
        setFormToggle(false);
        setChartToggle(false);
        
        // console.log(JSON.parse(fTree));
        if(fTree !== 'undefined' && fTree !== null){
          gettingNames(); 
          console.log("got");
        }
        else if ( fTree === 'undefined'){
            
          let b = []
          localStorage.setItem("namelistsFamily" , JSON.stringify( b));
          
          localStorage.setItem("FamilyTree",JSON.stringify( {}) )
        }
        // let b = []
        // localStorage.setItem("namelistsFamily" , JSON.stringify( b));
          
        // localStorage.setItem("FamilyTree",JSON.stringify( {}) )
        
  } 
  function childIterator(children, d, d1 , data , s) {
    let dep = children.depth;
    if ( dep === d ){
      console.log(children.childrens)
      console.log(children.childrens[0]);
        children.childrens.forEach((child , index ) => {
          console.log(index)
          console.log(d1)
          if ( index === d1)
          { 
            
            let s1= `${child.userdata.firstName} ${child.userdata.lastName}`
            if(s===s1){ 
              child.childrens.push(data);
              console.log(child);
            }
          }
          else{
            console.log(index)
            childIterator(child, d, d1, data ,s)
          }
        });
      
    }
    else{
      children.childrens.forEach((child , index ) => {
        
          childIterator(child, d, d1, data, s)
      });
    }
    return children;
  }

  function depthUpdater(list) {
       list.depth = list.depth + 1; 
       if ( typeof list.childrens !== 'undefined'){
          list.childrens.forEach((child , index ) => {
            console.log("hello")
            depthUpdater(child)
        
        
          });
       }
  
    return list;

  }
function parentIterator(children, d, d1 , data){
  
  let dep = children.depth;
  if ( dep === d ){
      
    if ( children.childrens.length > 0 ){
      console.log("there")
      children.childrens.forEach((child , index ) => {
        if ( index === d1)
        { 
          
          data.childrens.push(depthUpdater(child))

          children.childrens.splice(index, 1);
          
          children.childrens.push(data);
        }
        else{
          parentIterator(child, d, d1, data)
        }
      });
    }

  }
  else{
    children.childrens.forEach((child , index ) => {
      
        parentIterator(child, d, d1, data)
    });
  }
  return children;
}

  const onAddedRelation = (e) => {
    
    e.preventDefault();
    // setFormToggle(false);
      console.log(userRelation);
      if(userRelation.is === ""){
          errorText = (<div class="alert alert-danger" role="alert">
          Please select your relation
        </div>);
      }
      else if (userRelation.is === "start"){
        console.log("you are starting");
        data = {userdata , childrens: [] , depth: 0 , parent: ''};
        console.log(data);
        const addinTree = JSON.stringify(data);
        localStorage.setItem("FamilyTree", addinTree )

        
        setFormToggle(true);

      }
      else if( userRelation.is === "child"){
        
        var gnTree = JSON.parse(fTree);
        
        setFormToggle(true);

        var num = parseInt(userRelation.selectPerson);
        var data1 = nameList12[num]
        
        data = {userdata , childrens: [] , depth: data1[1] + 1 , parent: ''};
        console.log(data1)
        if (data1[1] === 0){
            
            gnTree.childrens.push(data);
            
          const addinTree = JSON.stringify(gnTree);
          localStorage.setItem("FamilyTree", addinTree );
        }
        else{
              let t = childIterator(gnTree, data1[1] - 1, data1[2]  , data , data1[0]);
              console.log(t)
              
              const addinTree = JSON.stringify(t);
              localStorage.setItem("FamilyTree", addinTree );
        }
        
        
      }else if(userRelation.is === "parent"){
        console.log("parent")
        var gnTree = JSON.parse(fTree);
        
        setFormToggle(true);

        var num = parseInt(userRelation.selectPerson);
        var data1 = nameList12[num]
        data = {userdata , childrens: [] , depth: data1[1] , parent: ''};
        if (data1[1] === 0){
            
            console.log(gnTree)
            let childrenn = gnTree;
            console.log(childrenn)
            
            data.childrens.push(depthUpdater(gnTree));
            console.log(data)



            
            const addinTree = JSON.stringify(data);
            localStorage.setItem("FamilyTree", addinTree );
        }
        else{
              let t = parentIterator(gnTree, data1[1] - 1 , data1[2]  , data);
              console.log(t)
              
              const addinTree = JSON.stringify(t);
              localStorage.setItem("FamilyTree", addinTree );
        }
        
      }
    
    setUserData({ firstName: '', lastName:'', Age: 0, Gender:'', Relation:'' });
    setUserRelation({ selectPerson: '', is:'', of:'' });
} 

  const optionAvailForFirstTime = (

    <select className="form-control" onChange={  e => setUserRelation(  { ...userRelation , is: e.target.value})}>
         <option value="none">Please select</option>
         <option value="start" >Self (As starting point)</option>
    </select>

  );
  const optionAvail = (

    <select className="form-control" onChange={  e => setUserRelation(  { ...userRelation , is: e.target.value})}>
          <option value="">Please select</option>
          <option value="parent" >Parent</option>
          <option value="child">Child</option>
          <option value="start">Self (As starting point)</option>
    </select>
  );
  const nameAvails = (
    
      <select className="form-control" onChange={  e => setUserRelation(  { ...userRelation , selectPerson: e.target.value})}>
          <option value="">Please select</option>
          { (nameList12 !== null  ) && (nameList12.map((item , index) => {
                return (
                    
                    <option value={index} >{ item[0]}</option>
                );
              })
            )
          }
          
    </select>
    
  )
  const nameTaken = (
    
    <select className="form-control" onChange={  e => setUserRelation(  { ...userRelation , of: e.target.value})}>
        <option value="">Please select</option>
        <option value="currentuser">{userdata.firstName} {userdata.lastName}</option>
             
        
  </select>
  
)
  const addingForm = (
    <div className="formBox">
    <div className="card">
    <div className="card-header">
       <h1>Family Tree</h1>
      </div>
      <div className="card-body">
          
      <form onSubmit={onAddedData} >
        <div className="row">
          <div className="col-sm-4">
            <h3>Name</h3>
          </div>
          <div className="col-sm-8">
          <div className="row">
                  <div className="col">
                    <input type="text" className="form-control" placeholder="First name"
                       value={userdata.firstName}  
                       onChange={  e => setUserData( { ...userdata , firstName: e.target.value})}/>
                    <small id="passwordHelpBlock" className="form-text text-muted">First Name</small>
                  </div>
                  <div className="col">
                    <input type="text" className="form-control" placeholder="Last name"
                    value={userdata.lastName}  
                    onChange={  e => setUserData(  { ...userdata , lastName: e.target.value})}/>
                    <small id="passwordHelpBlock" className="form-text text-muted">Last Name</small>
                  </div>
                </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-sm-4">
            <h3>Age</h3>
          </div>
          <div className="col-sm-8">
          
                    <input type="number" className="form-control" placeholder="Enter age" 
                    value={userdata.Age}  
                    onChange={  e => setUserData(  { ...userdata , Age: e.target.value})}/>
                  
          </div>
          
        </div>
        <div className="row mt-3">
          <div className="col-sm-4">
            <h3>Gender</h3>
          </div>
          <div className="col-sm-8 my-2">
          
              <div className="form-check">
              <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1"
               value="male" onChange={() => onGenderChange("male")} />
              <label className="form-check-label" for="exampleRadios1">
                Male
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="exampleRadios" 
              id="exampleRadios2" value="female" onChange={() => onGenderChange("female")}/>
              <label className="form-check-label" for="exampleRadios2">
                Female
              </label>
            </div>
          </div>
          
        </div>
        <div className="row mt-3 mb-3">
          <div className="col-sm-4">
            <h3>Relation</h3>
          </div>
          <div className="col-sm-8">
                    <input type="text" className="form-control" 
                    value={userdata.Relation}  
                    onChange={  e => setUserData( { ...userdata , Relation: e.target.value})} />
                    <small id="passwordHelpBlock" className="form-text text-muted">Enter relation like father , Mother , grandfather etc.</small>
            </div>
            
          </div>
          <div className="card-footer">
          <div className="submit-box">
            <button className="subbutton" type="submit">Submit</button>
          </div></div>

      </form>
      </div>
    </div>


     </div>



  );
  const selectionForm = (

      <div className="formBox" onSubmit={onAddedRelation}>
      <div className="card">
        <div className="card-body">
            
        <form>
          {fTree &&
            <div className="row mt-2">
              <div className="col-sm-4">
                <h3>Select Person</h3>
              </div>
              <div className="col-sm-8">
              
                {nameAvails}
              </div>
            </div>
         }
          <div className="row my-5">
            <div className="col-sm-4">
                {fTree? <h3> is</h3>: <h3>You are the first node</h3>}
            </div>
            <div className="col-sm-8">
            
              {fTree? optionAvail: optionAvailForFirstTime}
          </div>
          </div>
          {fTree &&
            <div className="row my-5">
                <div className="col-sm-4">
                    <h3>of</h3>
                </div>
                <div className="col-sm-8">
                  
                {nameTaken}
                </div>
            </div>
          
          }
          <div className="card-footer">
          <div className="submit-box">
            <button className="subbutton" type="submit">Add</button>
          </div></div>

        </form>
        </div>
      </div>
      </div>


  ) ;
  return (
    <div className="App">
      <button className="the-chart-button" onClick={onChartsee}>see charts</button>
      
      { chartToggle && <p>it's loaded below please find it</p>}
      { formToggle? addingForm:selectionForm}
      { chartToggle && <ChartsFamily/>}
        
    </div>
  );
}

export default App;
