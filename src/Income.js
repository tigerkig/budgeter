import firebase from './firebase'; // firebase (database configuration)

function Income(props) {

    // function to remove a row. I tried making a child component to condense my code but had problems calling the component function within an onClick button event
    const removeRow = (whatToRemove) => {
        // make connection to db
        const dbRef = firebase.database().ref(`/${props.userId}`);
        
        // use new firebase method to remove an item
        dbRef.child(whatToRemove).remove();
      }


    return (
        <div role="Income data">
          <fieldset>
            <legend>
              {/* section title */}
              <h2 className="bottom">Incomes <span aria-label="total income amount" className="span lightColor">total ${props.totalIncome}</span></h2>
            </legend>
          
            {/* table titles */}
            <div className="header grid four">
                <div className="title">Date</div>
                <div className="title">Description</div>
                <div className="title">Amount ($)</div>
                <div></div>
            </div>

            {
              props.incomes.map((income) => {
                return (
                  <form aria-label="Display income data with a remove income option" onSubmit={props.handleSubmit}>
                    <div className="item grid four">
                        <div>{income.date}</div>
                        <div>{income.description}</div>
                        <div>{income.amount}</div>
                        <div><button aria-label="Remove income" className="changeButton" onClick={ () => removeRow(income.id) }><i className="fas fa-times"></i></button></div>
                    </div>
                  </form>
                )
              })
            }

          </fieldset>          
        </div>
    )
}

export default Income