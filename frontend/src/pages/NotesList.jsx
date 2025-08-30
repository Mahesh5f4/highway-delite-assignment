import React, { useEffect, useState } from 'react';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/notes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setNotes(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotes(notes.filter(note => note.id !== id));
  };

  if (loading) return <div>Loading notes...</div>;
  if (notes.length === 0) return <div>No notes yet.</div>;

  return (
    <div>
      <h2>Your Notes</h2>
      {notes.map(note => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.body}</p>
          <button onClick={() => handleDelete(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default NotesList;
