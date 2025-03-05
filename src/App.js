import { useState, useEffect } from "react";
import { getUsers, addUser, deleteUser } from "./api";

function App() {
  const [users, setUsers] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstname || !lastname) return;
    setError("");

    if (!firstname || !lastname) {
      setError("Both fields are required.");
      return;
    }

    try {
      const newUser = await addUser({ firstname, lastname });
      if (newUser && newUser.id) {
        setUsers([...users, newUser]);
        setFirstname("");
        setLastname("");
      } else {
        setError("Failed to add user/ Duplicate User");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("User already exists!");
      } else {
        console.error("Error adding user:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteUser(id);
    if (success) {
      setUsers(users.filter((user) => user.id !== id)); // ✅ Remove from UI
    }
  };

  return (
    <div>
      <h2>Add User</h2>
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
          Add
        </button>
      </form>

      <h2>User List</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user) =>
            user ? (
              <li key={user.id}>
                {user.firstname} {user.lastname}
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ cursor: "pointer" }}
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
