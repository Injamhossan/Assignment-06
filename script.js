// A friendly note from a fellow dev:
// This script handles all the dynamic features of our Green Earth website.
// Let's make sure our planet gets greener, one tree at a time!

// --- DOM Element References ---
// We're grabbing our main HTML elements to work with them later.
const categoriesContainer = document.getElementById("category-list");
const plantCardsContainer = document.getElementById("product-container");
const cartItemsContainer = document.getElementById("cart-container");
const cartTotalDisplay = document.getElementById("cart-total");

// --- Global State ---
// This is our simple in-memory shopping cart.
let shoppingCart = [];
let allPlantsData = []; // This will store the plants data from the API

// --- UI Helpers ---
// Simple helpers to make the UI feel responsive and professional.

const showFullPageLoader = () => {
  const loaderHTML = `
    <div id="full-page-loader" class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-50">
        <span class="loading loading-dots loading-lg text-[#15803D]"></span>
    </div>
  `;
  document.body.insertAdjacentHTML("afterbegin", loaderHTML);
};

const hideFullPageLoader = () => {
  const loader = document.getElementById("full-page-loader");
  if (loader) {
    loader.remove();
  }
};

const showSectionLoader = () => {
  plantCardsContainer.innerHTML = `<div class="w-full flex justify-center py-10">
      <span class="loading loading-dots loading-lg text-[#15803D]"></span>
  </div>`;
};

// --- API Interactions ---
// Functions to fetch data from the APIs.

const fetchCategories = async () => {
  try {
    const response = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error("Oops! Couldn't fetch the categories. Here's why:", error);
    return [];
  }
};

const fetchAllPlants = async () => {
  try {
    const response = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await response.json();
    return data.plants;
  } catch (error) {
    console.error("Couldn't get plant data. Something went wrong:", error);
    return [];
  }
};

// --- Core Logic ---
// Functions that handle the main business logic of our app.

const renderCategories = (categories) => {
  categoriesContainer.innerHTML = "";

  const allTreesButton = document.createElement("li");
  allTreesButton.innerHTML = `<button data-category="all" class="category-btn w-full text-left px-3 py-2 rounded-md bg-green-700 text-white">All Trees</button>`;
  categoriesContainer.appendChild(allTreesButton);

  categories.forEach((category) => {
    const categoryButton = document.createElement("li");
    categoryButton.innerHTML = `<button data-category="${category.id}" data-category-name="${category.category_name}" class="category-btn w-full text-left px-3 py-2 rounded-md hover:bg-green-700 hover:text-white transition-colors duration-200">${category.category_name}</button>`;
    categoriesContainer.appendChild(categoryButton);
  });

  setupCategoryListeners();
};

const renderPlants = (plants) => {
  const numCardsToShow = window.innerWidth < 1024 ? 3 : 6;
  const plantsToShow = plants.slice(0, numCardsToShow);

  plantCardsContainer.innerHTML = "";

  if (plantsToShow.length === 0) {
    plantCardsContainer.innerHTML = `<p class="w-full h-full flex items-center justify-center text-gray-500">No plants available in this category.</p>`;
    return;
  }

  plantsToShow.forEach((plant) => {
    const card = document.createElement("div");
    card.classList.add("bg-white", "p-4", "rounded-[8px]", "shadow-md", "cursor-pointer");

    card.innerHTML = `
      <div>
        <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded-[8px] mb-4" />
      </div>
      <h3 class="text-xl font-semibold">${plant.name}</h3>
      <p class="text-gray-500 text-sm mt-1">${plant.description.substring(0, 100)}...</p>
      <div class="flex items-center gap-2 mt-3">
        <span class="inline-block bg-[#CFF0DC] text-[#15803D] text-xs font-semibold px-2 py-1 rounded-full">${plant.category}</span>
        <span class="text-gray-700 text-base font-semibold ml-auto">৳${plant.price}</span>
      </div>
      <button class="add-to-cart-btn w-full mt-4 btn bg-[#15803D] text-white rounded-[50px] hover:bg-green-800 transition-colors duration-200">
        Add to Cart
      </button>
    `;

    card.querySelector(".add-to-cart-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      addItemToCart(plant);
    });

    card.addEventListener("click", () => showPlantModal(plant));

    plantCardsContainer.appendChild(card);
  });
};

