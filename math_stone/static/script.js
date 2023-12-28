function main() {
    storedColorScheme();
    wavesEffectToggle();
    toggleColorScheme();

    switch (window.location.pathname) {
        case '/':
            initIndexPage()
            break;

        case '/home':
            initHomePage();
            break;

        case '/profile':
            initProfilePage()
            break;
        
        case '/game_history':
            initGameHistoryPage();
            break;

        case '/leaderboard':
            initLeaderboardPage();
            break;
    }
}

// Initialzies all the functions that run when index.html is loaded
function initIndexPage() {
    initForm();
    registerFormSubmit();
    loginFormSubmit();
}

// Initialzies all the functions that run when home.html is loaded
function initHomePage() {
    // Everything in Home-Tab
    loadSwitchboard();
    saveSwitchboard();

    updateUserLevels();
    displayLastGamesPlayed();
    switchHomeTabs();

    initDropdownMenu();
    initModeSelectSwiper();
    toggleSwitchboard();
    updateSliderValues();
    modeSelectMultipleChoice();
    submitButtonActivation();
    startGame();

    // Everything for Game-Tab
    const exitButtonNodeList = document.querySelectorAll('.header-bar');
    initToolTips(exitButtonNodeList)
}

// Initialzies all the functions that run when profile.html is loaded
function initProfilePage() {
    initDropdownMenu();
    initProfileSearch();
}

// Initialzies all the functions that run when game_history.html is loaded
function initGameHistoryPage() {
    initDropdownMenu();
    initGameHistoryTable();
    initGameHistoryFilter();
}

// Initializes all the functions that run when leaderboard.html is loaded
function initLeaderboardPage() {
    initDropdownMenu();
    initLeaderboardSwiper();
    initLeaderboardShadows();
}

// If the user has the dark-mode setting switched on 
// then html gets set to dark every time a page loads 
function storedColorScheme() {
    let html = document.querySelector('html')
    let storedMode = sessionStorage.getItem('prefferedMode')

    if (storedMode == 'dark') {
        html.classList.remove('light');
        html.classList.add('dark');
    }
}

// Gives toggle functionality to the dark-mode-toggle buttons 
// found in every page
function toggleColorScheme() {
    const toggle = document.querySelector('.dark-mode-toggle');
    const html = document.querySelector('html');
    const icon = toggle.querySelector('span');

    toggle.addEventListener('click', function() {
        if (html.classList.contains('light') == true) {
            html.classList.remove('light');
            html.classList.add('dark');
            sessionStorage.setItem('prefferedMode', 'dark');
            if (icon !== null) {
                icon.innerHTML = 'dark_mode';
            }
        } 
        else if (html.classList.contains('dark') == true) {
            html.classList.remove('dark');
            html.classList.add('light');
            sessionStorage.setItem('prefferedMode', 'light');
            if (icon !== null) {
                icon.innerHTML = 'light_mode';
            }
        }
        wavesEffectToggle();
    });
}

// Called in toggleColorScheme() to also toggles the color of the waves-effect from the Materialize library
function wavesEffectToggle() {
    let waveElements = document.querySelectorAll('.waves-effect')
    let html = document.querySelector('html')
    
    for (let i = 0; i < waveElements.length; i++) {
        let waveElement = waveElements[i]
        if (html.classList.contains('light')) {
            waveElement.classList.add('waves-dark')
            waveElement.classList.remove('waves-light')
        } 
        else if (html.classList.contains('dark')) {
            waveElement.classList.add('waves-light')
            waveElement.classList.remove('waves-dark')
        }
    }
}


// Initializes modals and tabs and links the correct modal tab with its cooresponding button
function initForm() {
    // Initialize modal
    const modal = document.querySelector('.modal')
    const modalInstance = M.Modal.init(modal);

    // Initialize tabs
    const tab = document.querySelector('.tabs')
    const tabInstances = M.Tabs.init(tab);
    
    const loginButton = document.getElementById('login-button')
    const registerButton = document.getElementById('register-button')
    
    loginButton.addEventListener('click', function() {
        modalInstance.open();
        tabInstances.select('login-tab')
        setTimeout(function() {
            tabInstances.select('login-tab')
          }, 300);
    });
    registerButton.addEventListener('click', function() {
        modalInstance.open();
        tabInstances.select('register-tab')
        setTimeout(function() {
            tabInstances.select('register-tab')
          }, 300);
    });
}

// Resets login and registration froms back to their default values
function clearForm() {
    const modalOverlay = document.querySelector('.modal-overlay')
    const forms = document.querySelectorAll('form')

    for (let i = 0; i < forms.length; i++) {
        let form = forms[i]
        let inputs = form.querySelectorAll('.input-box')
        let inputErrorBoxes = form.querySelectorAll('.form-error')
        let inputLabels = form.querySelectorAll('label')
        for (let j = 0; j < inputs.length; j++ ) {
            let input = inputs[j];
            let inputErrorBox = inputErrorBoxes[j];
            let inputLabel = inputLabels[j];
            
            input.classList.remove('success', 'failure');
            inputErrorBox.classList.remove('success', 'failure', 'fade-in', 'fade-out')
            inputLabel.classList.remove('success', 'failure');

            inputErrorBox.innerHTML = '';
            input.value = '';
        }
    }
    modalOverlay.click();
}

/**
 * Updates the messages displayed on the toast and its class
 * 
 * @param {string} message - The message displayed on the toast
 * @param {string} messageType - The class that gets applied to the toast
 * @param {bool} displayNow - if True, display the sessionMessage regardless of the displayMessage flag
*/
function updateSessionMessage(message, messageType, displayNow=false) {
    sessionStorage.setItem('message', message);
    sessionStorage.setItem('messageType', messageType);
   
    if (displayNow == true) {
        displaySessionInformation()
    }
}

// Pops up the toast message with the message saved in session storage
function displaySessionInformation() {
    let message = sessionStorage.getItem('message');
    let messageType = sessionStorage.getItem('messageType');
    
    if (message != null || messageType != null) {
        M.toast({html: message, classes: messageType})
    }
}


/**
* When the submit button is pressed check if the form is valid with loginFormCheck()
* if loginFormCheck() returns true then submit the form to app.py
*/
function loginFormSubmit() {
    const loginForm = document.getElementById('login-form')

    loginForm.addEventListener('submit', async function(e)  {
        e.preventDefault();
        var isValid = await loginFormCheck()
        if (isValid == true) {
            updateSessionMessage('Login Successful', 'success');
            loginForm.submit();
        }
    });
}

