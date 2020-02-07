import React from 'react';

export default class ErrorBound extends React.Component {
    state = { error: null };
    // static method
    static getDerivedStateFromError(error) {
        // Called when an error is thrown in a child component
        console.error(error);
        // Store the error in the state
        return error;
    }

    render() {
    // If there was an error, show an error page
      if (this.state.error) {
        return (
          <div className="error-page"> 
            <h1>Uh Oh! Something seems to have gone wrong</h1> 
            <p>Try refreshing the page</p> 
          </div>
        );
      }
      // Otherwise, render the children
      return (
        this.props.children
      );
    }
  }