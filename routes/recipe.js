const express = require('express');
const axios = require('axios');
const router = express.Router();

// In-memory storage for favorites (use a database in production)
const favorites = [];

router.get('/random', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.spoonacular.com/recipes/random?apiKey=${process.env.SPOONACULAR_API_KEY}&number=1`
        );
        const recipe = response.data.recipes[0];
        const randomRecipe = {
            id: recipe.id,
            title: recipe.title || 'Untitled Recipe',
            image: recipe.image || 'https://via.placeholder.com/300',
            instructions: recipe.instructions || 'No instructions available',
            ingredients: recipe.extendedIngredients?.map(ing => ing.original) || [],
            servings: recipe.servings || 'N/A',
            readyInMinutes: recipe.readyInMinutes || 'N/A'
        };
        res.json(randomRecipe);
    } catch (error) {
        console.error('Error in /random route:', error.message);
        if (error.response) {
            res.status(error.response.status).json({
                error: 'Spoonacular API error',
                details: error.response.data
            });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});

// Save a favorite recipe
router.post('/favorites', (req, res) => {
    try {
        const recipe = req.body;
        if (!favorites.some(fav => fav.id === recipe.id)) {
            favorites.push(recipe);
            res.status(201).json({ message: 'Recipe added to favorites' });
        } else {
            res.status(400).json({ error: 'Recipe already in favorites' });
        }
    } catch (error) {
        console.error('Error saving favorite:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Get all favorite recipes
router.get('/favorites', (req, res) => {
    try {
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Search recipes by ingredients
router.get('/search', async (req, res) => {
    try {
        const ingredients = req.query.ingredients;
        if (!ingredients) {
            return res.status(400).json({ error: 'Ingredients parameter is required' });
        }

        const response = await axios.get(
            `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.SPOONACULAR_API_KEY}&ingredients=${ingredients}&number=10`
        );

        const recipes = response.data.map(recipe => ({
            id: recipe.id,
            title: recipe.title || 'Untitled Recipe',
            image: recipe.image || 'https://via.placeholder.com/300',
            ingredients: recipe.usedIngredients?.map(ing => ing.original || ing.name) || [],
            servings: recipe.servings || 'N/A',
            readyInMinutes: recipe.readyInMinutes || 'N/A',
            instructions: recipe.instructions || 'No instructions available' // Note: This endpoint doesn't provide instructions
        }));

        res.json(recipes);
    } catch (error) {
        console.error('Error in /search route:', error.message);
        if (error.response) {
            res.status(error.response.status).json({
                error: 'Spoonacular API error',
                details: error.response.data
            });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});

module.exports = router;