import React from 'react';
import ReactDOM from 'react-dom';
import {
  createStore,
  combineReducers
} from 'redux';
const { Component } = React;

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

const store = createStore(todoApp);

let nextTodoId = 0;

const TodoApp = ({
  todos,
  visibilityFilter
}) => {
  const visibleTodos = getVisibleTodos(
    todos,
    visibilityFilter
  );
  return (
    <div>
      <AddTodo
        onAddClick={text =>
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text
          })
        }
      />
      <TodoList
        todos={visibleTodos}
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        } />
      <Footer
        visibilityFilter={visibilityFilter}
        onFilterClick={filter =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter
          })
        }
      />
    </div>
  )
}

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
      completed ?
      'line-through' :
      'none'
    }}
  >
    {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)

const AddTodo = ({
  onAddClick
}) => {
  let input;

  return (
    <div>
      <input ref={node => {
          input = node;
      }} />
      <button onClick={() => {
          onAddClick(input.value);
          input.value='';
          input.focus();
      }}>
        Add Todo
      </button>
    </div>
  );
};

class FilterLink extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render () {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
      active={
        props.filter === state.visibi
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

const render = () => {
  ReactDOM.render(
    <TodoApp
      {...store.getState()}
    />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