const updateCartUI = () => {
  cartItemsContainer.innerHTML = "";
  let totalCost = 0;

  if (shoppingCart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="text-center text-sm text-gray-400">Your cart is empty.</p>`;
  } else {
    shoppingCart.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.classList.add("bg-gray-100", "p-3", "rounded-md", "flex", "items-center", "justify-between", "mb-2");
      
      cartItemDiv.innerHTML = `
        <div>
          <h4 class="font-semibold text-gray-800">${item.name}</h4>
          <p class="text-gray-600">৳${item.price} × ${item.quantity}</p>
        </div>
        <button class="remove-from-cart-btn text-gray-500 hover:text-red-500 transition-colors duration-200">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;

      cartItemDiv.querySelector(".remove-from-cart-btn").addEventListener("click", () => {
        removeItemFromCart(item.id);
      });

      cartItemsContainer.appendChild(cartItemDiv);
      totalCost += item.price * item.quantity;
    });
  }
  cartTotalDisplay.innerText = `৳${totalCost}`;
};

const showPlantModal = (plant) => {
  const modalHTML = `
    <div class="modal-box">
      <div class="modal-header text-center">
        <img src="${plant.image}" alt="${plant.name}" class="w-full max-h-60 object-cover rounded-md mb-4" />
        <h3 class="text-2xl font-bold">${plant.name}</h3>
      </div>
      <div class="modal-body py-4">
        <p class="text-gray-600">${plant.description}</p>
        <div class="flex justify-between items-center mt-4 border-t border-gray-300 pt-4">
          <div class="flex items-center gap-2">
            <span class="text-gray-800 font-semibold">Category:</span>
            <span class="inline-block bg-[#CFF0DC] text-[#15803D] text-xs font-semibold px-2 py-1 rounded-full">${plant.category}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-800 font-semibold">Price:</span>
            <span class="text-gray-700 text-lg font-semibold">৳${plant.price}</span>
          </div>
        </div>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn bg-gray-300 hover:bg-gray-400 text-gray-800 border-none">Close</button>
        </form>
      </div>
    </div>
  `;
  const modal = document.createElement("dialog");
  modal.id = "plant-modal";
  modal.classList.add("modal");
  modal.innerHTML = modalHTML;
  document.body.appendChild(modal);
  modal.showModal();

  modal.addEventListener('close', () => {
    modal.remove();
  });
};

// --- Event Handlers ---
// Functions that respond to user actions.

const setupCategoryListeners = () => {
  const categoryButtons = document.querySelectorAll(".category-btn");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // First, we reset all buttons to their default style.
      categoryButtons.forEach((btn) => {
        btn.classList.remove("bg-green-700", "text-white");
        btn.classList.add("hover:bg-green-700", "hover:text-white");
      });
      // Then, we highlight the currently clicked one.
      button.classList.add("bg-green-700", "text-white");
      button.classList.remove("hover:bg-green-700", "hover:text-white");

      const selectedCategoryName = button.dataset.categoryName;
      filterPlantsByCategory(selectedCategoryName);
    });
  });
};

const addItemToCart = (plant) => {
  const existingItem = shoppingCart.find((item) => item.id === plant.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    shoppingCart.push({ ...plant, quantity: 1 });
  }
  updateCartUI();
};

const removeItemFromCart = (plantId) => {
  shoppingCart = shoppingCart.filter((item) => item.id !== plantId);
  updateCartUI();
};

const filterPlantsByCategory = async (categoryName) => {
  showSectionLoader();
  
  if (allPlantsData.length === 0) {
    plantCardsContainer.innerHTML = `<p class="text-center text-red-500">Failed to load plants. Please try again later.</p>`;
    return;
  }

  // Filter based on the globally stored data
  if (categoryName === "all") {
    renderPlants(allPlantsData);
  } else {
    const filteredPlants = allPlantsData.filter((plant) => plant.category === categoryName);
    renderPlants(filteredPlants);
  }
};

// --- Initial Setup ---
// The main function that runs when the page loads.

const initializeApp = async () => {
  showFullPageLoader();
  
  // Fetch data just once at the beginning
  allPlantsData = await fetchAllPlants();
  const categories = await fetchCategories();
  
  if (allPlantsData.length > 0) {
    renderPlants(allPlantsData);
  }
  
  if (categories.length > 0) {
    renderCategories(categories);
  }
  
  updateCartUI(); // Initialize cart UI on load
  hideFullPageLoader();
};

// Start the app when the DOM is ready.
document.addEventListener("DOMContentLoaded", initializeApp);

// A little extra responsiveness for our users.
window.addEventListener("resize", () => {
  // We re-render the plants based on the screen size, using the pre-loaded data
  renderPlants(allPlantsData);
});