// Adds functionality to the logout button and clears the sessionStorage
function initLogoutButton() {
    const logoutForm = document.getElementById('logout-form');
    
    logoutForm.addEventListener('submit', function() {
        updateSessionMessage('Logout Successful', 'success', true);
        sessionStorage.clear();
    });
}

/**
* Does a series of checks on each of the input fields in the form, if one of them fails 
* then it doesn't move onto the next one at all, displays the relevant error information
* under the form that failed. It gets called by loginFormSubmit()
* If the check was succesful it returns true and form submits, otherwise it returns false
* with a message specifying what part of the check failed
*/
async function loginFormCheck() {
    var username = document.getElementById('username');
    var usernameErrorBox = document.getElementById('username-error');
    var usernameLabel = document.getElementById('username-label');
    
    var password = document.getElementById('password');
    var passwordErrorBox = document.getElementById('password-error');
    var passwordLabel = document.getElementById('password-label');

    var unsuccessfulAttemptsLeft = password.dataset.attempts;

    if (!errorHandler(usernameBasicCheck(username.value), username, usernameErrorBox, usernameLabel)) {
        return false;
    }

    let isUsernameAvailable = await checkUsernameAvailability(username.value)
    
    if (isUsernameAvailable == false) {
        isUsernameAvailable = 'Username is not registered';
    } 
    if (!errorHandler(isUsernameAvailable, username, usernameErrorBox, usernameLabel)) {
        return false;
    }

    isLoginSuccessful = await checkValidLogin(username.value, password.value)
    if (isLoginSuccessful == false) {
        isLoginSuccessful = 'Login Unsuccessful';
    }
        
    if (!errorHandler(isLoginSuccessful, password, passwordErrorBox, passwordLabel)) {
        unsuccessfulAttemptsLeft--;
        password.dataset.attempts = unsuccessfulAttemptsLeft;
        if (password.dataset.attempts == 0) {
            password.dataset.attempts = 3;
            updateSessionMessage('Too many unsuccessful login attempts', 'error')
            clearForm();
        }
        return false;
    }

    sessionStorage.setItem('username', username.value)
    return true;
}

/**
* When the Register form is submitted it calls the asynchronous function registerFormCheck()
* to test the input fields one by one, if one of the tests fails it displays the error message
* associated with the failure and shows some visual queues to help the user. 
* If it passes all the checks then the form gets submitted to app.py for additional backend checks
* and hopefully a successful registration if those checks also pass which they should unless the user
* has tampered with the html of the website
*/
function registerFormSubmit() {
    var registerForm = document.getElementById('reg-form')

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        let isValid = await registerFormCheck()
        if (isValid == true) {
            updateSessionMessage('Registration Successful', 'success')
            registerForm.submit();
        }
    })
}

/**
* Gets called by registerFormSubmit() and runs a series of checks on the input fields 
* in the register form, if any of them fail Then return an error with an error message.
* if it successfully passes all the tests then return true and the form can be submitted
*/
async function registerFormCheck() {
    const username = document.getElementById('reg-username');
    const usernameErrorBox = document.getElementById('reg-username-error');
    const usernameLabel = document.getElementById('reg-username-label');
    
    const password = document.getElementById('reg-password');
    const passwordErrorBox = document.getElementById('reg-password-error')
    const passwordLabel = document.getElementById('reg-password-label')
    
    const confirm = document.getElementById('reg-confirm');
    const confirmErrorBox = document.getElementById('reg-confirm-error')
    const confirmLabel = document.getElementById('reg-confirm-label')

    if (!errorHandler(usernameBasicCheck(username.value), username, usernameErrorBox, usernameLabel)) {   
        return false;
    }
    isUsernameAvailable = await checkUsernameAvailability(username.value)

    if (isUsernameAvailable == true) {
        isUsernameAvailable = 'Username is already registered';
        errorHandler(isUsernameAvailable, username, usernameErrorBox, usernameLabel)
        return false;
    } 

    if (!errorHandler(passwordBasicCheck(password.value), password, passwordErrorBox, passwordLabel)) {
        return false;
    }

    if (!errorHandler(confirmBasicCheck(password.value, confirm.value), confirm, confirmErrorBox, confirmLabel)) {
        return false;
    }
    sessionStorage.setItem('username', username.value)
    return true;
}

/** 
* Basic regex validation tests for creating a valid username during registration,
* If it fails return an error message detailing the failure, if passes all then return true
*
* @param {string} username - The username the user enters in the input field
*/
function usernameBasicCheck(username) {
    if (username.length == 0) {
        return 'Must enter a username'
    }

    if (/\s/.test(username)) {
        return "Username can't any contain spaces"
    }

    if (username.length < 1 || username.length > 32) {
        return 'Username must be between 1-32 characters long';
    }

    if (/^[A-z]/.test(username) == false) {
        return 'Username must start with a letter';
    }

    return true;
}

/**
* Basic regex checks to make sure the password isn't too basic
* If it fails return an error message detailing the failure, if passes all then return true
*
* @param {string} password - The password that the user entered in the input field
* @returns {string|boolean} - A string return indciates failure and contains the message,  
*                             returns true if it passes all the checks
*/                            
function passwordBasicCheck(password) {
    if (password.length == 0 ) {
        return 'Must enter a password'
    }
    
    if (password.length < 8) {
        return 'Password must be atleast 8 characters long'
    }
    
    if (/\s/.test(password)) {
        return "Password can't any contain spaces"
    }

    if (/^[a-zA-Z]+$/.test(password)) {
        return 'Password must contain atleast one letter and number'
    }
    return true
}


/**
 * Simple function that checks if the password and password confirmation field match
 * 
 * @param {string} password - The password the user entered in the input field
 * @param {string} confirm - The password confirmation the user entered in the input field
 * @returns {string|bool}
 */
function confirmBasicCheck(password, confirm) {
    if (password != confirm) {
        return 'Confirmation and password must match'
    }
    return true
}

/**
 * Whenever a test fails in the login or registration this function is responsible
 * for displaying the erorr message and changing the css to indicate that it failed,
 * also clears the error message and reverts the css to indciate success
 * 
 * @param {string|true} errorMessage - If its true then apply the succesful css, if its an error message
 *                                     then display the message and change the css to indicate failure
 * @param {*} input - The input field itself so the css can be applied onto it
 * @param {*} inputErrorBox - The error box that holds the text
 * @param {*} inputLabel - Extra element related to the materialze library that also needs to be changed
 * @returns {bool} - returns either true or false to indicate if that its completed and what the result was
 */
