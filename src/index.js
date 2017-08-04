import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';

const todos = (state = [], action) => {
  switch (action.type) {
  case 'ADD_TODO':
    return [
      ...state,
      todo(undefined, action)
    ];
  case 'TOGGLE_TODO':
    return state.map(t => todo(t, action));
  default:
    return state;
  }
};

const todo = (state, action) => {
  switch (action.type) {
  case 'ADD_TODO':
    return {
      id: action.id,
      text: action.text,
      completed: false
    };
  case 'TOGGLE_TODO':
    if (state.id !== action.id) {
      return state;
    }
    return {
      ...state,
      completed: !state.completed
    };
  default:
    return state;
  }
}

const visiblityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
  case 'SET_VISIBILITY_FILTER':
    return action.filter;
  default:
    return state;
  }
};

// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visiblityFilter: visiblityFilter(
//       state.visiblityFilter,
//       action
//     )
//   };
// };

// use combineReducers helper
const todoApp = combineReducers({
  todos,
  visiblityFilter
});

const store = createStore(todoApp);
