import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddNote from '../AddNote/AddNote';
import AddFolder from '../AddFolder/AddFolder';
import ApiContext from '../ApiContext';
import ErrorBoundary from '../ErrorBoundary';
import config from '../config';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error});
            });
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    // Controlled inputs - handle the value of the input in state
    // validate the form
    // render errors

    // when you click on a circle button currently it changes the path to "add-folder" or "add-note"
    // on that page, render the form, and give the user the ability to submit
    // then validate it for errors
    handleAddFolder = folder => {
        console.log(folder)
        this.setState({
            folders: [...this.state.folders, folder]
        });
    };

    handleAddNote = note => {
    
        this.setState({
            notes: [...this.state.notes, note] // adds our new note to the end of the notes array
        });
    };

    renderNavRoutes() {
        return (
            <>
            <ErrorBoundary>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </ErrorBoundary>
            </>
        );
    }
    // adding the AddFolder and AddNote route(view) to the Main render section
    renderMainRoutes() {
        return (
            <>
            <ErrorBoundary>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
                <Route path="/add-folder" component={AddFolder} />
                <Route path="/add-note" component={AddNote} />
            </ErrorBoundary>
            </>
        );
    } 
    // Create 2 (validated) forms to add folders and add notes to Noteful
    // Hookup the forms to make POST requests to the API
    // Add an error boundary
    //-----------------------
    // STEP 1: Create 2 validated forms
    // Create context(shape) DONE - shapes in ApiContext.js
    // Create contextValue
    // Provide the values by using .Provider
    //      -create the event handler
    // Consume/retrieve the values in context using .Consumer or static method

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote,
            addFolder: this.handleAddFolder,
            addNote: this.handleAddNote
        };
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </ApiContext.Provider>
        );
    }
}

export default App;
