const favouritesContainer = document.querySelector('.foodContainer');
const favouritesList = JSON.parse(localStorage.getItem('favourites')) || [];

// initially displayFavourites function called
document.addEventListener('DOMContentLoaded', () => {
    displayFavourites();
});
// this function is used to display the favourite list
function displayFavourites() {
    favouritesContainer.textContent = '';
    if (favouritesList.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className ='notFound';
        emptyMessage.textContent = 'No favourites added yet.';
        favouritesContainer.appendChild(emptyMessage);
    } else {
        favouritesList.forEach(element => {
            createFavouriteFoodDiv(element);
        });
    }
}
//this function is create favourite food item div and append in food container
function createFavouriteFoodDiv(element) {
    const foodPoster = element.strMealThumb;
    const foodName = element.strMeal;
    const foodCard = `
        <div class="foodCard" data-id="${element.idMeal}">
            <div class="foodImageDiv">
                <img src="${foodPoster}" alt="" />
            </div>
            <div class="foodItemName">${foodName}</div>
            <div class="removeFavourite">
                <button class="removeBtn" data-id="${element.idMeal}">Remove</button>
            </div>
        </div>`;
    favouritesContainer.insertAdjacentHTML('beforeend', foodCard);
}

favouritesContainer.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'button') {
        const foodId = event.target.getAttribute('data-id');
        removeFromFavourites(foodId);
        displayFavourites();
    }
});

// this function is used to remove favourite food item from list
function removeFromFavourites(id) {
    const index = favouritesList.findIndex(item => item.idMeal === id);
    if (index !== -1) {
        favouritesList.splice(index, 1);
    }
    localStorage.setItem('favourites', JSON.stringify(favouritesList));
}
