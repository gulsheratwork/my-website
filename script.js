let collectedData = {};
let questionStack = [];

document.getElementById("video-container").addEventListener("click", () => {
    toggleChatWidget(true);
});

document.getElementById("close-btn").addEventListener("click", () => {
    toggleChatWidget(false);
});

function toggleChatWidget(isOpen) {
    const widget = document.getElementById("chat-widget");
    const videoContainer = document.getElementById("video-container");
    widget.style.display = isOpen ? "block" : "none";
    videoContainer.style.display = isOpen ? "none" : "block";
    widget.setAttribute('aria-hidden', !isOpen);

    // Initialize the video and progress bar when the chat widget opens
    const video = document.getElementById('background-video');
    const progressBar = document.getElementById('progress-bar');
    if (video && progressBar) {
        initializeVideoProgress(video, progressBar);
    }
}

// Function to initialize video progress tracking
function initializeVideoProgress(video, progressBar) {
    // Remove any existing event listener to prevent duplication
    video.removeEventListener('timeupdate', updateProgressBar);

    // Add event listener for timeupdate to update the progress bar
    video.addEventListener('timeupdate', updateProgressBar);

    function updateProgressBar() {
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

const backgroundVideo = document.getElementById('background-video');
const thumbnailVideo = document.getElementById('thumbnail-video');
    // Initialize the video and progress bar
    const video = document.getElementById('background-video');
    const progressBar = document.getElementById('progress-bar');
    initializeVideoProgress(video, progressBar);

// Select the empty container and add a click event listener
const emptyContainer = document.querySelector('.Empty-container');
// Create Play/Pause button dynamically
const playPauseBtn = document.createElement('button');
playPauseBtn.id = 'pay-pause-btn';
playPauseBtn.className = 'control-btn';
playPauseBtn.setAttribute('aria-label', 'Play/Pause');

const playPauseIcon = document.createElement('img');
playPauseIcon.id = 'play-pause-icon';
playPauseIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0ca1f9de91588ec93e8c.png';
playPauseIcon.alt = 'Play/Pause Icon';
playPauseBtn.appendChild(playPauseIcon);

// Append the button
document.getElementById('chat-content').appendChild(playPauseBtn);

// Now attach the event listener after the button is created
playPauseBtn.addEventListener('click', () => {
    console.log('Play/Pause button clicked');
    togglePlayPause();
});

if (emptyContainer) {
    emptyContainer.addEventListener('click', () => {
        if (video) {
            if (video.paused) {
                video.play(); // Play the video
                playPauseIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb060cf9de91b118c93a66.png'; // Change icon to pause
            } else {
                video.pause(); // Pause the video
                playPauseIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0ca1f9de91588ec93e8c.png'; // Change icon to play
            }
        }
    });
}

//not need to delete
document.getElementById('play-pause-btn').addEventListener('click', () => {
    console.log("play button call");

    const playPauseIcon = document.getElementById('play-pause-icon');
    if (backgroundVideo.paused) {
        backgroundVideo.play();
        thumbnailVideo.play();
        playPauseIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb060cf9de91b118c93a66.png';
    } else {
        backgroundVideo.pause();
        thumbnailVideo.pause();
        playPauseIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0ca1f9de91588ec93e8c.png';
    }
});

document.getElementById('mute-unmute-btn').addEventListener('click', () => {
    const muteIcon = document.getElementById('mute-unmute-icon');
    if (backgroundVideo.muted) {
        backgroundVideo.muted = false;
        thumbnailVideo.muted = false;
        muteIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0d81f003010e66500af7.png';
    } else {
        backgroundVideo.muted = true;
        thumbnailVideo.muted = true;
        muteIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0b2cc6a83988da4ff9fd.png';
    }
});

document.getElementById('refresh-btn').addEventListener('click', resetChatAndReload);

function resetChatAndReload() {
  collectedData = {};
  
  // Show loading overlay
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
      loadingOverlay.style.display = 'flex';
  }

  // Set max-height of .chat-content to 85%
  const chatContent = document.querySelector('.chat-content');
  if (chatContent) {
      chatContent.style.maxHeight = '85%';
  }

  // Simulate loading time before rendering the chat widget
  setTimeout(() => {
      renderChatWidget();
      
      // Hide loading overlay after content reloads
      if (loadingOverlay) {
          loadingOverlay.style.display = 'none';
      }
  }, 1000); // Adjust delay as needed
}

function showTypingIndicator() {
    const chatContent = document.getElementById('chat-content');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<img src="https://intaker.azureedge.net/bot-avatar/5-1692022722.jpeg" alt="Typing..."> Typing...';
    chatContent.appendChild(typingIndicator);
    scrollToBottom();
    return typingIndicator;
}

function removeTypingIndicator(typingIndicator) {
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function askSituation() {
    questionStack.push({ question: "situation", answer: null });
    const typingIndicator = showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator(typingIndicator);
        const messageTime = new Date(); // Capture the message time
        appendMessageWithImageAndTime("Are you looking to grow your Real Estate firm? 📈", 'bot-message', messageTime);

        // Add the three options: Yes, No, I don't have a Real Estate firm
        const situationOptions = `
        <div id="situation-options" class="chat-options">
            <button class="option-btn" onclick="handleSituationOption('yes')">Yes</button>
            <button class="option-btn" onclick="handleSituationOption('no')">No</button>
            <button class="option-btn" onclick="handleSituationOption('noLawFirm')">I don't have a Real Estate firm</button>
        </div>
        `;

        // Append options to chat content
        const inputGroup = document.createElement('div');
        inputGroup.innerHTML = situationOptions;
        document.getElementById('chat-content').appendChild(inputGroup);
        scrollToBottom();
    }, 1000);
}

function handleSituationOption(option) {
    // Hide other options after selection
    const situationOptionsDiv = document.getElementById('situation-options');
    situationOptionsDiv.style.display = 'none'; // Hide all the buttons

    // Display the selected option as a user message
    if (option === 'yes') {
        appendMessage("Yes", 'user-message', true);
        askProductInterest();
    } else if (option === 'no') {
        appendMessage("No", 'user-message', true);
        askCashSave();
    } else if (option === 'noLawFirm') {
        appendMessage("I don't have a Real Estate firm", 'user-message', true);
        askIndustry();
    }


    if(!option){
        console.log("sdfsdf");
        // return
    }

    scrollToBottom(); // Scroll after appending the message
}

function askProductInterest() {
    const typingIndicator = showTypingIndicator();
    const messageTime = new Date(); // Capture message time
    
    setTimeout(() => {
        removeTypingIndicator(typingIndicator); // Remove typing indicator
        appendMessageWithImageAndTime("What BotmatikPro products are you interested in? You can select/deselect multiple options and submit when ready.", 'bot-message', messageTime, true);

        const productOptions = `
        <div id="product-options" class="chat-options">
            <button class="option-btn" id="website-chat" onclick="toggleProductOption('Website Chat', 'website-chat', true)">Website Chat</button>
            <button class="option-btn" id="live-call-connect" onclick="toggleProductOption('Live Call-Connect', 'live-call-connect')">Live Call-Connect</button>
            <button class="option-btn" id="texting" onclick="toggleProductOption('Texting', 'texting')">Texting</button>
            <button class="option-btn" id="one-click-retainers" onclick="toggleProductOption('1-click Retainers', 'one-click-retainers')">1-click Retainers</button>
            <button class="option-btn" id="lsa-responder" onclick="toggleProductOption('LSA Responder', 'lsa-responder')">LSA Responder</button>
            <button id="submit-btn" class="submit-icon" onclick="handleSubmit()" style="display: none;">
              <img src="https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66fa91a7923b423d630ec12e.png" alt="submit">
            </button>
        </div>
        `;

        const inputGroup = document.createElement('div');
        inputGroup.innerHTML = productOptions;
        document.getElementById('chat-content').appendChild(inputGroup);
        scrollToBottom(); // Scroll to bottom after appending options
    }, 1000);
}

