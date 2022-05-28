PAINT APPLICATION

-> To set up on your systems & Run the Project
   First of all clone the project on VS Code.
   Then, on the terminal write the command "npm start" 
   This will start the "localhost:3000" environment, where you can easily run the application.

-> Representation of Objects
    In this project, React components has a built-in state object. The state object is where the property values are stored that belongs to the component. 
    When the state object changes, the component re-renders.

-> Working of undo-redo functionality
    For implementation of undo-redo functions, history tasks are stored. Here, we use the initialState and PreviousState. 
    First of all we check whether the undo and redo functions are possible or not.
    To check for Undo - Current tasks index > 0.
    To check for Redo - Curren task index < Total Number of tasks done.
    
    If they are possible
    For Undo - decrement the task number by 1, and update it by prevState-1.
    For Redo - Increment the task number by 1, and update it by prevState+1.

-> Websites that helped to complete this assignment 
    roughjs.com


-> Problems faced
    As this was my first ever react project, so many problems  were faced in this, few of the errors are still not resolved. I know this is not perfect and up to the mark, but I am sure with more practice, I can excel in React.
