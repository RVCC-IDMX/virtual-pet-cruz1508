/**
 * app.js
 *
 * Main application file that handles UI interactions and updates.
 * Import your Pet constructor and related constants from pet.js
 */

// TODO: Import the Pet constructor and related constants
import { Pet, PetTypes, States } from './pet.js';

let elements = {}; // Declare this to store your DOM refs

// Application state variables
let currentPet = null;
let updateInterval = null;

/**
 * Initialize the application
 *
 * TODO: Implement this function to:
 * - Select and store DOM elements
 * - Populate the pet selector dropdown
 * - Set up event listeners
 * - Show the pet creation UI
 */
function initApp() {
  elements = {

    nameInput: document.getElementById('pet-name'),
    petSelector: document.getElementById('pet-selector'),
    createBtn: document.getElementById('create-pet'),
    feedBtn: document.getElementById('feed-pet'),
    resetBtn: document.getElementById('reset-pet'),
    petDisplay: document.getElementById('pet-display'),
    statusDisplay: document.getElementById('status-display'),
    infoDisplay: document.getElementById('info-display'),
    creationScreen: document.getElementById('pet-creation'),
    interactionScreen: document.getElementById('pet-interaction')

  };

  populatePetSelector();
  setupEventListeners();
  showCreationUI();
}

/**
 * Populate the pet selector dropdown
 *
 * TODO: Implement this function to:
 * - Add an option for each pet type
 * - Set a default selected type
 */
function populatePetSelector() {
  console.log("PetTypes object:", PetTypes); // DEBUG

  if (!elements.petSelector) {
    console.warn("⚠️ petSelector not found in DOM.");
    return;
  }

  elements.petSelector.innerHTML = ''; // clear any existing options

  Object.values(PetTypes).forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    elements.petSelector.appendChild(option);
  });

  elements.petSelector.value = PetTypes.COW; // default
}
/**
 * Set up event listeners for buttons and interactions
 *
 * TODO: Implement this function to:
 * - Add event listeners for the create, feed, and reset buttons
 */
function setupEventListeners() {
  elements.createBtn?.addEventListener('click', createNewPet);
  elements.feedBtn?.addEventListener('click', feedPet);
  elements.resetBtn?.addEventListener('click', resetPet);
}

/**
 * Create a new pet based on form selections
 *
 * TODO: Implement this function to:
 * - Get the selected pet type and name
 * - Create a new Pet instance
 * - Update the UI to show the pet
 * - Start the update cycle
 */
function createNewPet() {
  const type = elements.petSelector?.value || PetTypes.COW;
  let name = elements.nameInput?.value.trim() || '';

  if (!name) {
    name = type.charAt(0).toUpperCase() + type.slice(1);
  }

  currentPet = new Pet(type, name);
  hideCreationUI();
  updatePetDisplay();
  startUpdateCycle();
}

/**
 * Hide the pet creation UI and show the pet interaction UI
 */
function hideCreationUI() {
  elements.creationScreen?.classList.add('hidden');
  elements.interactionScreen?.classList.remove('hidden');
}
/**
 * Show the pet creation UI and hide the pet interaction UI
 */
function showCreationUI() {
  elements.creationScreen?.classList.remove('hidden');
  elements.interactionScreen?.classList.add('hidden');
}

/**
 * Update the pet display and status elements
 *
 * TODO: Implement this function to:
 * - Update the pet's visual representation
 * - Update the status message
 * - Update the mood indicator
 * - Update the information display
 */
function updatePetDisplay() {
  if (!currentPet) return;

  if (elements.petDisplay) {
    elements.petDisplay.textContent = currentPet.appearance;
    elements.petDisplay.className = `pet-display pet-${currentPet.state}`;
  }

  if (elements.statusDisplay) {
    elements.statusDisplay.textContent = currentPet.getStatusMessage();
  }

  updateMoodBar();
  updateInfoDisplay();
}

/**
 * Update the mood level display bar
 *
 * TODO: Implement this function to:
 * - Set the width of the mood bar based on the pet's mood level
 * - Change the color based on the mood level
 */
function updateMoodBar() {
  if (!currentPet || !elements.moodBar) return;

  const level = currentPet.moodLevel;
  elements.moodBar.style.width = `${level}%`;

  if (level >= 75) {
    elements.moodBar.style.backgroundColor = 'green';
  } else if (level >= 45) {
    elements.moodBar.style.backgroundColor = 'orange';
  } else {
    elements.moodBar.style.backgroundColor = 'red';
  }
}

/**
 * Update the information display panel
 *
 * TODO: Implement this function to:
 * - Show the pet's name, type, state, etc.
 * - Display the mood level bar
 * - Show timestamps for creation and last feeding
 */
function updateInfoDisplay() {
  if (!currentPet || !elements.infoDisplay) return;

  const created = currentPet.created.toLocaleTimeString();
  const lastFed = currentPet.lastFed.toLocaleTimeString();

  elements.infoDisplay.innerHTML = `
    <p><strong>Name:</strong> ${currentPet.name}</p>
    <p><strong>Type:</strong> ${currentPet.type}</p>
    <p><strong>State:</strong> ${currentPet.state}</p>
    <p><strong>Mood Level:</strong> ${currentPet.moodLevel}</p>
    <p><strong>Created At:</strong> ${created}</p>
    <p><strong>Last Fed:</strong> ${lastFed}</p>
  `;
}

/**
 * Feed the current pet
 *
 * TODO: Implement this function to:
 * - Call the pet's feed method
 * - Update the display with the new state
 */
function feedPet() {
  if (!currentPet) return;
  currentPet.feed();
  updatePetDisplay();
}
/**
 * Reset the pet simulator
 *
 * TODO: Implement this function to:
 * - Clear the update interval
 * - Reset the current pet
 * - Clear the displays
 * - Show the creation UI
 */
function resetPet() {
  clearInterval(updateInterval);
  currentPet = null;

  if (elements.petDisplay) elements.petDisplay.textContent = '';
  if (elements.statusDisplay) elements.statusDisplay.textContent = '';
  if (elements.infoDisplay) elements.infoDisplay.innerHTML = '';
  if (elements.moodBar) elements.moodBar.style.width = '0%';

  showCreationUI();
}

/**
 * Start the regular update cycle
 *
 * TODO: Implement this function to:
 * - Clear any existing update interval
 * - Set up a new interval that:
 *   - Updates the pet's state
 *   - Updates the display
 */
function startUpdateCycle() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  updateInterval = setInterval(() => {
    if (currentPet) {
      currentPet.updateState();
      updatePetDisplay();
    }
  }, 1000);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