let selectedProducts = [];

function toggleProductOption(product, elementId) {
    const element = document.getElementById(elementId);

    if (selectedProducts.includes(product)) {
        // Deselect product
        selectedProducts = selectedProducts.filter(p => p !== product);
        element.classList.remove('selected');
    } else {
        // Select product
        selectedProducts.push(product);
        element.classList.add('selected');
    }

    // Show or hide submit button based on selection
    if (selectedProducts.length > 0) {
        document.getElementById('submit-btn').style.display = 'inline-block';
    } else {
        document.getElementById('submit-btn').style.display = 'none';
    }
}

function handleSubmit() {
    if (selectedProducts.length === 0) {
        const messageTime = new Date();
        appendMessageWithImageAndTime("Please select at least one product before submitting.", 'bot-message', messageTime, true);
    } else {
        const submittedProductsMessage = `${selectedProducts.join(', ')}`;
        appendSubmittedMessage(submittedProductsMessage, 'message-container user-message', true); // Pass true to show undo button
        collectedData.productInterest = selectedProducts; // Collect selected products
        document.getElementById('product-options').style.display = 'none'; // Hide options after submission
        removeInputGroup();
        scrollToBottom();
        setTimeout(() => askRoleAtLawFirm(), 1000); // Proceed to next question
    }
}

// Updated function to append submitted message with an optional undo button
// Updated function to append submitted message with an optional undo button
function appendSubmittedMessage(message, className, isUndo = false) {
    const chatContent = document.getElementById('chat-content');
    const messageContainer = document.createElement('div');
    messageContainer.className = className;
    messageContainer.style.display = 'flex'; // Use flexbox to control the layout
    messageContainer.style.justifyContent = 'flex-end'; // Align items to the left

    // Create the undo button first so it appears on the left
    if (isUndo) {
        // Add undo button for option responses
        const undoButton = document.createElement('button');
        undoButton.className = 'undo-btn';
        undoButton.innerHTML = '<img src="https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66facd71721de4859347dd07.png" alt="Undo"><p>Undo</p>';
        undoButton.onclick = () => {
            renderChatWidget(); // Restart the chat on Undo
        };
        disablePreviousUndoButtons();
        messageContainer.appendChild(undoButton);
    }

    // Now create the message div
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.textContent = message;

    // Append the user message after the undo button
    messageContainer.appendChild(messageDiv);

    // Append the entire container to the chat content
    chatContent.appendChild(messageContainer);
    scrollToBottom();
}

// Function to show typing indicator with undo
function appendMessageWithImageAndTime(message, className, messageTime, isOption = true) {
    const messageContainer = document.createElement('div');
    messageContainer.className = className;

    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageContainer.appendChild(messageText);

    if (isOption) {
        // Add undo button for option responses
        const undoButton = document.createElement('button');
        undoButton.className = 'undo-btn';
        undoButton.innerHTML = '<img src="https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66facd71721de4859347dd07.png" alt="Undo"><p>Undo</p>';
        undoButton.onclick = () => {
            renderChatWidget(); // Restart the chat on Undo
        };
        disablePreviousUndoButtons();
        messageContainer.appendChild(undoButton);
    }

    const timeElement = document.createElement('span');
    timeElement.textContent = `Sent at: ${messageTime.toLocaleTimeString()}`;
    timeElement.className = 'message-time';
    messageContainer.appendChild(timeElement);

    document.getElementById('chat-content').appendChild(messageContainer);
    scrollToBottom(); // Scroll to bottom after appending message
}

function disablePreviousUndoButtons() {
    const previousUndoButtons = document.querySelectorAll('.undo-btn:not(.disabled)');
    previousUndoButtons.forEach(button => {
        button.disabled = true;
        button.classList.add('disabled'); // Add disabled class for styling
    });
}

function removeInputGroup() {
    const inputGroup = document.querySelector('.input-group');
    if (inputGroup) {
        inputGroup.remove();
    }
}

function askRoleAtLawFirm() {
    questionStack.push({ question: "role", answer: null });
    const typingIndicator = showTypingIndicator();
    const messageTime = new Date(); // Capture the message time

    setTimeout(() => {
        removeTypingIndicator(typingIndicator);
        
        // Bot message with message time
        appendMessageWithImageAndTime("What do you do at your Real Estate firm?", 'bot-message', messageTime, true);
        
        // Create buttons for role options
        const roleOptions = `
        <div id="role-options" class="chat-options">
            <button class="option-btn" onclick="handleRoleSelection('Owner')">Owner</button>
            <button class="option-btn" onclick="handleRoleSelection('Marketer')">Marketer</button>
            <button class="option-btn" onclick="handleRoleSelection('Partner')">Partner</button>
            <button class="option-btn" onclick="handleRoleSelection('Other')">Other</button>
        </div>
        `;
        
        // Append role options to chat content
        document.getElementById('chat-content').insertAdjacentHTML('beforeend', roleOptions);
        disablePreviousButtons();
        scrollToBottom();
    }, 1000);
}

function handleRoleSelection(role) {
    // Remove the role options immediately
    document.getElementById('role-options').remove();

    // Append the user's choice to the chat
    appendMessage(role, 'user-message', true);
    collectedData.roleAtLawFirm = role; // Collect the role selection

    // Proceed to the next question (ask for the name)
    setTimeout(() => askFullName(), 1000);
}

function askCashSave() {
    const typingIndicator = showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator(typingIndicator);
        appendMessage("What if I could help you save some cash 💵?", 'bot-message');
        
        // Add "Okay, I'm listening!" button with styled circle icon
        const cashSaveOption = `
        <div id="cash-save-options" class="chat-options">
            <button class="submit-icon" onclick="handleCashSave()" style="text-align: left;
    background-color: hsla(0, 0%, 100%, 0.85);
    border: 2px solid #007AFF;
    padding: 9px 14px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 20px;
    margin-bottom: 10px;
    width: fit-content;
    box-sizing: border-box;
    font-family: 'poppins' !important;
    display: flex !important;">
              <span style="width: 20px; height: 20px; border: 2px solid #498FE1; border-radius: 50%; display: inline-block; margin-right: 10px;"></span>
              Okay, I'm listening!
            </button>
        </div>
        `;
        
        // Append to chat content
        const inputGroup = document.createElement('div');
        inputGroup.innerHTML = cashSaveOption;
        document.getElementById('chat-content').appendChild(inputGroup);
        scrollToBottom();
    }, 1000);
}

function handleCashSave() {
    // Hide the cash save option and display the selected answer
    document.getElementById('cash-save-options').style.display = 'none';
    appendMessage("Okay, I'm listening!", 'user-message');
    collectedData.cashSaveInterest = true; // Collect this data point
    removeInputGroup();
    setTimeout(() => askProductInterest(), 1000); // Proceed to next question
}


