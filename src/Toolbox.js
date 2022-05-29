function Toolbox(props) {

    return (

        <div role="toolbox menu" id="toolboxMenu" className="table settings">
            <h2 className="top">Toolbox</h2>

            <div className="grid one">

            {/* row 1 */}
            <div role="header labels for form">
                <div className="toolboxForm" onSubmit={props.addIncome}>
                <div className="color bold">Description</div>
                <div className="color bold">Amount ($)</div>
                <div></div>
                </div>
            </div>

            {/* row 2 */}
            <div>
                <form aria-label="Create income form" id="toolboxForm" className="toolboxForm" onSubmit={props.addIncome}>
                    <label for="description" className="sr-only">Income description</label>
                    <input className="inputField" type="text" id="description" name="description" value={props.userInputIncome.description} onChange={props.handleIncomeChange} placeholder="e.g Paycheck"></input>
                    <label for="amount" className="sr-only">Income amount</label>
                    <input className="inputField" type="integer" id="amount" name="amount" value={props.userInputIncome.amount} onChange={props.handleIncomeChange} placeholder="0"></input>
                    <button aria-label="Submit income" className="actionButton" value='income' id="newIncome">Add income</button>
                </form>
            </div>

            {/* row 3 */}
            <div>
                <form aria-label="Create expense form" id="toolboxForms" className="toolboxForm" onSubmit={props.addExpense}>
                    <label for="description" className="sr-only">Expense description</label>
                    <input className="inputField" type="text" id="descriptions" name="description" value={props.userInputExpense.description} onChange={props.handleExpenseChange} placeholder="e.g Rent"></input>
                    <label for="amount" className="sr-only">Expense amount</label>
                    <input className="inputField" type="integer" id="amounts" name="amount" value={props.userInputExpense.amount} onChange={props.handleExpenseChange} placeholder="0"></input>
                    <button aria-label="Submit expense" className="actionButton" value='expense' id="newExpense">Add expense</button>
                </form>
            </div>

            </div>
        </div>
        
    )

}

export default Toolbox