function errorHandler(errorMessage, input, inputErrorBox, inputLabel) {
    if (errorMessage != true) {
        inputErrorBox.innerHTML = errorMessage;

        inputErrorBox.classList.remove('fade-out')
        inputErrorBox.classList.add('fade-in');

        inputLabel.classList.remove('success');
        inputLabel.classList.add('failure');
        input.classList.add('failure');
        return false
    }
    else {
        inputErrorBox.classList.remove('fade-in');
        inputErrorBox.classList.add('fade-out');

        inputLabel.classList.add('success');
        input.classList.add('success');
        inputLabel.classList.remove('failure');
        input.classList.remove('failure');
        return true
    }
}

/**
 * AJAX request sent to app.py which runs a database query to check if the username exists in the db
 * Gets called in the login and registration check functions and in profile.html when searching for a profile
 * 
 * @param {string} username - The username provided by  
 * @returns {bool} the response is either true or false or an error if the async function fails
 */
async function checkUsernameAvailability(username) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'check_username_availability',
            method: 'POST',
            dataType: 'JSON',
            data: {'username': username},
            success: function(response) {
                resolve(response)
            },
            error: function(xhr, status, error) {
                console.log('CHECK USERNAME AVAILABILITY - ERROR')
                reject(error);
            }
        });
    })
    .then(function(response) {
        return response
    })
    .catch(function(error) {
        throw error
    });
}

/**
 * Sends AJAX request to do a backend check to see if the login is successful
 * 
 * @param {*} username - The username entered in the login input field
 * @param {*} password - The password entered int he password input field
 * @returns 
 */
function checkValidLogin(username, password) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/check_valid_login',
            method: 'POST',
            dataType: 'json',
            data: {'username': username, 'password': password},
            success: function(response) {
                resolve(response['valid']);
            },
            error: function(xhr, status, error) {
                console.log('checkValidLogin Error', xhr, status, error)
                reject(error);
            }
        });
    });
}

/**
 * Sends AJAX request to redirect to error.html with errorMessage and errorCode
 * 
 * @param {*} errorMessage - The error message indicating what went wrong
 * @param {*} errorCode - The error code associated with the type of error
 */
function errorRedirect(errorMessage, errorCode) {
    $.ajax({
        url: '/error_redirect',
        method: 'POST',
        dataType: 'json',
        data: {'errorMessage': errorMessage, 'errorCode': errorCode},
        success: function(response) {
            console.log('errorRedirect Success.', response);
        },
        error: function(xhr, status, error) {
            console.log('errorRedirect Failure.', xhr, status, error);
        }
    })
}

/**
 * Function that switches tabs in home.html when a the user starts and ends a game
 * 
 * @param {string} tab - The only args that work here are home-tab and game-tab
 */
function switchHomeTabs(tab) {
    const tabs = document.querySelectorAll('.full-page');
    // Current tabs: 'home-tab', 'game-tab'

    if (tab != null) {
        tabs.forEach((element) => {
            element.classList.remove('active');
            if (element.id == tab) {
                element.classList.add('active');
            }
        });
    }
}

/**
 * updateUserLevels gets called and then all of the levels and the xp bars
 * are updated with the percentage to the next level
 * Gets called when the home.html is loaded at first
 */
async function updateUserLevels() {
    let userLevels = await getUserLevels();
    let levelInfoContainers = document.querySelectorAll('.level-info-container');
    
    for (let i = 0; i < levelInfoContainers.length; i++) {
        let levelInfoContainer = levelInfoContainers[i];
        let userLevel = userLevels[i]; 
        
        let levelNumber = levelInfoContainer.querySelector('.level-number p');
        let xpBar = levelInfoContainer.querySelector('.filled-xp');

        levelNumber.innerHTML = userLevel.level;
        levelNumber.classList.add('fade-in');

        xpBar.style.width = userLevel.percentage + '%';
    }
}

/**
 * Gets the username from sessionStorage and displays it on the navbar
*/
function displayUsername() {
    const usernameContainer = document.querySelector('.navbar-container.username > p');
    const username = sessionStorage.getItem('username');

    usernameContainer.innerHTML = username;
}

/**
 * AJAX request to get the users levels and % to next level when homepage loads
 * and then to update the xp bars in the results container
*/
async function getUserLevels() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'get_user_levels',
            method: 'POST', 
            dataType: 'JSON',
            success: function(response) {
                resolve(response)
            },
            error: function(xhr, status, error) {
                console.log('UPDATE USER LEVELS - ERROR - ', xhr, status, error);
                reject(error)
            }
        })
    })
    .then(function(response) {
        return response
    })
    .catch(function(error) {
        throw error
    })
}


/**
 * Gets called when home.html first loads and again on every call of switchHomeTabs();
 * Runs an sql query to SELECT the last 5 games of the user to populate results-container
 * 
 * @returns {promise} - Either returns up to 5 of the users previous games or an error
*/
async function displayLastGamesPlayed() {
    // Its better if a skeleton of the rows already exists in home.html so it can easily be modified
    // when a new game finishes and switchHomeTabs() gets called therefore this function gets called again
    // with the new information, if I used createElement() I would have to have another function
    // specifically for inserting another row and deleting the last one after switchHomeTabs() so I decided on this

    const resultsContainer = document.querySelector('.results-container');
    const resultsRows = resultsContainer.querySelectorAll('.results-row');
    
    // Map to associate the modes with their cooresponding google-icon name
    const ICON_MAP = {'vanilla': 'icecream', 'timed': 'timer', 'choice': 'grid_view', 'sudden': 'skull'}

    const lastGamesPlayed = await getLastGamesPlayed(5);
    
    // lastGamesPlayed is limited to 5 rows.
    for (let i = 0; i < lastGamesPlayed.length; i++) {        
        let lastGamePlayed = lastGamesPlayed[i]
        let resultsRow = resultsRows[i + 1]

        resultsRow.className = 'results-row ' + lastGamePlayed[0];
        
        let iconContainer = resultsRow.querySelector('span');
        iconContainer.innerHTML = ICON_MAP[lastGamePlayed[0]];

        let question = resultsRow.querySelector('.question-amount');
        question.innerHTML = lastGamePlayed[1] + '/' + lastGamePlayed[2];

        let percentage = resultsRow.querySelector('.percentage');
        percentage.innerHTML = (lastGamePlayed[2] / lastGamePlayed[1] * 100).toFixed(0) + '%';

        let timer = resultsRow.querySelector('.timer');
        timer.innerHTML = [lastGamePlayed[8].toFixed(2)] + 's';

        let modeContainer = resultsRow.querySelector('.mode-container');
        let modeExperienceContainers = modeContainer.querySelectorAll('.mode-experience-container');

        for (let j = 3; j < 8; j++) {
            let modeExperienceContainer = modeExperienceContainers[j-3];

            let modeExperience = document.createElement('p');
            modeExperience.classList.add('mode-experience');
            
            modeExperience.innerHTML = lastGamePlayed[j];
            if (lastGamePlayed[j] != undefined) {
                modeExperience.innerHTML = lastGamePlayed[j]
            } else {
                modeExperience.innerHTML = 0;
            }
            modeExperienceContainer.appendChild(modeExperience);
        }
    }
}