function askIndustry() {
    const typingIndicator = showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator(typingIndicator);
        appendMessage("We serve a variety of industries! What is your industry?", 'bot-message');
        
        const industryOptions = `
        <div id="industry-options" class="chat-options">
            <select id="industry-select" class="option-select">
                <option class="opt-cstm" value="" disabled selected>Select an industry</option>
                <option class="opt-cstm" value="Dental & Construction">Dental & Construction</option>
                <option class="opt-cstm" value="Doctor">Doctor</option>
                <!-- Add more industries as needed -->
            </select>
            <button class="submit-icon" onclick="handleIndustry()">
              <img src="https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66fa91a7923b423d630ec12e.png" alt="submit">
            </button>
        </div>
        `;
        
        // Append options to chat content
        const inputGroup = document.createElement('div');
        inputGroup.innerHTML = industryOptions;
        document.getElementById('chat-content').appendChild(inputGroup);
        scrollToBottom();
    }, 1000);
}

function handleIndustry() {
    const industry = document.getElementById('industry-select').value;
    if (!industry) {
        alert('Please select an industry');
        return;
    }
    
    // Hide the industry selection and display the selected option
    document.getElementById('industry-options').style.display = 'none';
    appendMessage(industry, 'user-message'  );
    collectedData.industry = industry; // Collect the industry information
    removeInputGroup();
    setTimeout(() => askFullName(), 1000); // Proceed to next question
}

function askFullName() {
    questionStack.push({ question: "situation", answer: null });
    const typingIndicator = showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator(typingIndicator);
        const messageTime = new Date(); // Capture the message time

       // Bot message with isOption = true for question
appendMessageWithImageAndTime(
    'Great! Your business is qualified. ' + 
    "I'd like to send you a limited time special offer: 20% off your first month." + 
    'May I ask your full name?', 
    'bot-message', 
    messageTime, 
    false
);


        // Create the input group with first and last name fields
        const inputGroup = createInputGroup('First Name', handleFullName, '', 'text', false, 'Last Name');

        // Get first and last name input elements
        const [firstNameInput, lastNameInput] = inputGroup.querySelectorAll('input');

        if (firstNameInput && lastNameInput) {
            firstNameInput.classList.add('first-name');
            lastNameInput.classList.add('last-name');
        }

        document.getElementById('chat-content').appendChild(inputGroup);
        scrollToBottom();
    }, 1000);
}

function handleFullName(firstName, lastName) {
    const firstNameField = document.querySelector('.first-name'); // Select the first name input field
    const lastNameField = document.querySelector('.last-name');   // Select the last name input field
    let hasError = false;

    // Check if either field is empty and apply error styling
    if (!firstName.trim()) {
        firstNameField.style.borderColor = 'red';
        firstNameField.placeholder = 'Please enter first name';
        firstNameField.classList.add('error-placeholder');
        hasError = true;
    } else {
        firstNameField.style.borderColor = ''; // Reset styling
        firstNameField.placeholder = 'First Name';
        firstNameField.classList.remove('error-placeholder');
    }

    if (!lastName.trim()) {
        lastNameField.style.borderColor = 'red';
        lastNameField.placeholder = 'Please enter last name';
        lastNameField.classList.add('error-placeholder');
        hasError = true;
    } else {
        lastNameField.style.borderColor = ''; // Reset styling
        lastNameField.placeholder = 'Last Name';
        lastNameField.classList.remove('error-placeholder');
    }

    if (hasError) return; // Exit if there's an error

    // Append the name if no error, with isOption = false for user-typed input
    appendMessage(`${firstName} ${lastName}`, 'user-message', false);
    collectedData.firstName = firstName;
    collectedData.lastName = lastName;
    removeInputGroup();
    setTimeout(() => askPhoneNumber(), 1000);
}

// New function to append message with image and "time ago"
function appendMessageWithImageAndTime(message, className, messageTime, isOption) {
    const messageContainer = document.createElement('div');
    messageContainer.className = className;

    // Create the message text
    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageContainer.appendChild(messageText);

    // Add user profile image
    const userImage = document.createElement('img');
    userImage.src = 'https://intaker.azureedge.net/bot-avatar/5-1692022722.jpeg';  // Replace with actual image path
    userImage.alt = 'User';
    userImage.className = 'user-image';  // You can style this in CSS
    messageContainer.appendChild(userImage);


    
    // Add "time ago" element
    const timeElement = document.createElement('span');
    timeElement.className = 'message-time';  // Style in CSS
    messageContainer.appendChild(timeElement);

    // Append the message container
    document.getElementById('chat-content').appendChild(messageContainer);
    scrollToBottom();

    // Update the "time ago" label initially and every minute
    updateTimeAgo(timeElement, messageTime);
    setInterval(() => updateTimeAgo(timeElement, messageTime), 60000);  // Update every minute

    
}

// Function to calculate and display "time ago"
function updateTimeAgo(element, messageTime) {
    const now = new Date();
    const timeDifference = Math.floor((now - messageTime) / 1000); // Time difference in seconds

    let timeAgo = '';
    if (timeDifference < 60) {
        timeAgo = 'just now';
    } else if (timeDifference < 3600) {
        const minutes = Math.floor(timeDifference / 60);
        timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifference < 86400) {
        const hours = Math.floor(timeDifference / 3600);
        timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(timeDifference / 86400);
        timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
    }

    element.textContent = timeAgo;
}

function askPhoneNumber() {
    questionStack.push({ question: "situation", answer: null });
    const typingIndicator = showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator(typingIndicator);
        const messageTime = new Date(); // Capture the message time

        // Bot message with isOption = true for question
        appendMessageWithImageAndTime("What's the best phone number to reach you?", 'bot-message', messageTime, true);

        // Create the input group
        const inputGroup = createInputGroup('Type Phone Number', handlePhoneNumber, '', 'tel', true); // Changed 'text' to 'tel' for better input control

        // Change the input class of the phone number input to 'phone-num'
        const phoneNumberInput = inputGroup.querySelector('input'); // Target the phone number input field
        if (phoneNumberInput) {
            phoneNumberInput.classList.remove('input-field'); // Remove the default 'input-field' class
            phoneNumberInput.classList.add('phone-num'); // Add the 'phone-num' class

            // Only allow numeric input (phone numbers)
            phoneNumberInput.addEventListener('input', (event) => {
                event.target.value = event.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
            });
        }

        document.getElementById('chat-content').appendChild(inputGroup);
        scrollToBottom();
    }, 1000);
}

function handlePhoneNumber(phoneNumber, countryCode) {
    if (!phoneNumber.trim() || phoneNumber.length < 7) { // You can set a minimum length for a valid phone number
        alert("Please enter a valid phone number.");
        return;
    }

    // Append the phone number as a user message with isOption = false for typed input
    appendMessage(`${countryCode} ${phoneNumber}`, 'user-message', false);
    collectedData.phone = `${countryCode} ${phoneNumber}`;
    removeInputGroup();
    setTimeout(() => askEmail(), 1000);
}

function askEmail() {
    questionStack.push({ question: "situation", answer: null });
    const typingIndicator = showTypingIndicator();
    const messageTime = new Date(); // Capture the message time
    setTimeout(() => {
        removeTypingIndicator(typingIndicator);

        // Bot message with isOption = true for question
        appendMessageWithImageAndTime("And an email address?", 'bot-message', messageTime, true);

        const inputGroup = createInputGroup('Type Email Address', handleEmail, '', 'email');
        document.getElementById('chat-content').appendChild(inputGroup);
        scrollToBottom();
    }, 1000);
}

