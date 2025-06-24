import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete'; // Import delete icon from MUI
import EditIcon from '@mui/icons-material/Edit';

// Import CodeMirror modes
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import env from "./env";  // For C#

const languageMap = {
  javascript: 'javascript',
  python: 'python',
  csharp: 'csharp',
};

function Snippets() {
  const [snippet, setSnippet] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [visibility, setVisibility] = useState('public');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [snippets, setSnippets] = useState([]);
  const [editingSnippet, setEditingSnippet] = useState(null); // Added this
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editVisibility, setEditVisibility] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editLanguage, setEditLanguage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(env.backend_domain + '/api/snippets', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setSnippets(data.snippets))
      .catch((error) => console.error('Error fetching snippets:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!snippet.trim() || !title || !description) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(env.backend_domain + '/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          fulltext: snippet,
          language,
          visibility,
        }),
      });

      if (response.ok) {
        const newSnippet = await response.json(); // Fetch the newly created snippet
        console.log("Newly created snippet:", newSnippet); // Debugging line
        setSnippets([...snippets, newSnippet]); // Update state with the new snippet
        setSnippet('');
        setTitle('');
        setDescription('');
        alert('Snippet sucessfully added!');
        fetchSnippets(); // Reload snippets to ensure latest data
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit the snippet');
      }
    } catch (error) {
      console.error('Error submitting snippet:', error);
      alert('Internal server error');
    }
  };

  const fetchSnippets = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(env.backend_domain + '/api/snippets', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await response.json();
        setSnippets(data.snippets);
    } catch (error) {
        console.error('Error fetching snippets:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(env.backend_domain + '/api/snippets/${id}', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setSnippets(snippets.filter(snip => snip._id !== id));
        alert('Snippet deleted successfully!');
      } else {
        alert('Failed to delete the snippet');
      }
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  // Function to enter edit mode
  const handleEdit = (snippet) => {
    setEditingSnippet(snippet);
    setEditTitle(snippet.title);
    setEditDescription(snippet.description);
    setEditCode(snippet.fulltext);
    setEditLanguage(snippet.language);
    setEditVisibility(snippet.visibility);
  };
  // Function to save the edited snippet
  const handleSaveEdit = async (e, id) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(env.backend_domain + '/api/snippets/${id}', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          fulltext: editCode,
          language: editLanguage,
          visibility: editVisibility,
        }),
      });
  
      if (response.ok) {
        const updatedSnippet = await response.json();
        setSnippets(snippets.map((snip) => (snip._id === id ? updatedSnippet : snip)));
        setEditingSnippet(null);
        alert('Snippet updated successfully!');
      } else {
        alert('Failed to update the snippet');
      }
    } catch (error) {
      console.error('Error updating snippet:', error);
    }
  };

  return (
    <Paper className="snippets-container" style={{ padding: '20px', margin: '20px', backgroundColor: '#1e1e1e', color: '#ffffff', borderRadius: '20px' }}>
      <div className="snippets-form-container" style={{ marginBottom: '50px' }}>
        <h2>Submit Your Code Snippet</h2>

        <form onSubmit={handleSubmit} className="snippet-form">
          <div className="input-container">
            <label htmlFor="title">Snippet Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                backgroundColor: '#333333',
                color: '#ffffff',
                border: '1px solid #444444',
                padding: '8px',
                borderRadius: '4px',
              }}
            />
          </div>

          <div className="input-container">
            <label htmlFor="description">Snippet Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                backgroundColor: '#333333',
                color: '#ffffff',
                border: '1px solid #444444',
                padding: '8px',
                borderRadius: '4px',
                resize: 'vertical',
              }}
            />
          </div>

          <div className="input-container">
            <label htmlFor="language">Choose Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              id="language"
              style={{
                backgroundColor: '#333333',
                color: '#ffffff',
                border: '1px solid #444444',
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="csharp">C#</option>
            </select>
          </div>

          <div className="input-container">
            <label htmlFor="visibility">Choose Visibility:</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              id="visibility"
              style={{
                backgroundColor: '#333333',
                color: '#ffffff',
                border: '1px solid #444444',
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="input-container">
            <CodeMirror
              value={snippet}
              options={{
                mode: language === 'csharp' ? 'text/x-csharp' : language,
                theme: 'material',
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, value) => setSnippet(value)}
            />
          </div>

          <button type="submit" className="submit-button" style={{
            backgroundColor: '#00e4ff !important',
            color: '#ffffff',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            Submit
          </button>
        </form>
      </div>
      <div className="snippets-list-container" style={{ maxWidth: '100%', padding: '0 24px' }}>
        <h1 style={{ textAlign: 'center' }}>Submitted Snippets:</h1>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '20px',
        }}>
          {snippets.length > 0 ? (
            snippets.map((snip, index) => (
              <div key={snip._id || `snippet-${index}`} className="snippet-card" style={{ backgroundColor: '#1e1e1e', color: '#ffffff', padding: '15px', borderRadius: '8px' }}>
                {editingSnippet && editingSnippet._id === snip._id ? (
                  // Edit Form
                  <form onSubmit={(e) => handleSaveEdit(e, snip._id)}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      placeholder="Title"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                      placeholder="Description"
                    />
                    <select value={editLanguage} onChange={(e) => setEditLanguage(e.target.value)}>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="csharp">C#</option>
                    </select>
                    <select value={editVisibility} onChange={(e) => setEditVisibility(e.target.value)}>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                    <CodeMirror
                      value={editCode}
                      options={{ mode: editLanguage, theme: 'material', lineNumbers: true }}
                      onBeforeChange={(editor, data, value) => setEditCode(value)}
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingSnippet(null)}>Cancel</button>
                  </form>
                ) : (
                // Snippet display
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h2 style={{ margin: 0 }}>{snip.title}</h2>
                    <div>
                      <button onClick={() => handleEdit(snip)} style={{ marginRight: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(snip._id)} style={{ backgroundColor: 'red', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <h4 style={{ margin: 0 }}>Language: {snip.language}</h4>
                  <h4 style={{ margin: 0 }}>Visibility: {snip.visibility}</h4>
                  <SyntaxHighlighter language={languageMap[snip.language]} style={dracula} showLineNumbers>
                    {snip.fulltext}
                  </SyntaxHighlighter>
                </div>
                )}
              </div>
            ))
          ) : (
            <p>No snippets yet.</p>
          )}
        </div>
      </div>
    </Paper>
  );
}

export default Snippets;