/**
 * AJAX request that gets the a specific amount of the users previous games played
 * 
 * @param {int} quantity - the amount of games that will be generated
 * @returns {json} - Contains the basic information for the last games the user played
 */
async function getLastGamesPlayed(quantity) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/get_last_games_played',
            method: 'POST',
            dataType: 'JSON',
            data: {'quantity': quantity},
            success: function(response) {
                resolve(response)
            },
            error: function(xhr, status, error) {
                console.log('GET_LAST_GAMES_PLAYED - ERROR - ', xhr, status, error)
                reject(error)
            }
        })
    })
    .then(function(response) {
        return response
    })
    .catch(function(error) {
        throw error
    })
}


/**
 * While on the play tab the key 'enter' doubles as a submit answer key.
 * @returns Only resolves true when the enter key (keyboard) or submit button(numpad) is pressed.
*/
function gameInput() {
    const gameTabInput = document.getElementById('input-result');
    const submitButton = document.getElementById('question-submit-button');
    var currentTab = document.querySelector('.full-page.active');

    const numberPad = document.getElementById('number-pad')
    const numberPadKeys = numberPad.querySelectorAll('.number-button')

    // Autofocuses on the input when on game-tab and tracks keyboard key-presses
    return new Promise((resolve) => {
        function keydownEvent(event) {
            let name = event.key;
            
            if (currentTab.id === 'game-tab') {
                // Functionally adds autofocus for valid input[type='number'] keypresses
                gameTabInput.focus();
            };

            // If the key pressed is enter the question gets submitted 
            if (name === 'Enter') {
                removeAllEventListeners();
                resolve(true);
            };
        }

        // Event listener function that gets called if the user clicks on the submit button on game-tab
        function clickEvent() {
            removeAllEventListeners();
            resolve(true);
        }

        // Event Listener function that gets called when any of the keys on the numpad are called on game-tab
        // Simulates numpad button clicks by adding the number to the end of input, also tracks for backspace
        function numpadEvent(event) {
            let key = event.target.dataset.button
            
            if (key != 'Backspace') {
                gameTabInput.value += key
            } else {
                gameTabInput.value = gameTabInput.value.slice(0, -1)
            }
        }
        
        // Has to be called before any resolve(true) otherwise eventListeners stack up
        function removeAllEventListeners() {
            document.removeEventListener('keydown', keydownEvent);
            submitButton.removeEventListener('click', clickEvent);

            numberPadKeys.forEach((element) => {
                element.removeEventListener('click', numpadEvent);
            });
        }

        document.addEventListener('keydown', keydownEvent)
        submitButton.addEventListener('click', clickEvent)

        numberPadKeys.forEach((element) => {
            element.addEventListener('click', numpadEvent)
        });
    })
}


// Main function for when the switchboard is toggled, all other switchboard functions will be called here
// The switchboard is located on home.html and it sets the settings for which math types will be generated
function toggleSwitchboard() {
    var switchboard = document.getElementById('switchboard');

    switchboard.addEventListener('click', function(event) {
        if (event.target.classList.contains('switch')) {
            let clickedButton = event.target

            if (clickedButton.classList.contains('active')) {
                clickedButton.classList.remove('active');
            } else {
                clickedButton.classList.add('active');
            }

            submitButtonActivation();
            saveSwitchboard();
        }
    })
}

/**
 * Updates sessionStorage every time a switch is toggled on the switchboard.
 * It makes more sense to use sessionStorage since the switches have to remain at the state they were
 * when the tab is refreshed, having this function return switchBoardState would require another function
 * for saving the state of switches
 */
function saveSwitchboard() {
    let additionSwitchActive = document.getElementById('addition').classList.contains('active');
    let subtractionSwitchActive = document.getElementById('subtraction').classList.contains('active');
    let multiplicationSwitchActive = document.getElementById('multiplication').classList.contains('active');
    let divisionSwitchActive = document.getElementById('division').classList.contains('active');
    let exponentialSwitchActive = document.getElementById('exponential').classList.contains('active');

    const activeSwitches = {
        addition: additionSwitchActive,
        subtraction: subtractionSwitchActive,
        multiplication: multiplicationSwitchActive,
        division: divisionSwitchActive,
        exponential: exponentialSwitchActive
    };

    let isSwitchActive = JSON.stringify(activeSwitches);
    sessionStorage.setItem('switchState', isSwitchActive);
}

/**
 * Gets the state of the switches from sessionStorage and sets the switches to their saved states
 * If sessionStorage doesn't have a switchState item then it creates it
 */
function loadSwitchboard() {
    if (!sessionStorage.getItem('switchState')) {
        const defaultSwitches = {
            addition: false,
            subtraction: false,
            multiplication: false,
            division: false,
            exponential: false
        };
        const defaultSwitchesString = JSON.stringify(defaultSwitches);
        sessionStorage.setItem('switchState', defaultSwitchesString)
    }

    let switchboardState = getSwitchboardState();

    for (const switchName in switchboardState) {
        let switchState = switchboardState[switchName]

        if (switchState ) {
            let switchElement = document.getElementById(switchName);
            switchElement.classList.add('active');
        }
    }
    setTimeout(initButtonsAnimation, 100)
}

