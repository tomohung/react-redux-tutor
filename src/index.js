import React from 'react';
import ReactDOM from 'react-dom';
import {
  createStore,
  combineReducers
} from 'redux';
import { Component } from 'react';
import { Provider } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import TextField from 'material-ui/TextField';

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

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
    default:
      return todos;
  }
}

// use combineReducers helper
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

let nextTodoId = 0;

const TodoApp = () => {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  )
}

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <div>
    <ListItem
      onClick={onClick}
      style={{
        textDecoration:
        completed ?
        'line-through' :
        'none'
      }}
    >
      {text}
    </ListItem>
  </div>
);

class VisibleTodoList extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { store } = this.context;
    const state = store.getState();

    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }
      />
    );
  }
}

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <List>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </List>
)

const AddTodo = (props, {store}) => {
  let input;

  return (
    <div>
      <input ref={node => {
          input = node;
      }} />
      <RaisedButton onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: input.value
          })
          input.value='';
          input.focus();
      }}>
        Add Todo
      </RaisedButton>
    </div>
  );
};
class FilterLink extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render () {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    return (
      <Link
      active={
        props.filter === state.visibilityFilter
      }
      onClick={() =>
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter: props.filter
        })
      }
      >
      {props.children}
      </Link>
    );
  }
}

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >
      All
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
    >
      Active
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
    >
      Completed
    </FilterLink>
  </p>
)

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{children}</span>
  }

  return (
    <a href='#'
      onClick={e => {
          e.preventDefault();
          onClick();
      }}
    >
      {children}
    </a>
  );
};

VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
}
FilterLink.contextTypes = {
  store: React.PropTypes.object
}
AddTodo.contextTypes = {
  store: React.PropTypes.object
}


ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={createStore(todoApp)}>
      <TodoApp />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
