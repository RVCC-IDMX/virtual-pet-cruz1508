/**
 * pet.js
 *
 * This file should contain your Pet constructor function and prototype methods.
 * Export your Pet constructor and any necessary constants to be used in app.js.
 */
const petArt = {
  cat: {
    ecstatic: `=^.^= `,
    happy: `=^.^=`,
    content: `=^o^=`,
    neutral: `=^-^=`,
    bored: `=^._.^=`,
    sad: `=;.;=`,
    miserable: `=x.x=`
  },
  dog: {
    ecstatic: `U•ᴥ•U `,
    happy: `U•ᴥ•U`,
    content: `U^ᴥ^U`,
    neutral: `U-_–U`,
    bored: `U•ᴥ•U zZ`,
    sad: `U；ᴥ；U`,
    miserable: `U×_×U`
  },
  cow: {
    ecstatic: `(oo) `,
    happy: `(oo)`,
    content: `(o_o)`,
    neutral: `(-_-)`,
    bored: `(¬_¬)`,
    sad: `(T_T)`,
    miserable: `(x_x)`
  },
  dragon: {
    ecstatic: `<:3 )~~`,
    happy: `<:3 )~~`,
    content: `<:3 )~`,
    neutral: `<:3 )`,
    bored: `<:3 ) zZ`,
    sad: `<:3 ) ;(`,
    miserable: `<x_x)>`
  }
};

const SpeechPhrases = {
  ecstatic: [
    "I'm so hyped!",
    "This is awesome!",
    "Best day ever!",
    "YOOO!!!"
  ],
  happy: [
    "I'm happy!",
    "Feeling good.",
    "Thanks!",
    "Let's go!"
  ],
  content: [
    "All good here.",
    "Just chillin'.",
    "Nice and calm."
  ],
  neutral: [
    "I'm okay.",
    "What's up?",
    "Meh."
  ],
  bored: [
    "So bored...",
    "Can we do something?",
    "Zzzz..."
  ],
  sad: [
    "Feeling down.",
    "I miss you.",
    "Not great."
  ],
  miserable: [
    "I'm starving...",
    "Help me...",
    "This sucks."
  ]
};

// TODO: Create a PetTypes object with different pet type options
// Example: const PetTypes = { CAT: 'cat', DOG: 'dog', ... }
const PetTypes = {
  CAT: 'cat',
  DOG: 'dog',
  COW: 'cow',
  DRAGON: 'dragon'
};

const States = {
  ECSTATIC: 'ecstatic',
  HAPPY: 'happy',
  CONTENT: 'content',
  NEUTRAL: 'neutral',
  BORED: 'bored',
  SAD: 'sad',
  MISERABLE: 'miserable',
};
// TODO: Create a States object with different mood states
// Example: const States = { HAPPY: 'happy', SAD: 'sad', ... }

/**
 * Pet constructor function
 *
 * TODO: Implement this constructor function that creates a virtual pet
 * Parameters should include type and name
 * Initialize properties for tracking mood, state, and timestamps
 */
function Pet(type, name) {

  this.type = type || PetTypes.COW;
  this.name = name || 'Pet';


  this.moodLevel = 80; //  (0-100 scale)
  this.state = States.HAPPY;
  this.lastFed = new Date(); //  last fed
  this.created = new Date(); //  was created

  // speech properties
  this.isSpeaking = false;
  this.speechText = '';
  this.speechTimeout = null;

  // Generate appearance
  this.updateAppearance();
}

/**
 * Feed the pet
 *
 * TODO: Implement this method to feed the pet, which should:
 * - Increase the pet's mood level
 * - Update the last fed timestamp
 * - Update the pet's state
 * - Return a message about the feeding
 */
Pet.prototype.feed = function () {

  this.moodLevel = Math.min(100, this.moodLevel + 20);

  // last fed time
  this.lastFed = new Date();

  // pet's state
  this.updateState();

  // being fed message
  this.speak("Yummy!");

  // Return message about feeding
  return `${this.name} has been fed and is ${this.state}!`;
};

/**
 * Check if the pet is hungry
 *
 * TODO: Implement this method to determine if the pet is hungry based on
 * how much time has passed since it was last fed
 */
Pet.prototype.isHungry = function () {
  const now = new Date();
  const timeSinceLastFed = now - this.lastFed;

  const hungerTime = 60 * 1000; // 1 min

  return timeSinceLastFed > hungerTime;
};