function handleEmail(email) {
    if (!email.trim() || !validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Append the email as a user message with isOption = false for typed input
    appendMessage(email, 'user-message', false);
    collectedData.email = email;
    removeInputGroup();
    setTimeout(() => askInitialQuestion(), 1000);
}

function askInitialQuestion() {
    const messageTime = new Date(); // Capture the message time
    appendMessageWithImageAndTime("Please answer a couple of questions to help us send you more information about BotmatikPro! Are you currently using a live chat on your website?", 'bot-message', messageTime);

    const initialOptions = `
        <div id="live-chat-options" class="chat-options">
            <button class="option-btn" onclick="handleLiveChatOption('Yes, We have chat')">Yes, We have chat</button>
            <button class="option-btn" onclick="handleLiveChatOption('No')">No</button>
        </div>
    `;
    document.getElementById('chat-content').insertAdjacentHTML('beforeend', initialOptions);
    scrollToBottom();
}

function handleLiveChatOption(option) {
    // Hide the options after selection
    document.getElementById('live-chat-options').remove();
    appendMessage(option, 'user-message', true); // Display user's choice
    collectedData.usingLiveChat = option;

    if (option === 'Yes') {
        setTimeout(() => askLeadsPerMonth(), 1000);
    } else {
        setTimeout(() => askWebsiteVisitors(), 1000);
    }
}

function askLeadsPerMonth() {
    const messageTime = new Date(); // Capture the message time
    appendMessageWithImageAndTime("How many leads do you receive from your chat every month? A rough estimate works!", 'bot-message', messageTime);

    const inputGroup = createInputGroup('Enter lead number', handleLeadsInput);
    document.getElementById('chat-content').appendChild(inputGroup);
    scrollToBottom();
}

function handleLeadsInput(leadNumber) {
    if (!leadNumber.trim()) {
        alert("Please enter a valid number.");
        return;
    }

    appendMessage(`${leadNumber} leads`, 'user-message', false); // Show the user's input
    collectedData.leadsPerMonth = leadNumber; // Store lead number
    removeInputGroup(); // Remove the input field
    setTimeout(() => askRecommenderQuestion(), 1000); // Move to the next question
}

function askWebsiteVisitors() {
    const messageTime = new Date(); // Capture the message time
    appendMessageWithImageAndTime("How many website visitors do you have on your site every month?", 'bot-message', messageTime);

    const visitorSlider = `
        <div id="visitor-slider-container" class="visitor-slider">
            <input type="range" min="0" max="50000" step="100" value="0" id="visitorRange" oninput="updateVisitorCount(this.value)">
            <span id="visitorCount">0</span> visitors
        </div>
    `;
    document.getElementById('chat-content').insertAdjacentHTML('beforeend', visitorSlider);
    document.getElementById('chat-content').insertAdjacentHTML('beforeend', `<button id="submitVisitorBtn" class="option-btn" onclick="submitVisitorCount()">Submit</button>`);
    scrollToBottom();
}

function updateVisitorCount(value) {
    document.getElementById('visitorCount').innerHTML = value;
}

function submitVisitorCount() {
    const visitors = document.getElementById('visitorRange').value;
    appendMessage(`${visitors} visitors`, 'user-message', false); // Show the visitor count input
    collectedData.visitorsPerMonth = visitors; // Store the visitor count

    // Hide the slider and submit button after submission
    document.getElementById('visitor-slider-container').style.display = 'none';
    document.getElementById('submitVisitorBtn').style.display = 'none';

    // Proceed to the next question
    setTimeout(() => askRecommenderQuestion(), 1000);
}


function askRecommenderQuestion() {
    const messageTime = new Date(); // Capture the message time
    appendMessageWithImageAndTime("Did anyone recommend BotmatikPro to you?", 'bot-message', messageTime);

    const recommenderOptions = `
        <div id="recommender-options" class="chat-options">
            <button class="option-btn" onclick="handleRecommenderOption('Yes')">Yes, someone did</button>
            <button class="option-btn" onclick="handleRecommenderOption('Nope')">Nope</button>
        </div>
    `;
    document.getElementById('chat-content').insertAdjacentHTML('beforeend', recommenderOptions);
    scrollToBottom();
}

function handleRecommenderOption(option) {
    document.getElementById('recommender-options').remove(); // Hide options after selection
    appendMessage(option, 'user-message', true); // Show the user's choice
    collectedData.recommender = option;

    if (option === 'Yes') {
        setTimeout(() => askRecommenderName(), 1000);
    } else {
        setTimeout(() => askFinalQuestion(), 1000);
    }
}

function askRecommenderName() {
    const messageTime = new Date(); // Capture the message time
    appendMessageWithImageAndTime("What's their name? We'd love to send them a thank you note!", 'bot-message', messageTime);

    const inputGroup = createInputGroup('Enter name', handleRecommenderNameInput);
    document.getElementById('chat-content').appendChild(inputGroup);
    scrollToBottom();
}

function handleRecommenderNameInput(name) {
    if (!name.trim()) {
        alert("Please enter a valid name.");
        return;
    }

    appendMessage(name, 'user-message', false); // Show the name input
    collectedData.recommenderName = name; // Store recommender name
    removeInputGroup(); // Remove the input field
    setTimeout(() => askFinalQuestion(), 1000); // Move to the next question
}

function askFinalQuestion() {
    const messageTime = new Date(); // Capture the message time
    appendMessageWithImageAndTime("Are there any other questions I should pass to my team before they reach out?", 'bot-message', messageTime);

    const inputGroup = createInputGroup('Type here...', handleFinalQuestionInput);
    document.getElementById('chat-content').appendChild(inputGroup);
    scrollToBottom();
}

function handleFinalQuestionInput(finalQuestion) {
    appendMessage(finalQuestion, 'user-message', false); // Show the final question input
    collectedData.finalQuestion = finalQuestion; // Store final question
    removeInputGroup(); // Remove the input field

    // Thank you message at the end
    const messageTime = new Date(); // Capture the message time
        // Directly submit the data and show a thank you message after the last question
        setTimeout(() => {
            submitData(); // Automatically submit data after the last question
        }, 1000);
}

function submitData() {
    const payload = {
        "Situation": collectedData.situation || '',
        "Product Interest": collectedData.productInterest ? collectedData.productInterest.join(', ') : '',
        "Role at Real Estate Firm": collectedData.roleAtLawFirm || '',
        "Cash Save Interest": collectedData.cashSaveInterest || '',
        "Industry": collectedData.industry || '',
        "Full Name": `${collectedData.firstName || ''} ${collectedData.lastName || ''}`,
        "Phone Number": collectedData.phone || '',
        "Email": collectedData.email || '',
        "Using Live Chat": collectedData.usingLiveChat || '',
        "Leads Per Month": collectedData.leadsPerMonth || '',
        "Website Visitors Per Month": collectedData.visitorsPerMonth || '',
        "Recommender": collectedData.recommender || '',
        "Recommender Name": collectedData.recommenderName || '',
        "Final Question": collectedData.finalQuestion || ''
    };

    fetch("https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZjMDYzNDA0MzU1MjZmNTUzZDUxMzMi_pc", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    })
    .then(data => {
        const messageTime = new Date(); // Capture the message time
        appendMessageWithImageAndTime("Thank you for contacting BotmatikPro. One of our account executives will contact you shortly. We are looking forward to learning more about your firm!", 'bot-message', messageTime);
        addCustomHTMLSection(); // Show the thank-you section with scheduling option
    })
    .catch(error => {
        console.error('Error:', error);
        appendMessage("Error submitting data. Please refresh the page talk with chat widget again.", 'bot-message');
    });
}

