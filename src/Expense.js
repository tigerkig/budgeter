import firebase from './firebase'; // firebase (database configuration)

function Expense(props) {

    // function to remove a row. I tried making a child component to condense my code but had problems calling the component function within an onClick button event
    const removeRow = (whatToRemove) => {
        // make connection to db
        const dbRef = firebase.database().ref(`/${props.userId}`);
        
        // use new firebase method to remove an item
        dbRef.child(whatToRemove).remove();
    }
    

    return (
        <div role="Expense data">
          <fieldset>
            <legend>
              {/* section title */}
              <h2 className="bottom">Expenses <span aria-label="total expense amount" className="span lightColor">total ${props.totalExpense}</span></h2>
            </legend>

            {/* table titles */}
            <div className="header grid four">
                <div className="title">Date</div>
                <div className="title">Description</div>
                <div className="title">Amount ($)</div>
                <div></div>
            </div>
          
            {
              props.expenses.map((expense) => {
                return (
                  <form aria-label="Display expense data with a remove expense option" onSubmit={props.handleSubmit}>
                    <div className="item grid four">
                        <div>{expense.date}</div>
                        <div>{expense.description}</div>
                        <div>{expense.amount}</div>
                        <div><button aria-label="Remove expense" className="changeButton" onClick={ () => removeRow(expense.id) }><i className="fas fa-times"></i></button></div>
                    </div>
                  </form>
                )
              })
            }
          </fieldset>
        </div>
    )
}

export default Expense