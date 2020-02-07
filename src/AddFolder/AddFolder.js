// this.context.addFolder <-- event handler in App
import React from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddFolder.css';

export default class AddFolder extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            name: {
                value: ''
              }
        };
    }

    updateName(name) {
        // event.target.value of the input
        // Whenever the user types anything into the input, we update the state! each letter at a time!
        this.setState({name: {value: name}});
        console.log(name);
      }
     
    validateName() {
        // this removes any whitespace from value and makes sure the value isn't an empty string
        const name = this.state.name.value.trim(); 
        if(name.length === 0) {
            return 'Please enter a folder name';
        } else if(name.length > 30) {
            return 'Please keep the folder name under 30 characters; brevity is the soul of wit.'
        }

    }

    handleSubmit(event){
        event.preventDefault();
        // const { name, password, repeatPassword } = this.state;
        const name = this.state;
        console.log('Name: ', name);

        // potentially submit these values to the server here

    }

    // render the page. 
    // Get user input from page
    // use that input to make a POST fetch request
    // do error handling
    render() {
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
                    onChange={e => this.updateName(e.target.value)}
                    required/>
                </div>

        
                <div className="AddFolder__button__group">
                    <button type="reset" className="AddFolder__button">
                        Cancel
                    </button>
                    <button type="submit" className="AddFolder__button">
                        Save
                    </button>
                </div>
          </form>
        );
    }
}