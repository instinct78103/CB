export function TodoList({ todos, toggleTodo, handleEdit, deleteTodo }) {
  return (
    <>
      {!todos.length && <p>No todos yet...</p>}

      {todos.length > 0 && (
        <ul className="list">
          {todos.map(todo => {
            return (
              <li key={todo.id} style={{display: 'flex'}}>
                <label style={{marginRight: 'auto'}}>
                  <input type="checkbox" checked={todo.completed} onChange={e => toggleTodo(todo.id, e.target.checked)} />
                  <span>{todo.title}</span>
                </label>
                <button className="btn" onClick={() => handleEdit(todo)}>Edit</button>
                <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}