/**
 * Update the pet's state based on mood level
 *
 * TODO: Implement this method to:
 * - Update the pet's mood based on time passed
 * - Set the appropriate state based on mood level
 * - Occasionally trigger random thoughts
 * - Update the pet's appearance
 */
Pet.prototype.updateState = function () {
  // Decrease mood if hungry
  if (this.isHungry()) {
    this.moodLevel = Math.max(0, this.moodLevel - 2);
  }

  // Determine state based on mood level
  if (this.moodLevel >= 90) {
    this.state = States.ECSTATIC;
  } else if (this.moodLevel >= 75) {
    this.state = States.HAPPY;
  } else if (this.moodLevel >= 60) {
    this.state = States.CONTENT;
  } else if (this.moodLevel >= 45) {
    this.state = States.NEUTRAL;
  } else if (this.moodLevel >= 30) {
    this.state = States.BORED;
  } else if (this.moodLevel >= 15) {
    this.state = States.SAD;
  } else {
    this.state = States.MISERABLE;
  }

  // 15% chance to speak a random thought
  if (Math.random() < 0.15 && !this.isSpeaking) {
    this.speakRandomThought();
  }

  // Update appearance
  this.updateAppearance();

  return this.state;
};

/**
 * Make the pet speak a random thought based on its mood
 *
 * TODO: Implement this method to have the pet express a random thought
 * appropriate to its current mood
 */
Pet.prototype.speakRandomThought = function () {
  //  phrases for current mood
  const phrases = SpeechPhrases[this.state] || SpeechPhrases.neutral;

  // Pick a random phrase
  const randomIndex = Math.floor(Math.random() * phrases.length);
  const phrase = phrases[randomIndex];

  // Pet Speaking
  this.speak(phrase);
};

/**
 * Make the pet say something
 *
 * TODO: Implement this method to display a speech bubble with text
 * and clear it after a few seconds
 */
Pet.prototype.speak = function (text) {

  if (this.speechTimeout) {
    clearTimeout(this.speechTimeout);
  }

  this.isSpeaking = true;
  this.speechText = text;

  this.speechTimeout = setTimeout(() => {
    this.isSpeaking = false;
    this.speechText = '';
    this.updateAppearance();
  }, 4000);

  this.updateAppearance();
};


/**
 * Get a status message based on the pet's current state
 *
 * TODO: Implement this method to return an appropriate message
 * describing the pet's current mood state
 */
Pet.prototype.getStatusMessage = function () {
  switch (this.state) {
    case States.ECSTATIC:
      return `${this.name} is ecstatic!`;
    case States.HAPPY:
      return `${this.name} is very happy!`;
    case States.CONTENT:
      return `${this.name} is content.`;
    case States.NEUTRAL:
      return `${this.name} is doing alright.`;
    case States.BORED:
      return `${this.name} seems a bit bored.`;
    case States.SAD:
      return `${this.name} is feeling sad.`;
    case States.MISERABLE:
      return `${this.name} is miserable and very hungry!`;
    default:
      return `${this.name} is here.`;
  }
};

/**
 * Update the pet's appearance based on its type and state
 *
 * TODO: Implement this method to set the pet's appearance property
 * based on its current type and state
 * Include speech bubble if the pet is speaking
 */
Pet.prototype.updateAppearance = function () {
  // Use petArt to get the right art for the pet type and state
  const typeArt = petArt[this.type] || petArt[PetTypes.COW];
  const art = typeArt[this.state] || typeArt[States.NEUTRAL];

  if (this.isSpeaking && this.speechText) {
    // Build the speech bubble
    const bubbleWidth = Math.min(40, Math.max(this.speechText.length + 4, 10));
    const topBubble = ' ' + '_'.repeat(bubbleWidth);
    const bottomBubble = ' ' + '-'.repeat(bubbleWidth);
    const textLine = '| ' + this.speechText.padEnd(bubbleWidth - 2, ' ') + ' |';

    this.appearance = `${topBubble}\n${textLine}\n${bottomBubble}\n \\\n  ${art}`;
  } else {
    // Just show the pet art
    this.appearance = art;
  }
};

// TODO: Export the Pet constructor and any necessary constants
export { Pet, PetTypes, States };