function addCustomHTMLSection() {
    const chatContent = document.getElementById('chat-content');

    // Create a new div
    const customSection = document.createElement('div');
    customSection.className = 'custom-section';
    
// Adding custom content to the div
customSection.innerHTML = `
    <div style="
        width: auto;
        justify-content: center;
        border: 1px solid #fff;
        border-radius: 20px !important;!i;!;!ix;!ix;!x;
        margin-left: 8px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        margin-right: 8px;
        margin-bottom: 15px !important;!i;!;
    " class="custom-section">
        <img src="https://intaker.blob.core.windows.net/general/11-1636053810.png" alt="appontment-image" class="appointment-image" style="
            width: 100%;
            max-width: 300px;
            border-top-right-radius: 20px;
            border-top-left-radius: 20px;
            height: 160px;
        ">
        <h3 class="appointment-ht" style="
            margin: 0 !important;!i;!;
            font-size: 16px;
            padding-left: 10px;
            color: #498FE1;
        ">Schedule an Intro Call</h3>
        <p class="appointment-para" style="
            margin: 0 !important;!i;!;
            font-size: 14px;
            padding-left: 10px;
            padding-right: 10px;
            margin-bottom: 10px !important;!i;!;
        ">Schedule a short call to see if BotmatikPro is a good fit for your business.</p>
        <a href="https://api.automatikpro.com/widget/booking/ebA3LlojvdnIPE1FzeQE?backgroundColor=%23ffffff&primaryColor=%23178af6ff&buttonText=Schedule+Meeting&showCalendarTitle=true&showCalendarDescription=true&showCalendarDetails=true&default=true" 
           target="_blank" 
           style="text-decoration: auto !important;">
           <!-- target="_blank" added to open in a new tab -->
            <button class="appointment-button" style="
                text-align: center;
                margin-left: auto;
                margin-right: auto;
                display: block;
                background-color: #43a047;
                color: white;
                font-size: 16px;
                border: none;
                padding-top: 10px;
                padding-bottom: 10px;
                margin-bottom: 15px;
                padding-left: 20px;
                padding-right: 20px;
                border-radius: 20px;
            ">
                <img src="https://intaker.azureedge.net/new-dashboard/iconsChat/eventW.svg" class="img-app" style="
                    width: 16px;
                    height: 17px;
                    display: inline-block;
                    background-size: 100%;
                    margin-right: 2px;
                    margin-bottom: -2px;
                ">
                Schedule a meeting
            </button>
        </a> 
    </div>
`;

    
    // Append the custom section to the chat content
    chatContent.appendChild(customSection);
    
    scrollToBottom(); // Scroll to the bottom of the chat after adding the new content
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function createInputGroup(placeholder, callback, value = '', type = 'text', includeCountryCode = false, secondPlaceholder = '') {
  const inputGroup = document.createElement('div');
  inputGroup.className = 'input-group';

  if (includeCountryCode) {
      const countryCodeDropdown = createCountryCodeDropdown();
      inputGroup.appendChild(countryCodeDropdown);
  }

  const inputField = document.createElement('input');
  inputField.className = 'input-field';
  inputField.type = type;
  inputField.value = value;
  inputField.placeholder = placeholder;  // Placeholder for the input
  inputField.style = 'padding: 10px; border-radius: 10px; border: 1px solid #ddd; width: 100%; margin-right: 10px; display: inline-block; box-sizing: border-box;';
  inputGroup.appendChild(inputField);

  // Listen for the "Enter" key to trigger callback
  inputField.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default "Enter" behavior
          if (secondPlaceholder) {
              callback(inputField.value, secondInputField.value); // If second input exists
          } else {
              callback(inputField.value, document.querySelector('select')?.value || ''); // For single input
          }
      }
  });

  if (secondPlaceholder) {
      const secondInputField = document.createElement('input');
      secondInputField.className = 'input-field';
      secondInputField.type = type;
      secondInputField.placeholder = secondPlaceholder;
      secondInputField.style = 'padding: 10px; border-radius: 10px; border: 1px solid #ddd; width: 47%; display: inline-block; box-sizing: border-box;';
      inputGroup.appendChild(secondInputField);

      const submitIcon = createSubmitIcon(() => callback(inputField.value, secondInputField.value));
      inputGroup.appendChild(submitIcon);
  } else {
      const submitIcon = createSubmitIcon(() => callback(inputField.value, document.querySelector('select')?.value || ''));
      inputGroup.appendChild(submitIcon);
  }

  return inputGroup;
}

