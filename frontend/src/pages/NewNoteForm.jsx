import React, { useState } from 'react';

function NewNoteForm({ onNoteCreated }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, body })
    });
    const data = await res.json();
    if (res.ok && data.id) {
      onNoteCreated(data);
      setTitle('');
      setBody('');
    } else {
      setError(data.message || 'Error creating note');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Note</h2>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        required
        maxLength={120}
      />
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Body"
        maxLength={2000}
      />
      <button type="submit" disabled={loading}>Create</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

export default NewNoteForm;
