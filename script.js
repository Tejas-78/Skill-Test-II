// All elements needed
const foodContainer = document.querySelector('.foodContainer');
const searchBox = document.querySelector('#searchBox');
const searchBtn = document.getElementById('searchBtn');
const foodListDiv = document.querySelector('.foodList');
const favouritesList = JSON.parse(localStorage.getItem('favourites')) || [];
let foodData = [];

// When click on favourite it open favourite.html
foodListDiv.addEventListener('click', () => {
    window.location.href = 'favourites.html';
});

// Click event on search button
searchBtn.addEventListener('click', () => {
    const foods = searchBox.value.trim(); // Remove before and after space
    foodContainer.textContent = '';
    searchBox.value = '';
    if (!foods) { // If search box is empty and click search button then it shows alert message
        alert("Please Enter Food For Search");
    } else {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foods}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const foodItem = data.meals;
                foodData = foodItem || [];
                if (foodItem) {
                    foodItem.forEach(element => {
                        createFoodDiv(element); // Calling function createFoodDiv
                    });
                } else {
                    const notFoundDiv = document.createElement('div');
                    notFoundDiv.textContent = `No ${foods} food item found `;
                    notFoundDiv.className = 'notFound';
                    foodContainer.appendChild(notFoundDiv);
                }
            });
    }
});

function createFoodDiv(element) {
    const foodPoster = element.strMealThumb;
    const foodName = element.strMeal;
    const foodCard = `
        <div class="foodCard" data-id="${element.idMeal}">
            <div class="foodImageDiv">
                <img src="${foodPoster}" alt="" />
            </div>
            <div class="foodItemName">${foodName}</div>
            <div class="addToFavourite">
                <label>Add To Favourite
                    <input type="checkbox" data-id="${element.idMeal}" />
                    <i class="fa-solid fa-heart"></i>
                </label>
            </div>
        </div>`;
    foodContainer.insertAdjacentHTML('beforeend', foodCard);
}

foodContainer.addEventListener('click', (event) => {
    const foodCard = event.target.closest('.foodCard');
    if (foodCard) {
        const foodId = foodCard.getAttribute('data-id');
        const foodItem = findFoodById(foodId);

        if (event.target.tagName.toLowerCase() === 'input') {
            // Prevent event propagation to avoid showing food details
            event.stopPropagation();
            
            // If when click on add to favourite it adds food item in favourite list
            if (event.target.checked) {
                addToFavourites(foodItem, event.target.nextElementSibling); 
            } else {
                removeFromFavourites(foodItem, event.target.nextElementSibling); 
            }
        } else {
            showFoodDetails(foodItem);
        }
    }
});

// This function is used to get a particular food item
function findFoodById(id) {
    return foodData.find(item => item.idMeal === id) || {};
}

// AddToFavourite function used to add a particular food item in favourite list
function addToFavourites(foodItem, icon) {
    if (!favouritesList.some(item => item.idMeal === foodItem.idMeal)) {
        favouritesList.push(foodItem);
        localStorage.setItem('favourites', JSON.stringify(favouritesList));
        
        // Change icon color to red
        icon.style.color = 'red';
        
        // Show temporary message
        showMessage(`${foodItem.strMeal} is added to favourites`);
    }
}

// When unchecking the food item then it removes the item from the list
function removeFromFavourites(foodItem, icon) {
    const index = favouritesList.findIndex(item => item.idMeal === foodItem.idMeal);
    if (index !== -1) {
        favouritesList.splice(index, 1);
        localStorage.setItem('favourites', JSON.stringify(favouritesList));
        
        // Change icon color back to default
        icon.style.color = '';
        
        // Show temporary message
        showMessage(`${foodItem.strMeal} is removed from the favourites`);
    }
}

// This function is used to show the all details of food item like name, photo, and instructions
function showFoodDetails(element) {
    const foodPoster = element.strMealThumb;
    const foodName = element.strMeal;
    const foodInstructions = element.strInstructions;
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    const foodDetail = `
        <div class="foodInfo">
            <i class="fa-regular fa-circle-xmark"></i>
            <div class="foodInfoImage">
                <img src="${foodPoster}" alt="" />
            </div>
            <div class="foodHeadingDiv">
                <div class="foodHeading">${foodName}</div>
            </div>
            <div class="foodInstructionsDiv">
                <h2>Instructions</h2>
                <p>${foodInstructions}</p>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', foodDetail);

    // When pop details page is open then for closing that page
    const closeIcon = document.querySelector('.foodInfo i');
    closeIcon.addEventListener('click', () => {
        document.body.removeChild(document.querySelector('.foodInfo'));
        document.body.removeChild(overlay);
    });
}

// Function to show a temporary message
function showMessage(message) {
    const messageBox = document.createElement('div');
    messageBox.className = 'messageBox';
    messageBox.textContent = message;
    document.body.appendChild(messageBox);
    
    setTimeout(() => {
        document.body.removeChild(messageBox);
    }, 1700); // Remove the message box after 1.7 second
}