function createCountryCodeDropdown() {
    const dropdown = document.createElement('select');
    dropdown.className = 'country-code-dropdown';

    const countryCodes = [
        { code: '+1', country: 'USA' },
        { code: '+44', country: 'UK' },
        { code: '+91', country: 'India' },
        { code: '+93', country: 'Afghanistan' },
        { code: '+355', country: 'Albania' },
        { code: '+213', country: 'Algeria' },
        { code: '+376', country: 'Andorra' },
        { code: '+244', country: 'Angola' },
        { code: '+54', country: 'Argentina' },
        { code: '+374', country: 'Armenia' },
        { code: '+297', country: 'Aruba' },
        { code: '+61', country: 'Australia' },
        { code: '+43', country: 'Austria' },
        { code: '+994', country: 'Azerbaijan' },
        { code: '+973', country: 'Bahrain' },
        { code: '+880', country: 'Bangladesh' },
        { code: '+375', country: 'Belarus' },
        { code: '+32', country: 'Belgium' },
        { code: '+501', country: 'Belize' },
        { code: '+229', country: 'Benin' },
        { code: '+975', country: 'Bhutan' },
        { code: '+591', country: 'Bolivia' },
        { code: '+387', country: 'Bosnia and Herzegovina' },
        { code: '+267', country: 'Botswana' },
        { code: '+55', country: 'Brazil' },
        { code: '+673', country: 'Brunei' },
        { code: '+359', country: 'Bulgaria' },
        { code: '+226', country: 'Burkina Faso' },
        { code: '+257', country: 'Burundi' },
        { code: '+855', country: 'Cambodia' },
        { code: '+237', country: 'Cameroon' },
        { code: '+1', country: 'Canada' },
        { code: '+238', country: 'Cape Verde' },
        { code: '+236', country: 'Central African Republic' },
        { code: '+235', country: 'Chad' },
        { code: '+56', country: 'Chile' },
        { code: '+86', country: 'China' },
        { code: '+57', country: 'Colombia' },
        { code: '+269', country: 'Comoros' },
        { code: '+242', country: 'Congo' },
        { code: '+682', country: 'Cook Islands' },
        { code: '+506', country: 'Costa Rica' },
        { code: '+385', country: 'Croatia' },
        { code: '+53', country: 'Cuba' },
        { code: '+357', country: 'Cyprus' },
        { code: '+420', country: 'Czech Republic' },
        { code: '+45', country: 'Denmark' },
        { code: '+253', country: 'Djibouti' },
        { code: '+593', country: 'Ecuador' },
        { code: '+20', country: 'Egypt' },
        { code: '+503', country: 'El Salvador' },
        { code: '+240', country: 'Equatorial Guinea' },
        { code: '+291', country: 'Eritrea' },
        { code: '+372', country: 'Estonia' },
        { code: '+251', country: 'Ethiopia' },
        { code: '+679', country: 'Fiji' },
        { code: '+358', country: 'Finland' },
        { code: '+33', country: 'France' },
        { code: '+241', country: 'Gabon' },
        { code: '+220', country: 'Gambia' },
        { code: '+995', country: 'Georgia' },
        { code: '+49', country: 'Germany' },
        { code: '+233', country: 'Ghana' },
        { code: '+30', country: 'Greece' },
        { code: '+299', country: 'Greenland' },
        { code: '+502', country: 'Guatemala' },
        { code: '+224', country: 'Guinea' },
        { code: '+245', country: 'Guinea-Bissau' },
        { code: '+592', country: 'Guyana' },
        { code: '+509', country: 'Haiti' },
        { code: '+504', country: 'Honduras' },
        { code: '+852', country: 'Hong Kong' },
        { code: '+36', country: 'Hungary' },
        { code: '+354', country: 'Iceland' },
        { code: '+62', country: 'Indonesia' },
        { code: '+98', country: 'Iran' },
        { code: '+964', country: 'Iraq' },
        { code: '+353', country: 'Ireland' },
        { code: '+972', country: 'Israel' },
        { code: '+39', country: 'Italy' },
        { code: '+81', country: 'Japan' },
        { code: '+962', country: 'Jordan' },
        { code: '+7', country: 'Kazakhstan' },
        { code: '+254', country: 'Kenya' },
        { code: '+686', country: 'Kiribati' },
        { code: '+383', country: 'Kosovo' },
        { code: '+965', country: 'Kuwait' },
        { code: '+996', country: 'Kyrgyzstan' },
        { code: '+856', country: 'Laos' },
        { code: '+371', country: 'Latvia' },
        { code: '+961', country: 'Lebanon' },
        { code: '+266', country: 'Lesotho' },
        { code: '+231', country: 'Liberia' },
        { code: '+218', country: 'Libya' },
        { code: '+423', country: 'Liechtenstein' },
        { code: '+370', country: 'Lithuania' },
        { code: '+352', country: 'Luxembourg' },
        { code: '+853', country: 'Macau' },
        { code: '+389', country: 'Macedonia' },
        { code: '+261', country: 'Madagascar' },
        { code: '+265', country: 'MaReal Estatei' },
        { code: '+60', country: 'Malaysia' },
        { code: '+960', country: 'Maldives' },
        { code: '+223', country: 'Mali' },
        { code: '+356', country: 'Malta' },
        { code: '+692', country: 'Marshall Islands' },
        { code: '+222', country: 'Mauritania' },
        { code: '+230', country: 'Mauritius' },
        { code: '+52', country: 'Mexico' },
        { code: '+691', country: 'Micronesia' },
        { code: '+373', country: 'Moldova' },
        { code: '+377', country: 'Monaco' },
        { code: '+976', country: 'Mongolia' },
        { code: '+382', country: 'Montenegro' },
        { code: '+212', country: 'Morocco' },
        { code: '+258', country: 'Mozambique' },
        { code: '+95', country: 'Myanmar' },
        { code: '+264', country: 'Namibia' },
        { code: '+674', country: 'Nauru' },
        { code: '+977', country: 'Nepal' },
        { code: '+31', country: 'Netherlands' },
        { code: '+64', country: 'New Zealand' },
        { code: '+505', country: 'Nicaragua' },
        { code: '+227', country: 'Niger' },
        { code: '+234', country: 'Nigeria' },
        { code: '+683', country: 'Niue' },
        { code: '+850', country: 'North Korea' },
        { code: '+47', country: 'Norway' },
        { code: '+968', country: 'Oman' },
        { code: '+92', country: 'Pakistan' },
        { code: '+680', country: 'Palau' },
        { code: '+507', country: 'Panama' },
        { code: '+675', country: 'Papua New Guinea' },
        { code: '+595', country: 'Paraguay' },
        { code: '+51', country: 'Peru' },
        { code: '+63', country: 'Philippines' },
        { code: '+48', country: 'Poland' },
        { code: '+351', country: 'Portugal' },
        { code: '+974', country: 'Qatar' },
        { code: '+40', country: 'Romania' },
        { code: '+7', country: 'Russia' },
        { code: '+250', country: 'Rwanda' },
        { code: '+685', country: 'Samoa' },
        { code: '+378', country: 'San Marino' },
        { code: '+239', country: 'Sao Tome and Principe' },
        { code: '+966', country: 'Saudi Arabia' },
        { code: '+221', country: 'Senegal' },
        { code: '+381', country: 'Serbia' },
        { code: '+248', country: 'Seychelles' },
        { code: '+232', country: 'Sierra Leone' },
        { code: '+65', country: 'Singapore' },
        { code: '+421', country: 'Slovakia' },
        { code: '+386', country: 'Slovenia' },
        { code: '+677', country: 'Solomon Islands' },
        { code: '+252', country: 'Somalia' },
        { code: '+27', country: 'South Africa' },
        { code: '+82', country: 'South Korea' },
        { code: '+34', country: 'Spain' },
        { code: '+94', country: 'Sri Lanka' },
        { code: '+249', country: 'Sudan' },
        { code: '+597', country: 'Suriname' },
        { code: '+268', country: 'Swaziland' },
        { code: '+46', country: 'Sweden' },
        { code: '+41', country: 'Switzerland' },
        { code: '+963', country: 'Syria' },
        { code: '+886', country: 'Taiwan' },
        { code: '+992', country: 'Tajikistan' },
        { code: '+255', country: 'Tanzania' },
        { code: '+66', country: 'Thailand' },
        { code: '+228', country: 'Togo' },
        { code: '+676', country: 'Tonga' },
        { code: '+216', country: 'Tunisia' },
        { code: '+90', country: 'Turkey' },
        { code: '+993', country: 'Turkmenistan' },
        { code: '+688', country: 'Tuvalu' },
        { code: '+256', country: 'Uganda' },
        { code: '+380', country: 'Ukraine' },
        { code: '+971', country: 'United Arab Emirates' },
        { code: '+598', country: 'Uruguay' },
        { code: '+998', country: 'Uzbekistan' },
        { code: '+678', country: 'Vanuatu' },
        { code: '+58', country: 'Venezuela' },
        { code: '+84', country: 'Vietnam' },
        { code: '+967', country: 'Yemen' },
        { code: '+260', country: 'Zambia' },
        { code: '+263', country: 'Zimbabwe' }
    ];


    countryCodes.forEach(({ code, country }) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code} (${country})`;
        dropdown.appendChild(option);
    });

    return dropdown;
}

function createSubmitIcon(callback) {
    const submitIcon = document.createElement('div');
    submitIcon.className = 'submit-icon';
    const iconImg = document.createElement('img');
    iconImg.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66fa91a7923b423d630ec12e.png';
    submitIcon.appendChild(iconImg);
    submitIcon.onclick = callback;
    return submitIcon;
}

function removeInputGroup() {
    const inputGroup = document.querySelector('.input-group');
    if (inputGroup) {
        inputGroup.remove();
    }
}

function removeOptions() {
    const options = document.querySelector('.chat-options');
    if (options) {
        options.remove();
    }
}

function appendMessage(text, className, isOption = false) {
    
    const chatContent = document.getElementById('chat-content');
    const messageContainer = document.createElement('div'); // Container for message and button
    messageContainer.className = `message-container ${className}`;
    messageContainer.style.display = 'flex'; // Use flexbox for alignment

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = text;

    if (className === 'user-message') {
        // Align user messages to the right
        messageContainer.style.justifyContent = 'flex-end';

        const actionButton = document.createElement('button');
        
        if (isOption) {
            // Use setTimeout to delay adding the Undo button
            setTimeout(() => {
                // Undo button for option responses
                actionButton.className = 'undo-btn';
                actionButton.innerHTML = '<img src="https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66facd71721de4859347dd07.png" alt="Undo"><p>Undo</p>';
                actionButton.onclick = () => {
                    renderChatWidget(); // Restart the chat on Undo
                };
                disablePreviousUndoButtons(); // Disable previous Undo buttons

                // Place undo button on the left (before the message)
                messageContainer.insertBefore(actionButton, messageDiv);
                scrollToBottom(); // Ensure scroll is updated after the button is added
            }, 1000); // 1000ms (1 second) delay
        } else {
            // Edit button for typed responses
            actionButton.className = 'edit-btn';
            actionButton.innerHTML = '<img src="https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/6710017e97369c4cdced00fb.png" alt="Edit">';
            actionButton.onclick = () => handleEdit(messageDiv, (newText) => {
                collectedData.situation = newText;
            });

            // Place edit button after the message
            messageContainer.appendChild(actionButton);
        }

        messageContainer.appendChild(messageDiv);
    } else {
        // For bot messages, just append the message
        messageContainer.appendChild(messageDiv);
    }

    chatContent.appendChild(messageContainer);
    scrollToBottom();
}  

function scrollToBottom() {
    const chatContent = document.getElementById('chat-content');
    chatContent.scrollTop = chatContent.scrollHeight;

}

function handleEdit(element, callback) {
    // Store the current text content of the message
    const originalText = element.textContent;
    const inputField = document.createElement('input');
    inputField.className = 'input-field';
    inputField.value = originalText;
    element.parentNode.replaceChild(inputField, element);

    // Save button for the inline edit
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'save-btn';

    // Save button functionality
    saveButton.onclick = () => {
        const newText = inputField.value;
        element.textContent = newText;
        inputField.parentNode.replaceChild(element, inputField);
        saveButton.remove();
        callback(newText);  // Update the `collectedData` object
    };

    inputField.parentNode.appendChild(saveButton);
}

// Initialize video progress
function initializeVideoProgress(video, progressBar) {
    if (video && progressBar) {
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${progress}%`;
        });
    }
}

