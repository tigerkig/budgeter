function WelcomeWizard(props) {
  
    return (
        
            props.welcomeWizard === 'on' ? (
              <>
              {/* Welcome Wizard Configuration */}
              {/* Welcome wizard background overlay */}
              <div className="wizardOverlay"></div>
              
              {/* Welcome wizard menu */}
              <div role="Welcome wizard setup" className="wizardMenu">
                <h2 className="wizard">Welcome to Budgeter!</h2>
    
                <p className="wizardopac">
                  Greetings, <span className="italic bold">stranger</span>!
                </p>
    
                <p className="wizardopac">
                  Within the toolbox menu you have the option to either add an income or expense to your budget sheet by simply filling out one of the forms with a description and an amount followed by clicking <span className="italic bold">"Add income"</span> or <span className="italic bold">"Add expense"</span>
                </p>
    
                <p className="wizardopac">
                  The summary menu will summarize and calculate your <span className="italic bold">total savings</span> by taking your total income and subtracting your expenses to give you the final balance.
                </p>
    
                <p className="wizardopac">
                  Pretty straight forward, right? Before we begin tracking our finances, let us know what your prefered name is!
                </p>
    
                {/* Welcome wizard form to set username and import existing balance sheet from another computer */}
                <form aria-label="Welcome wizard form" onSubmit={props.handleUserSubmit}>
    
                  <div className="grid opac">
                    <div className="italic">Items with (*) are required</div>
                    <div></div>
                  </div>
    
                  <div id="name" className="grid twohalf wizardopac">
                    <label id="usernameLabel" for="username"><span className="bold">Prefered name (*)</span></label>
                    <input className="wizardInput" id="username" name="username" type="text" value={props.user} onChange={props.handleUserChange} placeholder="Username"></input>
                  </div>
    
                  <div className="grid twohalf wizardopac">
                    <label for="importUid"><span className="bold">Import existing Budgeter ID</span></label>
                    <input className="wizardInput" id="importUid" name="importUid" type="text" value={props.importUid} onChange={props.handleImportUid} placeholder="budgeter-kwcot6uzyz41njxvwkn"></input>
                  </div>
    
                  <div className="grid three">
                    <div></div>
                    <div></div>
                    <button aria-label="Submit username and existing budgeter id" className="wizardButton bold">Finish</button>
                  </div>
    
                </form>
              </div>
              </>
            ) : (
              <div></div>
            )
          
    )

}

export default WelcomeWizard