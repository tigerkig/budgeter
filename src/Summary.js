function Summary(props) {

    return (

        <div role="summary menu" id="summaryMenu" className="table settings">
          <h2 className="top">Summary <span aria-label="budgeter id" className="span darkColor">{props.userId}</span></h2>

          <div className="grid two">

            {/* row 1 */}
            <div className="color bold">Income</div>
            <div className="color">{props.totalIncome}</div>

            {/* row 2 */}
            <div className="color bold">Expense</div>
            <div className="color">{props.totalExpense}</div>

            {/* row 2 */}
            <div class="break"></div>
            <div class="break"></div>

            {/* row 3 */}
            <div className="color bold">Total savings</div>
            
              {
                props.totalSavings <= 0 ? (
                  <div className="negative">${props.totalSavings}</div>
                ) : (
                  <div className="positive">${props.totalSavings}</div>  
                )
              }
            
          </div>
        </div>

    )
    
}

export default Summary