function selectOption(optionText, isOption) {
    questionStack.push({ question: "service", answer: optionText }); // Track question in stack
    const progressBarContainer = document.querySelector('.progress-bar-container');
    if (progressBarContainer) {
        progressBarContainer.style.display = 'none';
    }
  

  const emptyContainer = document.querySelector('.Empty-container');
  if (emptyContainer) {
      emptyContainer.style.display = 'none';
  }

  
  const playPauseButton = document.querySelector('#play-pause-btn');
  if (playPauseButton) {
      playPauseButton.style.display = 'none';
  }

  const payPauseButton = document.querySelector('#pay-pause-btn');
  if (payPauseButton) {
      payPauseButton.style.display = 'block';
  }

  const muteUnmuteButton = document.querySelector('#mute-unmute-btn');
  if (muteUnmuteButton) {
      muteUnmuteButton.style.display = 'none';
  }

  const chatHeader = document.querySelector('.chat-header');
  if (chatHeader) {
      chatHeader.classList.add('sticky-header');
  }
  
  const chatContent = document.querySelector('.chat-content');
  chatContent.style.height = '95%'; // Set max-height to 95%

  // Create a new div for the video container
  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-container';
  videoContainer.style.position = 'relative';

  // Move the background video into the new container
  const backgroundVideo = document.getElementById('background-video');
  videoContainer.appendChild(backgroundVideo);



  // Append the icon to the button
  playPauseBtn.appendChild(playPauseIcon);

  // Style the button (optional)
  playPauseBtn.style.position = 'absolute';
  playPauseBtn.style.top = '45%';
  playPauseBtn.style.left = '20%';
  playPauseBtn.style.transform = 'translate(-50%, -50%)';

  // Append the play/pause button to the video container
  videoContainer.appendChild(playPauseBtn);

  // Insert the video container into chat content
  chatContent.insertBefore(videoContainer, chatContent.firstChild);

  // Add class for moving the video to the corner and pause it
  backgroundVideo.classList.add("move-video-to-corner");
  backgroundVideo.pause();

  // Change the message class for previous bot messages
  const elementsToChange = document.querySelectorAll('.message.ot-message');
  elementsToChange.forEach(element => {
      element.classList.replace('message', 'wec-whit');
      element.classList.remove('bot-message');
  });

  console.log("option_text:", optionText);

  appendMessage(optionText, 'user-message', isOption);
  collectedData.service = optionText;
  document.querySelector('.chat-options').innerHTML = '';

  // Call askSituation after a brief delay
  setTimeout(() => askSituation(), 1000);
}

function togglePlayPause() {
    console.log("calling togglePlayPause");

    const video = document.getElementById('background-video');
    const playPauseIcon = document.getElementById('play-pause-icon');
    
    if (video.paused) {
        video.play(); // Play the video
        playPauseIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb060cf9de91b118c93a66.png'; // Change icon to pause
    } else {
        video.pause(); // Pause the video
        playPauseIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0ca1f9de91588ec93e8c.png'; // Change icon to play
    }
}

function toggleMute() {
    const muteIcon = document.getElementById('mute-unmute-icon');
    if (backgroundVideo.muted) {
        backgroundVideo.muted = false;
        thumbnailVideo.muted = false;
        muteIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0d81f003010e66500af7.png';
    } else {
        backgroundVideo.muted = true;
        thumbnailVideo.muted = true;
        muteIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0b2cc6a83988da4ff9fd.png';
    }
}

function closeWidget() {
    toggleChatWidget(false);
}

function disablePreviousUndoButtons() {
    // Select all undo buttons that aren't already disabled
    const previousUndoButtons = document.querySelectorAll('.undo-btn:not(.disabled)');
    previousUndoButtons.forEach(button => {
        button.disabled = true;
        button.classList.add('disabled'); // Optionally add a 'disabled' style
    });
}

function initializePayPauseButton() {
    const payPauseBtn = document.getElementById('pay-pause-btn');
    if (payPauseBtn) {
        payPauseBtn.addEventListener('click', renderCustomerSupportWidget); // Call renderChatWidget on click
    }
}

