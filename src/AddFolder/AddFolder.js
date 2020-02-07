// this.context.addFolder <-- event handler in App
import React from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddFolder.css';
import ValidationError from '../ValidationError';

export default class AddFolder extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            name: {
                value: '',
                touched: false
              }
        };
    }

    static contextType = ApiContext;
    
    updateName(name) {
        // Whenever the user types anything into the input, we update the state! each letter at a time!
        // When the user types ANYTHING we set the value of touched to "true" from "false" this way we know
        // when to correctly render our ValidationError
        this.setState({name: {value: name, touched: true}});
      }
     
    validateName() {
        // this removes any whitespace from value and makes sure the value isn't an empty string
        const name = this.state.name.value.trim(); 
        if(name.length === 0) {
            return 'Please enter a folder name';
        } else if(name.length > 25) {
            return 'Please keep the folder name under 25 characters; brevity is the soul of wit.'
        }
    }

    handleSubmit(event){
        event.preventDefault();
 
        const data = {name: this.state.name.value};

          fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => {
            if (!res.ok) {
              throw new Error(`Error with POST request: ${res}`);
            }
            return res.json();
          })
          .then((resp) => {
            this.context.addFolder(resp);
            this.props.history.push('/');
          })
          .catch(err => {
            console.log(err.message);
          });

    }

    // render the page. 
    // Get user input from page
    // use that input to make a POST fetch request
    // do error handling
    render() {
        const nameError = this.validateName();
        
        return (
            <form className="AddFolder" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add a New Folder</h2>
                <div className="AddFolder__hint">* required field</div>  
                <div className="form-group">
                <label htmlFor="add-folder-name">Folder name *</label>
                <input 
                    type="text" 
                    className="AddFolder__control"
                    name="add-folder-name" 
                    id="add-folder-name"
                    // Each time the user types anything into input, we update the state. This allows real-time error messages (ie before submit)
                    onChange={e => this.updateName(e.target.value)}
                    required/>
                {/* Conditional rendering depending on whether the user has changed the input or not */}
                {this.state.name.touched && (<ValidationError message={nameError} />)}
                </div>

        
                <div className="AddFolder__button__group">
                    <button type="reset" className="AddFolder__button">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="AddFolder__button"
                        // if anything triggers our validation method, the button gets disabled
                        disabled={this.validateName()}>
                        Save
                    </button>
                </div>
          </form>
        );
    }
}