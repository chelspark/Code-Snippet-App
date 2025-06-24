const express = require('express');
const Snippet = require('../model/snippet');  // Ensure the correct path to your snippet model
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// GET /api/snippets - Get all snippets submitted by the authenticated user
router.get('/snippets', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
  
      const userSnippets = await Snippet.find({ owner: decoded.id });
      if (userSnippets.length === 0) {
        return res.status(404).json({ message: 'No snippets found for this user' });
      }
  
      res.status(200).json({ snippets: userSnippets });
    } catch (error) {
      console.error('Error fetching snippets:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// POST /snippets - Create a new snippet
router.post('/snippets', async (req, res) => {
    try {
      const { title, description, fulltext, language, visibility } = req.body;
  
      // Retrieve the user ID from the JWT token
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
  
      const newSnippet = new Snippet({
        title,
        description,
        fulltext,  // Store the actual code snippet text
        language,  // Store the selected language
        visibility,
        owner: decoded.id,  // Owner field stores user ID
      });
  
      const savedSnippet = await newSnippet.save();
      res.status(201).json(savedSnippet);
    } catch (error) {
      console.error('Error creating snippet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // home page endpoint
  router.get('/public-snippets', async (req, res) => {
    try {
      const language = req.query.filter;

      let publicSnippets = {};
      if (language) {
        publicSnippets = await Snippet.find({ visibility: 'public', language: language });
      } else {
        publicSnippets = await Snippet.find({ visibility: 'public' });
      }

      res.status(200).json(publicSnippets);

    } catch (error) {
      console.error('Error fetching public snippets:', error);
      res.status(500).json({ error: 'Failed to fetch public snippets' });
    }
  });

  // DELETE /api/snippets/:id - Delete a specific snippet
router.delete('/snippets/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const deletedSnippet = await Snippet.findByIdAndDelete(id);
      if (!deletedSnippet) {
          return res.status(404).json({ error: 'Snippet not found' });
      }
      res.status(200).json({ message: 'Snippet deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete snippet' });
  }
});
// Assuming this is in your snippetsRouter
router.put('/snippets/:id', async (req, res) => {
  try {
    const updatedSnippet = await Snippet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSnippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.status(200).json(updatedSnippet);
  } catch (error) {
    console.error('Error updating snippet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