// Function to render the chat widget (as provided)
function renderChatWidget() {
    const chatWidgetContainer = document.getElementById('chat-widget');
    chatWidgetContainer.style.display = 'block'; // Show the chat widget

    // Clear previous content
    const chatContent = document.getElementById('chat-content');
    chatContent.style.maxHeight = '85%'; // Set max-height to 85%
    chatContent.innerHTML = ''; // Clear current content

    const chatHeader = document.getElementById('chat-header');
    if (chatHeader) {
        chatHeader.classList.remove('sticky-header');
    }
    chatHeader.innerHTML = "";

    // Video background and progress bar
    const videoBackground = document.getElementById('video-background');
    videoBackground.innerHTML = `
        <video id="background-video" autoplay loop muted>
            <source src="https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/6716af88e292f451e7f0f5f1.mp4" type="video/mp4">
        </video>
        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar"></div>
        </div>
    `;

    // Initialize the video and progress bar
    const video = document.getElementById('background-video');
    const progressBar = document.getElementById('progress-bar');
    initializeVideoProgress(video, progressBar);

    let emptyContainer = document.querySelector('.Empty-container');
    if (emptyContainer) {
        emptyContainer.style.display = 'none';
    } else {
        emptyContainer = document.createElement('div');
        emptyContainer.className = 'Empty-container';
        chatContent.appendChild(emptyContainer);
    }

    // Create Play/Pause button
    const playPauseBtn = document.createElement('button');
    playPauseBtn.id = 'play-pause-btn';
    playPauseBtn.className = 'control-btn';
    playPauseBtn.setAttribute('aria-label', 'Play/Pause');

    const playPauseIcon = document.createElement('img');
    playPauseIcon.id = 'play-pause-icon';
    playPauseIcon.className = 'control-btn';
    playPauseIcon.setAttribute('aria-label', 'Play/Pause');
    playPauseIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb060cf9de91b118c93a66.png';
    playPauseIcon.alt = 'Play/Pause Icon';

    playPauseBtn.appendChild(playPauseIcon);
    playPauseBtn.onclick = togglePlayPause;

    // Create Mute/Unmute button
    const muteUnmuteBtn = document.createElement('button');
    muteUnmuteBtn.id = 'mute-unmute-btn';
    muteUnmuteBtn.className = 'control-btn';
    muteUnmuteBtn.setAttribute('aria-label', 'Mute/Unmute');
    muteUnmuteBtn.onclick = toggleMute;

    const muteUnmuteIcon = document.createElement('img');
    muteUnmuteIcon.id = 'mute-unmute-icon';
    muteUnmuteIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0b2cc6a83988da4ff9fd.png';
    muteUnmuteBtn.appendChild(muteUnmuteIcon);

    // Create Refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'refresh-btn';
    refreshBtn.className = 'control-btn';
    refreshBtn.setAttribute('aria-label', 'Refresh');

    const refreshIcon = document.createElement('img');
    refreshIcon.id = 'refresh-icon';
    refreshIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb04eaa256dd3e330dde51.png';
    refreshBtn.onclick = resetChatAndReload;
    refreshBtn.appendChild(refreshIcon);

    // Create Close button
    const closeBtn = document.createElement('button');
    closeBtn.id = 'close-btn';
    closeBtn.setAttribute('aria-label', 'Close chat widget');
    closeBtn.onclick = closeWidget;

    const closeIcon = document.createElement('img');
    closeIcon.id = 'close-icon';
    closeIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0456b8d5546df6dc3dac.png';
    closeBtn.appendChild(closeIcon);

    // Append buttons to chat header
    chatHeader.appendChild(playPauseBtn);
    chatHeader.appendChild(muteUnmuteBtn);
    chatHeader.appendChild(refreshBtn);
    chatHeader.appendChild(closeBtn);

    // Welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message ot-message';
    welcomeMessage.textContent = `Hi 👋🏼 Let's find out if BotmatikPro can help your firm in`;

    // Chat options
    const chatOptions = document.createElement('div');
    chatOptions.className = 'chat-options';
    
    const options = ['Go ahead'];

    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn bef';
        button.textContent = option;
        button.onclick = () => {
            selectOption(option, true); // Call selectOption when button is clicked
        };
        chatOptions.appendChild(button);
    });

    // Append welcome message and options to chat content
    chatContent.appendChild(welcomeMessage);
    chatContent.appendChild(chatOptions);
}

document.addEventListener('DOMContentLoaded', function () {
    // Call initializePayPauseButton or other initialization functions here
    initializePayPauseButton();
});

document.getElementById('chat-content').addEventListener('click', function(event) {
    if (event.target && event.target.id === 'pay-pause-btn') {
        togglePlayPause();
    }
});

// Function to render the customer support chat widget
function renderCustomerSupportWidget() {
    const chatWidgetContainer = document.getElementById('chat-widget');
    chatWidgetContainer.style.display = 'block'; // Show the chat widget

    // Clear previous content
    const chatContent = document.getElementById('chat-content');
    chatContent.style.maxHeight = '85%'; // Set max-height to 85%
    chatContent.innerHTML = ''; // Clear current content

    const chatHeader = document.getElementById('chat-header');
    if (chatHeader) {
        chatHeader.classList.remove('sticky-header');
    }
    chatHeader.innerHTML = "";

    // Video background and progress bar
    const videoBackground = document.getElementById('video-background');
    videoBackground.innerHTML = `
        <video id="background-video" autoplay loop muted>
            <source src="https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/6716af88e292f451e7f0f5f1.mp4" type="video/mp4">
        </video>
        <div class="progress-bar-container">
            <div class="progress-bar" id="progress-bar"></div>
        </div>
    `;

    // Initialize the video and progress bar
    const video = document.getElementById('background-video');
    const progressBar = document.getElementById('progress-bar');
    initializeVideoProgress(video, progressBar);

    let emptyContainer = document.querySelector('.Empty-container');
    if (emptyContainer) {
        emptyContainer.style.display = 'none';
    } else {
        emptyContainer = document.createElement('div');
        emptyContainer.className = 'Empty-container';
        chatContent.appendChild(emptyContainer);
    }

    // Create Play/Pause button
    const playPauseBtn = document.createElement('button');
    playPauseBtn.id = 'play-pause-btn';
    playPauseBtn.className = 'control-btn';
    playPauseBtn.setAttribute('aria-label', 'Play/Pause');

    const playPauseIcon = document.createElement('img');
    playPauseIcon.id = 'play-pause-icon';
    playPauseIcon.className = 'control-btn';
    playPauseIcon.setAttribute('aria-label', 'Play/Pause');
    playPauseIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb060cf9de91b118c93a66.png';
    playPauseIcon.alt = 'Play/Pause Icon';

    playPauseBtn.appendChild(playPauseIcon);
    playPauseBtn.onclick = togglePlayPause;

    // Create Mute/Unmute button
    const muteUnmuteBtn = document.createElement('button');
    muteUnmuteBtn.id = 'mute-unmute-btn';
    muteUnmuteBtn.className = 'control-btn';
    muteUnmuteBtn.setAttribute('aria-label', 'Mute/Unmute');
    muteUnmuteBtn.onclick = toggleMute;

    const muteUnmuteIcon = document.createElement('img');
    muteUnmuteIcon.id = 'mute-unmute-icon';
    muteUnmuteIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0b2cc6a83988da4ff9fd.png';
    muteUnmuteBtn.appendChild(muteUnmuteIcon);

    // Create Refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'refresh-btn';
    refreshBtn.className = 'control-btn';
    refreshBtn.setAttribute('aria-label', 'Refresh');

    const refreshIcon = document.createElement('img');
    refreshIcon.id = 'refresh-icon';
    refreshIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb04eaa256dd3e330dde51.png';
    refreshBtn.onclick = resetChatAndReload;
    refreshBtn.appendChild(refreshIcon);

    // Create Close button
    const closeBtn = document.createElement('button');
    closeBtn.id = 'close-btn';
    closeBtn.setAttribute('aria-label', 'Close chat widget');
    closeBtn.onclick = closeWidget;

    const closeIcon = document.createElement('img');
    closeIcon.id = 'close-icon';
    closeIcon.src = 'https://storage.googleapis.com/msgsndr/aJYHtddTenz299BOqzfz/media/66eb0456b8d5546df6dc3dac.png';
    closeBtn.appendChild(closeIcon);

    // Append buttons to chat header
    chatHeader.appendChild(playPauseBtn);
    chatHeader.appendChild(muteUnmuteBtn);
    chatHeader.appendChild(refreshBtn);
    chatHeader.appendChild(closeBtn);

    // Welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message ot-message';
    welcomeMessage.textContent = `Hi 👋🏼 Let's find out if BotmatikPro can help your firm in`;

    // Chat options
    const chatOptions = document.createElement('div');
    chatOptions.className = 'chat-options';
    
    const options = ['Go ahead'];

    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'message user-message';
        button.textContent = option;
        button.onclick = () => {
            selectOption(option, true); // Call selectOption when button is clicked
        };
        chatOptions.appendChild(button);
    });
    // Append welcome message and options to chat content
    chatContent.appendChild(welcomeMessage);
    chatContent.appendChild(chatOptions);
}