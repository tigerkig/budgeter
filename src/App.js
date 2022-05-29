import './App.css';
import { useEffect, useImperativeHandle, useState } from 'react';
import firebase from './firebase'; // firebase (database configuration)
import raw from './list.txt'; // profanity list! >:)
import { createPortal } from 'react-dom';

// view components
import Toolbox from './Toolbox';
import Summary from './Summary';
import Income from './Income';
import Expense from './Expense';
import WelcomeWizard from './WelcomeWizard';



function App() {

  // welcome wizard
  const [wizard, setWizard] = useState('');
  const [user, setUser] = useState('');
  const [importUid, setImportUid] = useState('');

  // income stuff
  const [incomes, setIncome] = useState([]);
  const [userInputIncome, setUserInputIncome] = useState({
    description: "",
    amount: "",
    date: "",
    type: ""   
  });
  const [totalIncome, setTotalIncome] = useState(0);

  // expense stuff
  const [expenses, setExpense] = useState([]);
  const [userInputExpense, setUserInputExpense] = useState({
      description: "",
      amount: "",
      date: "",
      type: ""
  });
  const [totalExpense, setTotalExpense] = useState(0);

  // total savings
  const [totalSavings, setTotalSavings] = useState(0);

  // function to create a unique uid
  const uid = function(){
    return 'budgeter-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /*
  local storage properies
  -> set userId to a uid generated with uid function if not created already
  -> set welcomeWizard to 'on' when site first initializes
    -> when the user finishes the wizard then welcomeWizard is set to 'off'
  -> during the welcome wizard set up we set username to 'user' until the user
     inputs a username of their choice
  */

  // set new userId to localstorage only if there isnt already a userId
  if(!localStorage.getItem("userId")) {
    // Generate new id 
    const userId = uid();

    // using localstorage will set a unique userId to be used for a unique user experience
    localStorage.setItem("userId", userId);
  }
  // store userId in a variable for later use
  const userId = localStorage.getItem("userId");

  // set new welcomeWizard property to localstorage only if there isnt already one
  if(!localStorage.getItem("welcomeWizard")) {

    // for better user experience we will create a welcome wizard
    localStorage.setItem("welcomeWizard", 'off');
  }
  // store welcomeWizard in a variable for later use
  const welcomeWizard = localStorage.getItem("welcomeWizard");

  // set new userId to localstorage only if there isnt already a cartId
  if(!localStorage.getItem("budgeterUser")) {

    // using localstorage will set a unique userId to be used for a unique user experience
    localStorage.setItem("budgeterUser", 'Stranger');
  }
  // store userId in a variable for later use
  const username = localStorage.getItem("budgeterUser");

  useEffect(() => {

    // make ref to database
    const dbRef = firebase.database().ref();

    dbRef.on('value', (response) => {

      // variables to store new state
      const newIncome = [];
      const arrayOfIncomes = [];
      let sumIncome = 0;

      const newExpense = [];
      const arrayOfExpenses = [];
      let sumExpense = 0;

      const data = response.val();
      if(data == null) {
        data = [];
      }

      // iterate through database data where index = userId
        for(let property in data[userId]) {

          if(data[userId][property].type == 'income') {
            arrayOfIncomes.push(parseInt(data[userId][property].amount));
          }
          else if(data[userId][property].type == 'expense')
          {
            arrayOfExpenses.push(parseInt(data[userId][property].amount));
          }

          // push to newIncome array if income
          if(data[userId][property].type === 'income') {
            newIncome.push({
              id: property,
              type: data[userId][property].type,
              date: data[userId][property].date,
              description: data[userId][property].description,
              amount: data[userId][property].amount
          })

          // push to newExpense array if expense
          } else {
            newExpense.push({
              id: property,
              type: data[userId][property].type,
              date: data[userId][property].date,
              description: data[userId][property].description,
              amount: data[userId][property].amount
            })
          }      
        }

        // for array of incomes
        for (let i = 0; i < arrayOfIncomes.length; i++) {
          sumIncome += arrayOfIncomes[i]
        }
        setTotalIncome(sumIncome);
        setIncome(newIncome);

        // for array of expenses
        for (let i = 0; i < arrayOfExpenses.length; i++) {
          sumExpense += arrayOfExpenses[i]
        }
        setTotalExpense(sumExpense);
        setExpense(newExpense);

        // total sums of income and expenses
        setTotalSavings(sumIncome - sumExpense);

    }) 

  }, []);

  // remove either an income or expense from the database
  const removeRow = (whatToRemove) => {
    // make connection to db
    const dbRef = firebase.database().ref(`/${userId}`);
    
    // use new firebase method to remove an item
    dbRef.child(whatToRemove).remove();
  }


  const addIncome = (event) => {
    event.preventDefault();
    
    // make db connection
    const dbRef = firebase.database().ref(`/${userId}`);

    // create a timestamp
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();

    // fetch the imported profanity list >:)
    fetch(raw)
    .then(r => r.text())
    .then(text => {
      
      // create an items array which adds each word by new line
      const items = text.split("\n");

      // create error handler
      let errorCheck = 'false';

      // check if description and amount inputs are empty
      if(userInputIncome.amount.trim() === '' || userInputIncome.description.trim() === '') {
        errorCheck = 'true';
        setErrorForm('toolboxForm', 'description', 'Inputs cannot be empty');
      }

      // check if amount input is not a number
      if(isNaN(userInputIncome.amount)) {
        errorCheck = 'true';
        setErrorForm('toolboxForm', 'description', 'Amount must be a number')
      }

      // check if description contains a bad word
      if(items.indexOf(userInputIncome.description.trim()) >= 0) {
        // create error message and exit since we found a bad word
        errorCheck = 'true';
        setErrorForm('toolboxForm', 'description', 'No naughty words pal, nice try');
      }

      // if there are no errors
      if(errorCheck == 'false') {
        // remove any errors if we have one displayed
        unsetError('toolboxForm', 'description', 5);

        // push income to db
        dbRef.push(userInputIncome);

        // clear the inputs
        setUserInputIncome({
          description: "",
          amount: "",
          date: "",
          type: "" 
        });
      }
      
    });
  }

  const addExpense = (event) => {
    event.preventDefault();
    
    // make db connection
    const dbRef = firebase.database().ref(`/${userId}`);

    // create a timestamp
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();

    // fetch the imported profanity list >:)
    fetch(raw)
    .then(r => r.text())
    .then(text => {
      
      // create an items array which adds each word by new line
      const items = text.split("\n");

      // create error handler
      let errorCheck = 'false';

      // check if description and amount inputs are empty
      if(userInputExpense.amount.trim() === '' || userInputExpense.description.trim() === '') {
        errorCheck = 'true';
        setErrorForm('toolboxForms', 'descriptions', 'Inputs cannot be empty');
      }

      // check if amount is not a number
      if(isNaN(userInputExpense.amount)) {
        errorCheck = 'true';
        setErrorForm('toolboxForms', 'descriptions', 'Amount must be a number')
      }

      // check if description contains a bad word
      if(items.indexOf(userInputExpense.description.trim()) >= 0) {
        // create error message and exit since we found a bad word
        errorCheck = 'true';
        setErrorForm('toolboxForms', 'descriptions', 'No naughty words pal, nice try');
      }

      // if there are no errors
      if(errorCheck == 'false') {
        // remove any errors if we have one displayed
        unsetError('toolboxForms', 'descriptions', 5);

        // push expense to db only if properties are not empty
        if(userInputExpense.type === 'expense') {
          dbRef.push(userInputExpense);
        }

        // clear the inputs
        setUserInputExpense({
          description: "",
          amount: "",
          date: "",
          type: "" 
        });
      }

    });
  }



  // updating useState of income description and amount inputs
  const handleIncomeChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // store data passed from add button
    const type = 'income';
    
    // create a timestamp
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();

    // set the data to userInputIncome
    setUserInputIncome({
      ...userInputIncome,
      type: type,
      date: `${cDay}/${cMonth}/${cYear}`,
      [name]: value,
    })

  }

  // updating useState of expense description and amount inputs
  const handleExpenseChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // store data passed from add button
    const type = 'expense';
    
    // create a timestamp
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();

    // set the data to userInputIncome
    setUserInputExpense({
      ...userInputExpense,
      type: type,
      date: `${cDay}/${cMonth}/${cYear}`,
      [name]: value,
    })
  }

  // handle submit for adding income or expense
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // make db connection
    const dbRef = firebase.database().ref(`/${userId}`);

    if(event.target[1].value == 'income') {
      dbRef.child(event.target[0].value).push(userInputIncome);
    }
    else if(event.target[1].value == 'expense')
    {
      dbRef.child(event.target[0].value).push(userInputExpense);
    }
  }

  // update the username field in the welcome wizard
  const handleUserChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // set the data to user
    setUser(value);
  }

  // handle submit for adding a username
  const handleUserSubmit = (event) => {
    event.preventDefault();

    // check for errors within the wizard
    let errorCheck = 'false';

    // fetch the imported profanity list >:)
    fetch(raw)
    .then(r => r.text())
    .then(text => {
      
      // create an items array which adds each word by new line
      const items = text.split("\n")

      // check if username is empty
      if(user.trim() == '') {
        // create error message and exit since we found a bad word
        errorCheck = 'true';
        setErrorWizard('name', 'usernameLabel', 'username', 'Username cannot be empty')
      }

      // check if username contains a bad word
      if(items.indexOf(user) >= 0) {
        // create error message and exit since we found a bad word
        errorCheck = 'true';
        setErrorWizard('name', 'usernameLabel', 'username', 'No naughty words pal, nice try')
      }

      // if there are no errors (username doesn't contain profanity)
      if(errorCheck === 'false') {
        localStorage.setItem("budgeterUser", user);

        // set the importUid if not an empty string
        if(importUid.trim() != '' && importUid.length === 27) {
          localStorage.setItem("userId", importUid);
        }

        // set the data to user
        setWizard('off');

        // set the welcome wizard to 'off'
        if(errorCheck === 'false') {
          localStorage.setItem("welcomeWizard", 'off');

          // set the data to user
          window.location.reload(true)
        }
      }

    });
    
  }

  // import an existing uid field in the welcome wizard
  const handleImportUid = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // set the data to user
    setImportUid(value);
  }

  // create an error message in the welcome wizard
  function setErrorForm(firstId, secondId, message) {
    // remove existing error
    const div = document.getElementById(firstId);
    secondId = document.getElementById(secondId);

    /* 
    to avoid any duplicates im checking if an error is present 
    on the page by checking the document if the class of errorMsg exists
    */
    if(!document.getElementsByClassName('errorMsg').length) {
      // secondId.style.background = '#fbe7f0'

      // since im using 2 grid columns, I need an empty div below the label
      const emptyNode = document.createElement("div");

      // create div which will contain the error
      const node = document.createElement("div");
      node.classList.add('errorMsg');
      node.style.cssText += 'grid-column: 1 / span 3';

      node.innerText = message;

      // append message to new node and append node to parent
      document.getElementById(firstId).appendChild(node);
    } 
  }


  // create an error message in the welcome wizard
  function setErrorWizard(firstId, secondId, thirdId, message) {
    // remove existing error
    const div = document.getElementById(firstId);
    secondId = document.getElementById(secondId);
    thirdId = document.getElementById(thirdId);

    /* 
    to avoid any duplicates im checking if an error is present 
    on the page by checking the document if the class of errorMsg exists
    */

    if(!document.getElementsByClassName('errorMsg').length) {
      thirdId.style.background = '#fbe7f0'

      // since im using 2 grid columns, I need an empty div below the label
      const emptyNode = document.createElement("div");

      // create div which will contain the error
      const node = document.createElement("div");
      node.classList.add('errorMsg');

      node.innerText = message;

      // append message to new node and append node to parent
      document.getElementById(firstId).appendChild(emptyNode); 
      document.getElementById(firstId).appendChild(node);
    } 
  }

  // delete the error message displayed if there are no more errors
  function unsetError(firstId, secondId, children) {
    const div = document.getElementById(firstId);
    secondId = document.getElementById(secondId);

    /*
        if div has more than 3 children (3 inputs + 1 error is 4)
        child[0] is the input
        anything greater needs to be removed
        and background of the input needs to changed back to non error state

    */
    if(div.children.length > children) {
        div.removeChild(div.lastChild);
    }
  }

  return (
    <div className="App">

      {/* Welcome Wizard Setup */}
      <WelcomeWizard 
          welcomeWizard = {welcomeWizard} 
          handleUserSubmit = {handleUserSubmit}
          user = {user}
          handleUserChange = {handleUserChange} 
          importUid = {importUid}
          handleImportUid = {handleImportUid}
        />

      {/* Budgeter header */}
      <h2 className="greeting">Hi {username} 👋</h2>

      {
        welcomeWizard === 'on' ? (
          <h1 className="greeting">Welcome to Budgeter!</h1>
        ) : (
          <h1 className="greeting">Welcome back to Budgeter!</h1>
        )
      }

      {/* Budgeter first row of menus (toolbox and summary) */}
      <main className="row">

        {/* Toolbox menu */}
        <Toolbox 
          addIncome = {addIncome} 
          handleIncomeChange = {handleIncomeChange}
          userInputIncome = {userInputIncome}
          addExpense = {addExpense} 
          handleExpenseChange = {handleExpenseChange}
          userInputExpense = {userInputExpense}
        />

        {/* Summary menu */}
        <Summary 
          totalIncome = {totalIncome} 
          totalExpense = {totalExpense}
          totalSavings = {totalSavings}
          userId = {localStorage.getItem("userId")}
        />

      </main>
      
      <section className="row">

        {/* display income data */}
        <Income 
          totalIncome = {totalIncome} 
          handleSubmit = {handleSubmit}
          userId = {userId}
          incomes = {incomes}
        />
        

        
        {/* display expense data */}
        <Expense 
          totalExpense = {totalExpense} 
          handleSubmit = {handleSubmit}
          userId = {userId}
          expenses = {expenses}
        />

      </section>

      
    </div>
  );
}

export default App;