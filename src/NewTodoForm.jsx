import { useEffect } from 'react';

export function NewTodoForm({ handleSubmit, editingTodo, newItem, setNewItem, inputRef }) {

  useEffect(() => {
    if (editingTodo) {
      setNewItem(editingTodo.title);
      inputRef.current.focus(); // Focus input when editing starts
    }
  }, [editingTodo]);

  return (
    <>
      <form className="new-item-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="item">{editingTodo ? `editing: ${editingTodo.title}` : 'Add New Item'}</label>
          <input ref={inputRef} type="text" id="item" value={newItem} onChange={e => setNewItem(e.target.value)} autoFocus/>
        </div>
        <button className="btn">{editingTodo ? 'Update' : 'Add'}</button>
      </form>
    </>
  );
}