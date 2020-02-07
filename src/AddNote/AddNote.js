// this.context.addNote <-- event handler in App
import React from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddNote.css';
import ValidationError from '../ValidationError';

export default class AddNote extends React.Component {

    constructor(props) {
        super(props)
        
        this.state = {
            name: {
                value: '',
                touched: false
              },
            content: {
                value: '',
                touched: false
            },
            folder: {
                value: 'Important',
                folderId: 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1', // This works for now, but I need a good way to set the default value of state in here for the first folder.
                touched: false
            }
        };
    }

    static contextType = ApiContext;

    // A form to capture the name, content and folder for a new Note. Submit to the POST /notes endpoint on the server.
    // Add validation to ensure that the name of the note is not left blank. The folder should be selected from a list of existing folders. 
    // Ensure that errors are properly handled. 

    // handlers for state properties
    updateName(name) {
        // Whenever the user types anything into the input, we update the state! each letter at a time!
        // When the user types ANYTHING we set the value of touched to "true" from "false" this way we know
        // when to correctly render our ValidationError
        this.setState({
            name: {value: name, touched: true}
        });
    }

    updateContent(content) {
        this.setState({
            content: {value: content, touched: true}
        });
    }

    // User should get a dropdown containing All current folders that exist 
    // User will select a folder from dropdown
    // state will be updated
    // state folder needs a default value..
    updateFolder(folder) {
        console.log(folder[folder.selectedIndex].id)
        this.setState({
            folder: {value: folder, 
                     folderId: folder[folder.selectedIndex].id, 
                     touched: true}
        });
    }

    createFolderList() {
        const folders = this.context.folders;
        return folders.map(folder => {
            return (
                <option 
                    key={folder.id}
                    id={folder.id} 
                    value={folder.name}>{folder.name}</option>
            );
        });
    }

    validateFolder() {
        const selectedFolder = this.state.folder.value;
        if(!selectedFolder) {
            return ('no selected folder');
        }
    }

    validateName() {
        // Validates the name/title of the new note
        // this removes any whitespace from value and makes sure the value isn't an empty string
        const name = this.state.name.value.trim(); 
        if(name.length === 0) {
            return 'Please enter a note title';
        } else if(name.length > 25) {
            return 'Please keep the note title under 25 characters; brevity is the soul of wit.'
        }
    }

    validateContent() {
        // Validates the content of the new note
        const content = this.state.content.value.trim();

        if(content.length === 0) {
            return 'Please enter note content';
        } else if(content.length < 5) {
            return 'Notes must be at least 5 characters long.'
        } else if(content.length > 500) {
            return 'Hold on Shakespeare, this note cannot handle all tho text. Notes cannot be longer than 500 characters.'
        }
    }

    handleSubmit(event){
        event.preventDefault();
        //const { name, content, folder } = this.state;
        const name = this.state.name.value;
        const content = this.state.content.value;
        const folderId = this.state.folder.folderId;
        const modified = new Date();

       // potentially submit these values to the server here
        const data = {
            name,
            modified,
            folderId,
            content,
          };
          
      
          fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(res => {
            if (!res.ok) {
              throw new Error(`Error with POST request: ${res}`);
            }
            return res.json();
          })
          .then((resp) => {
            this.context.addNote(resp);
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
        const contentError = this.validateContent();
        const folderError = this.validateFolder();
        return (
            <form className="AddNote" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add a New Note</h2>
                <div className="AddNote__hint">* required field</div>  
                <div className="form-group">
                    <label htmlFor="add-note-name">Note name *</label>
                    <input 
                        type="text" 
                        className="AddNote__control"
                        name="add-note-name" 
                        id="add-note-name"
                        // Each time the user types anything into input, we update the state. This allows real-time error messages (ie before submit)
                        onChange={e => this.updateName(e.target.value)}
                        required/>
                    {/* Conditional rendering depending on whether the user has changed the input or not */}
                    {this.state.name.touched && (<ValidationError message={nameError} />)}
                </div>

                <div className="form-group">
                    <label htmlFor="add-note-content">Content *</label>
                    <textarea
                        rows="5"
                        cols="33"
                        className="AddNote__control"
                        name="add-note-content" 
                        id="add-note-content"
                        // Each time the user types anything into input, we update the state. This allows real-time error messages (ie before submit)
                        onChange={e => this.updateContent(e.target.value)}
                        required/>
                    {/* Conditional rendering depending on whether the user has changed the input or not */}
                    {this.state.content.touched && (<ValidationError message={contentError} />)}
                </div>

                <div>
                 <label>Where do you want to save this new note?</label>
                    <select
                    value={this.state.folder.value}
                    onChange={e => this.updateFolder(e.target)}>
                    {this.createFolderList()}
                    </select>
                    {this.state.content.touched && (<ValidationError message={folderError} />)}
                </div>
        
                <div className="AddNote__button__group">
                    <button type="reset" className="AddNote__button">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="AddNote__button"
                        // if anything triggers our validation method, the button gets disabled
                        disabled={this.validateName() || this.validateContent()}>
                        Save
                    </button>
                </div>
          </form>
        );
    }
}