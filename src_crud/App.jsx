import { useState, useEffect, useRef } from 'react';
import './style.css';
import { NewTodoForm } from './NewTodoForm.jsx';
import { TodoList } from './TodoList.jsx';

export default function App() {
  const [newItem, setNewItem] = useState('');
  const [todos, setTodos] = useState(() => {
    const localValue = localStorage.getItem('ITEMS');
    if (localValue == null) return [];
    return JSON.parse(localValue);
  });
  const inputRef = useRef(null);

  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => localStorage.setItem('ITEMS', JSON.stringify(todos)), [todos]);

  function toggleTodo(id, completed) {
    setTodos(currentTodos => currentTodos.map(todo => todo.id === id ? {...todo, completed} : todo));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (newItem === '') return;

    if (editingTodo) {
      setTodos(currentTodos => currentTodos.map(todo => todo.id === editingTodo.id ? { ...todo, title: newItem } : todo));
      setEditingTodo(null);
    } else {
      setTodos(currentTodos => [...currentTodos, { id: crypto.randomUUID(), title: newItem, completed: false }]);
    }

    setNewItem('');
  }

  function handleEdit(todo) {
    setTimeout(() => inputRef.current.focus(), 0);
    setEditingTodo(todo);
    setNewItem(todo.title)
  }

  function editTodo(id) {
    setTodos(currentTodos => currentTodos.map(todo => todo.id === id ? { ...todo, title: newItem } : todo));
    setEditingTodo(null);
  }

  function deleteTodo(id) {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
  }

  return (
    <>
      <NewTodoForm handleSubmit={handleSubmit} editingTodo={editingTodo} newItem={newItem} setNewItem={setNewItem} inputRef={inputRef}/>

      <h1 className="header">Todo List</h1>

      <TodoList
        todos={todos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
        handleEdit={handleEdit}
      />
    </>
  );
}