// Returns the curent active switchboard state for use in question generation
function getSwitchboardState() {
    let switchboardStateString = sessionStorage.getItem('switchState');
    let switchboardState = JSON.parse(switchboardStateString);

    return switchboardState
}

// Adds animation to the switchboard after applying the active classes to avoid 
function initButtonsAnimation() {
    const switchboard = document.querySelectorAll('#switchboard *')

    switchboard.forEach(function(element) {
        element.style.transition = 'all .5s ease, color .1s linear';
    })
}

/**
 * Initializes the dropdown menu that is in even page except index and error
 * Dynamically generates it so its the exact same size as the dropdown button 
 * in the navbar no matter what screen size is being use.
 */
function initDropdownMenu() {
    initLogoutButton();
    displayUsername();

    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    const dropdownMenuContents = document.querySelectorAll('.dropdown-menu-content');
    const numberOfButtons = dropdownMenuContents.length;

    // flag that says whether or not the dropdown menu is open or not
    var dropdownMenuOpen = false

    // Closes the dropdown menu
    function closeDropdownMenu() {
        dropdownMenuOpen = false;
        dropdownMenu.style.display = 'none';
        dropdownButton.classList.remove('active');
    }

    function clickOutsideOfMenu(event) {
        if (!event.target.classList.contains('dropdown-menu-content') && !event.target.classList.contains('dropdown-toggle')) {
            closeDropdownMenu();
        }
    }

    // Opens the menu, if the menu is open, closes the menu.
    // If there is a click outside of the menu, close the menu.
    dropdownButton.addEventListener('click', () => {
        if (dropdownMenuOpen == true) {
            closeDropdownMenu();
            
        } else {
            dropdownMenuOpen = true;
            let buttonBounding = dropdownButton.getBoundingClientRect();
            dropdownButton.classList.add('active');

            dropdownMenu.style.display = 'flex';
            
            dropdownMenu.style.top = buttonBounding.bottom + 'px';
            dropdownMenu.style.left = buttonBounding.left + 'px';
            
            dropdownMenu.style.width = buttonBounding.width + 'px';
            dropdownMenu.style.height = buttonBounding.height * numberOfButtons + 'px';

            document.addEventListener('click', clickOutsideOfMenu);
        }
    })
}

// Initializes the mode select cards
function initModeSelectSwiper() {
    let deviceMaxWidth = screen.width
    swiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          prevEl: '.swiper-button-prev',
        },
    });
    
    swiper.on('slideChangeTransitionStart', async function () {
        submitButtonActivation();
        changeButtonColors();
    });
    
    // Initializes all the tooltips in the settingsHeaders on the home-tab
    const settingsHeaders = document.querySelectorAll('.settings-header');
    initToolTips(settingsHeaders);
}

// Updates the span value container for whatever settings-container is being modified
function updateSliderValues() {
    const settingsContainers = document.querySelectorAll('.settings-container');

    settingsContainers.forEach((element) => {
        element.addEventListener('input', (event) => {
            let displayedValue = element.querySelector('.range-results');
            
            if (event.target.value != undefined) {
                displayedValue.innerHTML = event.target.value;
            }
        });
    });
}


// Toggles the tooltips on mobile with click and hover on pc
function initToolTips(toolTipsNodeList) {
   
    // Assumes the user is on a mobile device unless pointer is detected then they have a mouse
    var isMobileDevice = true
    if (matchMedia('(pointer:fine)').matches) {
        isMobileDevice = false
    }

    // Initializes the tool tip hover functionality that explains the game mode further
    function toggleToolTip(toolTipContainer) {
        let isToolTipActive = toolTipContainer.classList.contains('active');

        if (!isToolTipActive) {
            toolTipContainer.classList.add('active');
        } else {
            toolTipContainer.classList.remove('active');
        }
    }

    // Sets up the tooltips to work on click for mobile instead of hover
    toolTipsNodeList.forEach(toolTips => {
        let iconContainer = toolTips.querySelector('span')
        let toolTipContainer = toolTips.querySelector('.tooltip-container');

        if (isMobileDevice) {
            iconContainer.addEventListener('click', function() {
                toggleToolTip(toolTipContainer);
                document.addEventListener('');
            });
        } else {
            iconContainer.addEventListener('mouseover', function() {
                toggleToolTip(toolTipContainer);
            })
            iconContainer.addEventListener('mouseout', function() {
                toggleToolTip(toolTipContainer)
            })
        }
    });
}

// Makes sure only one toggle button can be active at a time.
function modeSelectMultipleChoice() {
    const settingsContainers = document.querySelectorAll('.settings-container.toggle');

    settingsContainers.forEach((container) => {
        let buttons = container.querySelectorAll('.toggle-button');

        buttons.forEach((button) => {
            button.addEventListener('click', function() {
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].classList.remove('active');
                }
                button.classList.add('active');
            })
        });
    });
}

// Gets called when a switch-button is pressed and when a swiper container changes
function submitButtonActivation() {
    const submitContainer = document.querySelector('.submit-container');
    let shouldActivate = submitButtonActivationCheck();

    if (shouldActivate == true) {
        submitContainer.classList.add('active');
    } else {
        submitContainer.classList.remove('active');
    }

}

// Only gets called by submitButtonActivation(activeSlide);
function submitButtonActivationCheck() {
    const switchboardButtons = document.querySelectorAll('.switch');
  
    // will not activate if all the switches are off
    let activeSwitchesCount = 0;
    for (let i = 0; i < switchboardButtons.length; i++) {
        
        let switchboardButton = switchboardButtons[i];

        if (switchboardButton.classList.contains('active')) {
            activeSwitchesCount++
        }
    }
    if (activeSwitchesCount == 0) {
        return false
    }
    return true
}

/**
* Function to change the colors of a bunch of different elements on home.html
* to the colour scheme of the current selected mode
* Gets called by initModeSelectSwiper()
*/
function changeButtonColors() {
    const switchboard = document.getElementById('switchboard');
    const submitButton = document.getElementById('submit-button');
    const resultsContainer = document.getElementById('results-container');

    let activeSlide = document.querySelector('.swiper-slide.swiper-slide-active');
    let currentMode = activeSlide.querySelector('.game-mode').getAttribute('class').split(' ')[1];

    switchboard.className = 'switchboard-container ' + currentMode;
    submitButton.className = 'submit-button ' + currentMode;
    resultsContainer.className = 'results-container ' + currentMode;
}

