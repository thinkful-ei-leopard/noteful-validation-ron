// this.context.addFolder <-- event handler in App
import React from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddFolder.css';

export default class AddFolder extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

        };
    }

    handleSubmit(event){
        event.preventDefault();
        const name = event.target.name.value;
        console.log('Name: ', name);
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
                <label htmlFor="name">Folder name *</label>
                <input 
                    type="text" 
                    className="AddFolder__control"
                    name="name" 
                    id="name"/>
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