async function searchRecipes() {
    const ingredientInput = document.getElementById('ingredientInput').value.trim();
    const resultsContainer = document.getElementById('results');

    // Clear previous results
    resultsContainer.innerHTML = '<p>Loading...</p>';

    if (!ingredientInput) {
        resultsContainer.innerHTML = '<p>Please enter at least one ingredient.</p>';
        return;
    }

    try {
        // Format ingredients for the API (comma-separated)
        const ingredients = ingredientInput.split(',').map(ing => ing.trim()).join(',');
        const response = await fetch(`/recipeRouter/search?ingredients=${encodeURIComponent(ingredients)}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        resultsContainer.innerHTML = '<p>Error loading recipes. Please try again.</p>';
    }
}

function displayRecipes(recipes) {
    const resultsContainer = document.getElementById('results');
    if (recipes.length === 0) {
        resultsContainer.innerHTML = '<p>No recipes found for the given ingredients.</p>';
        return;
    }

    resultsContainer.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
            <h4>Ingredients:</h4>
            <ul>
                ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            <h4>Instructions:</h4>
            <p>${recipe.instructions || 'No instructions provided'}</p>
        </div>
    `).join('');
}