// Initiailzes the start button and only allows a game to start if atleast 1 math type is selected
function startGame() {
    const submitButton = document.getElementById('submit-button');
    const submitContainer = document.querySelector('.submit-container')

    submitButton.addEventListener('click', function() {

        let activeSlide = document.querySelector('.swiper-slide.swiper-slide-active');
        
        triggerAnimation(submitButton, 'active', 1200);

        if (submitContainer.classList.contains('active')) {
            gameLogic(activeSlide);
        }
    });
}

/**
 * The main function of this application which handles the way the game actually runs
 * Depending on the game mode that was selected with the swiper gameLogic has slightly differnt 
 * rules like sudden ending the game at the first wrong answer and ending the game based on a timer
 * After the game successfully completes it sends the user back to home-tab and it sends an AJAX request  
 * with the questions and answers to be recorded in a database, after the reward xp is generated the users
 * experience bars and levels also get updated
 * 
 * @param {*} activeSlide - The current game mode that was selected before starting a game
 */
async function gameLogic(activeSlide) {
    const currentMode = activeSlide.querySelector('.game-mode').getAttribute('class').split(' ')[1];
    const switchboardState = JSON.stringify(getSwitchboardState());    
    
    const progressContainerGameQuestions = document.querySelector('.progress-container.game-questions');
    const progressContainerGameTimer = document.querySelector('.progress-container.game-timer');
    // const progressContainerQuestionTimer = document.querySelector('.progress-container.question-timer');

    let gameResults = [{'game_mode': currentMode}]
    
    // On an activeSlide with a timer and no question amount assume 1 question per second
    let questionAmount = activeSlide.querySelector('input').value;

    // Have to initialize timer here 
    let timer = 0;

    // Various flags
    var shouldEndQuestions = false;
    var resultsRecorded = false;
    
    // Array which stores the game results to send back to app.py
    let generatedQuestions = await generateQuestions(switchboardState, questionAmount)
    
    switchHomeTabs('game-tab');

    // All of the operand containers
    const operand1 = document.getElementById('operand-1');
    const operand2 = document.getElementById('operand-2');
    const operator = document.getElementById('operator');
    const result = document.getElementById('input-result');
    const submitButton = document.getElementById('question-submit-button');

    function timerEndGame() {
        shouldEndQuestions = true;
        result.value = 0;
        submitButton.click();
        triggerAnimation(result, 'invisible', 150)
    } 

    // This if statement covers all the gameplay for any timed modes: Timed, 
    if (activeSlide.querySelector('input').classList.contains('timer')) {
        timer = questionAmount * 1000;
        activateTimerProgress(progressContainerGameTimer, timer, true, 'linear');
        var timerTimeout = setTimeout(timerEndGame, timer);

    // For all non-timer modes: Vanilla
    } else {
        activateTimerProgress(progressContainerGameTimer, (questionAmount * 10000), false, 'ease');
        initQuestionProgress(progressContainerGameQuestions, questionAmount);
    }

    const gameStartTime = new Date();
    let correct_answers = 0;
    
    for (let i = 0; i < generatedQuestions.length; i++) {
        result.value = '';

        let question = generatedQuestions[i];
        let questionStartTime = new Date();

        if (question['operator'] == '^') {
            operand1.innerHTML = question['operand_1'] + "<sup>" + question['operand_2'] + "</sup>"
            operand2.innerHTML = ''
            operator.innerHTML = ''
            
        } else {            
            operand1.innerHTML = question['operand_1'];
            operand2.innerHTML = question['operand_2']; 
            operator.innerHTML = question['operator'];
        }

        // If the progressContainerGameQuestions' divs weren't generated earlier 
        // then generate a new one for each question
        if (currentMode !== 'vanilla') {
            initQuestionProgress(progressContainerGameQuestions, 1);
        }

        // Question can not be accidently submitted while the input field is empty 
        while (result.value.length == 0) {
            userSubmission = await gameInput();
        }

        // userSubmission becomes true when gameInput gets a response above
        if (userSubmission === true) {
            if (shouldEndQuestions) {
                break;
            }

            let questionEndTime = new Date();
            let questionTimeElapsed = ((questionEndTime - questionStartTime) / 1000).toFixed(2);
            let isUserCorrect = false;
            
            if (result.value == question['result']) {
                isUserCorrect = true;
                correct_answers++;
            } 

            let triggerAnimationMap = {true: 'correct', false: 'incorrect'}
            triggerAnimation(submitButton, triggerAnimationMap[isUserCorrect], 200);
            activateQuestionProgress(progressContainerGameQuestions, isUserCorrect);
            
            gameResults.push({'correct': isUserCorrect, 
                              'operator': question['operator'],
                              'operand_1': question['operand_1'],
                              'operand_2': question['operand_2'],
                              'user_result': result.value,
                              'question_result': question['result'], 
                              'time_elapsed': questionTimeElapsed,
                              'difficulty': question['difficulty'], 
                              'level': question['level'],
                              'question_timer': questionTimeElapsed});

            if (currentMode == 'sudden' && isUserCorrect == false) {
                break;
            }
        }
    }
    switchHomeTabs('home-tab');
    
    // https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
    // Used this to convert new Date() into something that can fit into the sql DATE type
    let gameTimeStamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let gameEndTime = new Date();
    let gameTimeElapsed = ((gameEndTime - gameStartTime) / 1000).toFixed(2);

    // Corrects the tiny math error in the floating point values creating a cleaning looking value
    if (currentMode == 'timed') {
        
        let last_two = gameTimeElapsed.slice(-2);
        gameTimeElapsed = gameTimeElapsed.replace(last_two, '00')
    }
        
    // Makes it so the timer function from a previous game can never affect a future game
    clearTimeout(timerTimeout);
    
    gameResults[0].game_timer = gameTimeElapsed;
    gameResults[0].game_date = gameTimeStamp;
    
    // AJAX request to send results and return stats while also saving results from a completed game
    resultsRecorded = await recordResults(JSON.stringify(gameResults));

    updateLastGamePlayed();

    progressContainerGameQuestions.innerHTML = '';
    
    if (resultsRecorded) {
        updateSessionMessage('Game successfully recorded', 'success', true);
    } else {
        updateSessionMessage('Game results not recorded', 'error', true);
    }
    updateUserLevels();
}

