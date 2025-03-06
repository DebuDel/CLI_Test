import { useState, useEffect } from "react";
import { getUsers, addUser, deleteUser, updateUser } from "./api";

function App() {
  const [users, setUsers] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstname || !lastname) {
      setError("Both fields are required.");
      return;
    }

    try {
      if (editingUser) {
        //proceed edit
        const updatedUser = await updateUser(editingUser.id, {
          firstname,
          lastname,
        });
        if (updatedUser) {
          setUsers(
            users.map((user) =>
              user.id === editingUser.id ? updatedUser : user
            )
          );
          setEditingUser(null); // Exit edit mode
        } else {
          setError("Failed to update user.");
        }
      } else {
        //priceed add
        const newUser = await addUser({ firstname, lastname });
        if (newUser && newUser.id) {
          setUsers([...users, newUser]);
        } else {
          setError("Failed to add user / Duplicate User.");
        }
      }

      setFirstname("");
      setLastname("");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("User already exists!");
      } else {
        console.error("Error:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteUser(id);
    if (success) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFirstname(user.firstname);
    setLastname(user.lastname);
  };

  return (
    <div>
      <h2>{editingUser ? "Edit User" : "Add User"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
        <button type="submit" style={{ cursor: "pointer" }}>
          {editingUser ? "Update" : "Add"}
        </button>
        {editingUser && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setFirstname("");
              setLastname("");
            }}
            style={{ cursor: "pointer", marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>User List</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user) =>
            user ? (
              <li key={user.id}>
                {user.firstname} {user.lastname}
                <button
                  onClick={() => handleEdit(user)}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                >
                  Delete
                </button>
              </li>
            ) : null
          )
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
