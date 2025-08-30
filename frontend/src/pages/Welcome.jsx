import React, { useState } from 'react';
import NotesList from './NotesList';
import NewNoteForm from './NewNoteForm';

function Welcome({ user }) {
  const [notes, setNotes] = useState([]);

  const handleNoteCreated = (note) => {
    setNotes([note, ...notes]);
  };

  return (
    <div>
      <h1>Welcome, {user?.email || 'User'}!</h1>
      <NewNoteForm onNoteCreated={handleNoteCreated} />
      <NotesList />
    </div>
  );
}

export default Welcome;