/**
 * Updates the last games played with the newest game without having to do a query for the
 * last 5 games, it just removes the last one and inserts a new one infront of the previous first one
 * I dont like that I had to make a whole ugly function just for inserting a new row 
 * but the alternative is reworking the way lastGameResults works and I dont have time for that 
 */
async function updateLastGamePlayed() {
    let lastGamePlayed = await getLastGamesPlayed(1);

    const ICON_MAP = {'vanilla': 'icecream', 'timed': 'timer', 'choice': 'grid_view', 'sudden': 'skull'}
    
    var resultsRows = document.querySelectorAll('.results-row');
    resultsRows[resultsRows.length - 1].remove();

    let resultsRow = document.createElement('div');
    resultsRow.className = 'results-row ' + lastGamePlayed[0][0];

    let iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');

    let icon = document.createElement('span');
    icon.classList.add('material-symbols-outlined');
    icon.innerHTML = ICON_MAP[lastGamePlayed[0][0]];
    
    iconContainer.appendChild(icon);
    resultsRow.appendChild(iconContainer);
    
    
    let questionContainer = document.createElement('div');
    questionContainer.classList.add('question-amount-container');

    let question = document.createElement('p');
    question.classList.add('question');
    question.innerHTML = lastGamePlayed[0][1] + '/' + lastGamePlayed[0][2];

    questionContainer.appendChild(question);
    resultsRow.appendChild(questionContainer);


    let percentageContainer = document.createElement('div');
    percentageContainer.classList.add('percentage-container');

    let percentage = document.createElement('p');
    percentage.classList.add('percentage');
    percentage.innerHTML = (lastGamePlayed[0][2] / lastGamePlayed[0][1] * 100).toFixed(0) + '%';
    
    percentageContainer.appendChild(percentage)
    resultsRow.appendChild(percentageContainer)


    let timerContainer = document.createElement('div');
    timerContainer.classList.add('timer-container');

    let timer = document.createElement('p');
    timer.classList.add('timer');
    timer.innerHTML = [lastGamePlayed[0][8].toFixed(2)] + 's';

    timerContainer.appendChild(timer);
    resultsRow.appendChild(timerContainer)

    
    let modeContainer = document.createElement('div');
    modeContainer.classList.add('mode-container');
    
    for (let i = 3; i < 8; i++) {
        var modeExperienceContainer = document.createElement('div')
        modeExperienceContainer.classList.add('mode-experience-container')

        let modeExperience = document.createElement('p');
        modeExperience.classList.add('mode-experience');

        if (lastGamePlayed[0][i] != undefined) {
            modeExperience.innerHTML = lastGamePlayed[0][i]
        } else {
            modeExperience.innerHTML = 0;
        }
        modeExperienceContainer.appendChild(modeExperience);
        modeContainer.appendChild(modeExperienceContainer);
    }

    resultsRow.appendChild(modeContainer);
    
    let firstRow = resultsRows[1];
    let parentNode = document.querySelector('.last-game-results')
    parentNode.insertBefore(resultsRow, firstRow)
}


/**
 * AJAX request to get a jsonify string with all the questions and answers.
 * 
 * @param {JSON} types - JSON object containing the selected math types
 * @param {number} amount - number of questioned selected by the user.
 * @returns {JSON object} - Contains all of the questions and answers for gameLogic
 */
async function generateQuestions(types, amount) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/generate_questions',
            method: 'POST',
            dataType: 'JSON',
            data: {'types': types, 'amount': amount},
            success: function(response) {
                resolve(response);
            },
            error: function(xhr, status, error) {
                console.log('GENERATE QUESTIONS - ERROR', xhr, status, error);
                reject(error)
            }
        })
    })
    .then(function(response) {
        return response
    })
    .catch(function(error) {
        throw error
    });
}

/**
 * AJAX request to record the results of a successfully completed game
 * @param {JSON} results - JSON object containing the results of the game
 * @returns {Boolean} - Lets gameLogic know if the results were successfuly recorded or not
 */
async function recordResults(results) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'record_results',
            method: 'POST',
            dataType: 'JSON',
            data: {'results': results},
            success: function(response) {
                resolve(response['successful'])
            },
            error: function(xhr, status, error) {
                console.log('RECORD RESULTS - ERROR -', xhr, status, error);
                reject(error)
            }
        })
    })
    .then(function(response) {
        return response
    })
    .catch(function(error) {
        throw error
    })
}

/** 
* Clears all of the containers inside of the progressContainer
* 
* @param {element} progressContainer - The container that holds the progress bar
* @param {int} questions - Tells the function how many new divs to prepare 
*/  
function initQuestionProgress(progressContainer, questions) {    
    for (let i = 0; i < questions; i++) {
        let newQuestionProgressQuestion = document.createElement('div');
        newQuestionProgressQuestion.classList.add('game-progress-question', 'empty');

        progressContainer.appendChild(newQuestionProgressQuestion)
    }
}


/** 
* Utilizes the progress bar as a way to visualize how many questions are answered/left
*
* @param {element} progressContainer - The container that holds the progress bar
* @param {number} questionNumber - The number of the div that will have a class added to it
* @param {bool} answer - true = correct, false = incorrect, adds the cooresponding class
*/  
function activateQuestionProgress(progressContainer, answer) {
    const answerBinaryMap = {true: 'correct', false: 'incorrect'}

    let gameProgressDiv = progressContainer.querySelector('.game-progress-question.empty');

    gameProgressDiv.classList.add(answerBinaryMap[answer]);
    gameProgressDiv.style.width = '100%';
    gameProgressDiv.classList.remove('empty');
}

/** 
* Utilizes the progress bar as a timer that can go forwards or backwards
*
* @param {element} progressContainer - The container that holds the progress bar
* @param {number} timer - How long the timer animtion lasts until the bar fills/empties 
* @param {bool} reverse - If true then the timer will decrease instead of increasing
* @param {string} transition - linear by default; can be set to any of the valid transition styles
*/  
function activateTimerProgress(progressContainer, timer, reverse=false, transition='linear') {
    progressContainer.innerHTML = '';

    let newProgressBar = document.createElement('div');
    newProgressBar.classList.add('progress-bar', 'correct');
    newProgressBar.style.transition = ('all ' + timer / 1000 + 's ' + transition);
    
    if (reverse) {
        progressContainer.style.flexDirection = 'row-reverse';
    }
    progressContainer.appendChild(newProgressBar);

    // The animation of the timer bar doesn't work if its outside of a setTimeout
    setTimeout(function() {
        newProgressBar.style.width = '100%';

        if (reverse) {
            newProgressBar.classList.remove('correct');
            newProgressBar.classList.add('incorrect');
        }
    }, 10);
}

