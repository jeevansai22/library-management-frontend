
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8080/api/books";

export default function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Programming");
  const [error, setError] = useState("");

  async function loadBooks() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error();
      setBooks(await response.json());
      setError("");
    } catch {
      setError("Backend connection failed. Start Spring Boot on port 8080.");
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function addBook(e) {
    e.preventDefault();

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, category })
      });

      if (!response.ok) throw new Error();

      const book = await response.json();
      setBooks(old => [...old, book]);
      setTitle("");
      setAuthor("");
      setCategory("Programming");
      setError("");
    } catch {
      setError("Could not add the book. Check your backend.");
    }
  }

  async function deleteBook(id) {
    if (!window.confirm("Delete this book?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error();

      setBooks(old => old.filter(book => book.id !== id));
    } catch {
      setError("Could not delete the book.");
    }
  }

  const filtered = books.filter(book =>
    `${book.title} ${book.author} ${book.category}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const available = books.filter(book => book.available).length;
  const categories = new Set(books.map(book => book.category)).size;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>📚 BookNest</h2>
        <p className="muted">LIBRARY WORKSPACE</p>
        <div className="active">▦ &nbsp; Dashboard</div>
        <div className="menu">▤ &nbsp; Book Collection</div>
        <div className="side-note">
          <span>✨</span>
          <h3>Your library, organized.</h3>
          <p>Manage your book collection in one place.</p>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <p className="muted">LIBRARY / OVERVIEW</p>
            <h1>Library Dashboard</h1>
          </div>
          <span className="admin">👤 Administrator</span>
        </header>

        <section className="welcome">
          <div>
            <p>YOUR DIGITAL LIBRARY</p>
            <h2>Every book has a story.</h2>
            <span>Organize, discover and manage your collection.</span>
          </div>
          <span className="big-book">📚</span>
        </section>

        {error && <div className="error">{error}</div>}

        <section className="stats">
          <div className="stat">
            <span>📖</span><p>Total Books</p><h2>{books.length}</h2>
            <small>Books in your collection</small>
          </div>
          <div className="stat">
            <span>✅</span><p>Available Books</p><h2>{available}</h2>
            <small>Currently available</small>
          </div>
          <div className="stat">
            <span>🏷️</span><p>Categories</p><h2>{categories}</h2>
            <small>Distinct categories</small>
          </div>
        </section>

        <section className="layout">
          <div className="panel">
            <div className="panel-heading">
              <div><h2>Book Collection</h2><p>Browse and manage your books</p></div>
              <span className="badge">{filtered.length} books</span>
            </div>

            <input
              className="search"
              placeholder="🔍 Search title, author or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>BOOK TITLE</th><th>AUTHOR</th>
                    <th>CATEGORY</th><th>STATUS</th><th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(book => (
                    <tr key={book.id}>
                      <td><strong>📕 {book.title}</strong></td>
                      <td>{book.author}</td>
                      <td><span className="category">{book.category}</span></td>
                      <td>
                        <span className={book.available ? "available" : "borrowed"}>
                          {book.available ? "Available" : "Borrowed"}
                        </span>
                      </td>
                      <td>
                        <button className="delete" onClick={() => deleteBook(book.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="empty">No books found.</p>}
            </div>
          </div>

          <div className="panel form-panel">
            <h2>＋ Add New Book</h2>
            <p>Enter the book details below.</p>
            <form onSubmit={addBook}>
              <label>Book Title</label>
              <input required maxLength="120" value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter book title" />

              <label>Author</label>
              <input required maxLength="100" value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Enter author name" />

              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option>Programming</option>
                <option>Fiction</option>
                <option>Non-Fiction</option>
                <option>Biography</option>
                <option>Science</option>
                <option>Education</option>
                <option>History</option>
                <option>Other</option>
              </select>

              <button className="add-btn" type="submit">＋ Add Book</button>
            </form>
            <div className="tip">💡 <strong>Tip:</strong> Keep book information accurate and up to date.</div>
          </div>
        </section>

        <footer>BookNest · Library Management System <span>React + Spring Boot</span></footer>
      </main>
    </div>
  );
}
