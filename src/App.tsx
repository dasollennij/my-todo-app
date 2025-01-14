import { useEffect, useState } from 'react'
import './App.css'

// typed interface for our todo items
interface Todo {
  id: number
  text: string
  completed: boolean
}

function App() {
// State: an array of Todo objects
  const [todos, setTodos] = useState<Todo[]>( () => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  })

  // State for the new todo input
  const [newTodo, setNewTodo] = useState('')

  // State for editing todo
  const [editingTodoId, setEditingTodoId] = useState<number | null> (null);

  // State to manage the edit input
  const [editingText, setEditingText] = useState('')

  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All', 'Complete', 'Incomplete'
  const [textFilter, setTextFilter] = useState(''); // Text search input



useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos));
}, [todos])

// Add a new todo (todos handler)
  const handleAddTodo = () => {
    if(!newTodo.trim()) return

    //newItem has to match Todo shape
    const newItem: Todo = {
      id: Date.now(), // Simple unique ID
      text: newTodo.trim(),
      completed: false,
    }
    // With the the function that we set to update the state "todo" we create a new array with all the items of the previous array + the new one.
    setTodos([...todos, newItem])

    //And we empty the input of the todo with it's corresponding setter
    setNewTodo('');

  }
    // Toggle completed status
    const toggleTodo = (id: number) => {
      // toggling 'completed' by mapping
      const updated = todos.map(todo =>
        todo.id === id ? {...todo, completed: !todo.completed} : todo
      )
      setTodos(updated)
    }

    // Removes a todo
    const removeTodo = (id:number) => {
      // Removes a todo by filtering out the one with the matching id and updates the state
      const filtered = todos.filter(todo => todo.id !== id)
      setTodos(filtered)
    }

    // Start editing a todo
    const startEditing = (id:number, currentText: string) => {
      setEditingTodoId(id);
      setEditingText(currentText)
    }

    // Save the edited todo
    const saveEditedTodo = () => {
      const updated = todos.map((todo) => todo.id === editingTodoId ? { ...todo, text: editingText.trim()} : todo
    );
    setTodos(updated);
    setEditingTodoId(null);
    setEditingText('')
    }

    // Cancel editing
    const cancelEditing = () => {
      setEditingTodoId(null);
      setEditingText('');
    }

    // Filter the todos based on category and text search
  const filteredTodos = todos.filter((todo) => {
    // Filter by category
    if (categoryFilter === 'Complete' && !todo.completed) return false;
    if (categoryFilter === 'Incomplete' && todo.completed) return false;

    // Filter by text
    if (textFilter && !todo.text.toLowerCase().includes(textFilter.toLowerCase())) {
      return false;
    }

    return true;
  });

  // using tailwind classes for style
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center max-w-md">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">My Todo List</h1>

      {/* Input and Add Button */}
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-l focus:outline-none"
          placeholder="Add a new todo..."
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-600 text-white px-4 py-1 rounded-r hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Filters */}
      <div className="flex mb-4 gap-4 items-center">
        {/* Dropdown for category */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded focus:outline-none"
        >
          <option value="All">All</option>
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
        </select>

        {/* Text input for search */}
        <input
          type="text"
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded focus:outline-none"
          placeholder="Search todos..."
        />
      </div>

      {/* Todo List */}
      <ul className="space-y-2 w-full max-w-md">
        {/* {todos.map(({ id, text, completed }) => ( */}
          {filteredTodos.map(({ id, text, completed }) => (
          <li
            key={id}
            className="flex items-center justify-between bg-white p-2 shadow rounded"
          >
            <div>
              {editingTodoId === id ? (
                // Edit Mode
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="border border-gray-300 px-2 py-1 rounded focus:outline-none mr-2"
                  />
                  <button
                    onClick={saveEditedTodo}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // Display Mode
                <div>
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => toggleTodo(id)}
                    className="mr-2"
                  />
                  <span className={completed ? 'line-through text-gray-400' : ' text-gray-800'}>
                    {text}
                  </span>
                </div>
              )}
            </div>
            {!editingTodoId && (
              <div>
                <button
                  onClick={() => startEditing(id, text)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeTodo(id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App