/**
* Initializes swiper.js on leaderboard.html and also has a bonus functionality of
* transfering the active class the current slides caption element for styling purposes
* Also in charge of adding the active class to the fake box shadow.
*/
function initLeaderboardSwiper() {
    const windowWidth = window.innerWidth
    let startWithActiveSlide = null;

    // Less than 800 width = user is on a mobile device 
    if (windowWidth <= 800 ) {
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
        });
        startWithActiveSlide = document.querySelector('.swiper-slide-active');
    
    // Desktop users 
    } else {   
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: 3,
            spaceBetween: 0,
            loop: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });
        startWithActiveSlide = document.querySelector('.swiper-slide-next');
    }

    const startWithActiveTable = startWithActiveSlide.querySelector('table');    
    const startWithActiveShadow = startWithActiveSlide.querySelector('.box-shadow');
    
    startWithActiveTable.classList.add('active');
    startWithActiveShadow.classList.add('active');

    let lastActiveTable = startWithActiveTable;
    let lastActiveShadow = startWithActiveShadow;

    let currentActiveSlide = null;
    
    swiper.on('slideChangeTransitionEnd', function () {
        if (windowWidth <= 800 ) {
            currentActiveSlide = document.querySelector('.swiper-slide-active');
        } else {
            currentActiveSlide = document.querySelector('.swiper-slide-next');
        }

        let currentActiveTable = currentActiveSlide.querySelector('table');
        let currentActiveShadow = currentActiveSlide.querySelector('.box-shadow')
        
        currentActiveTable.classList.add('active');
        currentActiveShadow.classList.add('active');

        lastActiveTable.classList.remove('active');
        lastActiveShadow.classList.remove('active');
        
        lastActiveTable = currentActiveTable;
        lastActiveShadow = currentActiveShadow;
    });
}

/**
 * The leaderboard box-shadow is a pseudo-element under the table, it has to be a pseudo-element 
 * because the header of the table is a caption and if I use a box-shadow under the table its clear 
 * that the caption on top doesn't have the same shadow.
 */
function initLeaderboardShadows() {
    const tableElementSize = document.querySelector('table').getBoundingClientRect();
    const dropShadows = document.querySelectorAll('.box-shadow');

    dropShadows.forEach((element) => {
        element.style.width = tableElementSize.width + 'px';
        element.style.height = tableElementSize.height + 'px';
        element.style.top = tableElementSize.top + 'px';
    });
}

// Initializes the dropdown functionality for every row in the game-history table
function initGameHistoryTable() {
    const visibleRows = document.querySelectorAll('.row-container');

    visibleRows.forEach((element) => {
        let gameHistoryRow = element.querySelector('.game-history-row');
        let detailedHistoryRow = element.querySelector('.detailed-history-row');

        gameHistoryRow.addEventListener('click', function() {
            if (detailedHistoryRow.classList.contains('active')) {
                detailedHistoryRow.classList.remove('active');
            } else {
                detailedHistoryRow.classList.add('active');
            }
        });
    });
}

// Initializes the toggle buttons for the search filter on the game_history.html
function initGameHistoryFilter() {
    var activeModes = []
    function checkForActiveSwitch() {
        
        // Flag to track if a single switch is active
        oneActiveSwitch = false;
        for (let i = 0; i < switchButtons.length; i++) {
            let switchButton = switchButtons[i];
            if (switchButton.classList.contains('active')) {
                oneActiveSwitch = true
                activeModes[i] = true;
            } else {
                activeModes[i] = false;
            }
        }
        if (oneActiveSwitch) {
            return true
        }
        return false
    }

    const slider = document.querySelector('.input-range');
    const sliderResults = document.querySelector('.input-information p')

    if (slider.value == 100) {
        sliderResults.innerHTML = 'Number of Games: All';
    }

    slider.addEventListener('input', function() {
        if (slider.value == 100) {
            sliderResults.innerHTML = 'Number of Games: All';
        } else {
            sliderResults.innerHTML = 'Number of Games: ' + slider.value;
        }
    })

    const switchButtons = document.querySelectorAll('.mode-switch');

    switchButtons.forEach((element) => {
        element.addEventListener('click', function() {
            if (element.classList.contains('active')) {
                element.classList.remove('active');
            } else {
                element.classList.add('active');
            }
        });
    });

    const submitFilterContainer = document.querySelector('.submit-filter-container');
    let quantityInput = document.getElementById('quantity-input');
    let activeModesInput = document.getElementById('active-modes-input');

    submitFilterContainer.addEventListener('click', function() {
        if (checkForActiveSwitch()) {
            quantityInput.value = slider.value;
            activeModesInput.value = activeModes;
        }
    });
}


/**
 * Initialzes the profile search function in the profile.html page
 * First it checks if the username actually exists and only then does it search
 * for their profile, you can look up anyones profile and see their general stats
 * as if it were your own.
 */
function initProfileSearch() {
    const profileSearchForm = document.getElementById('profile-search-form');
    const submitButton = document.querySelector('.profile-search-button');
    const hiddenInput = document.getElementById('user-search');

    // If the user presses enter on /profile.html submits the form
    document.addEventListener('keypress', function(event) {
        if (event.key == 'Enter') {
            submitButton.click();
        } 
    })
    
    profileSearchForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        let usernameInput = document.getElementById('user-search-input').value;
        

        if (usernameInput.length == 0) {
            updateSessionMessage('Enter a username to search', 'error', true);

        } else {
            let isAvailable = await checkUsernameAvailability(usernameInput);
            
            if (isAvailable) {
                hiddenInput.value = usernameInput;
                profileSearchForm.submit();
                
            } else {
                updateSessionMessage("User does not exist", 'error', true);
            }
        }
    })
}

/**
 * Triggers animations when the user submits their answer
 * 
 * @param {object} element - The element that will receieve the class
 * @param {string} animation - The class that will be added to trigger the animation 
 * @param {number} timeDelay - How many ms until the class gets removed again for the animation to reset 
 */
function triggerAnimation(element, animation, timeDelay) {
    const removeAnimation = function () {
        element.classList.remove(animation);
    };
    
    element.classList.add(animation);
    setTimeout(removeAnimation, timeDelay);
}


main();