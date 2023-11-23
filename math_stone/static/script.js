function main() {
    // TODO MODULARIZE ALL THHESE FUNCTIONS like initHomePage, initLeaderboard, etc
    
    storedColorScheme();
    wavesEffectToggle();
    displaySessionInformation();
    toggleColorScheme();

    switch (window.location.pathname) {
        case '/':
            initSlider();
            initForm();
            registerFormSubmit();
            loginFormSubmit();
            break;
        case '/home':
            // beginning of modularization 
            initHomePage();
            logout();
            
            break;
        case '/leaderboard':
            initDropdownMenu();
            displayUsername();
            logout();
            break;
    }
}


// Makes sure everything in home.html runs when the page loads
// Seperating the tabs into seperate functions themselves just makes the code too messy
function initHomePage() {
    // Everything in Home-Tab
    loadSwitchboard();
    saveSwitchboard();

    displayUsername();
    updateUserLevels();
    displayLastGamesPlayed();
    switchHomeTabs();

    initDropdownMenu();
    initModeSelect();
    toggleSwitchboard();
    updateSliderValues();
    modeSelectMultipleChoice();
    submitButtonActivation();
    startGame();

    // Everything for Game-Tab
    const exitButtonNodeList = document.querySelectorAll('.header-bar');
    initToolTips(exitButtonNodeList)
}

// Loads the page with the preffered color scheme stored in session.storage
function storedColorScheme() {
    let html = document.querySelector('html')
    let storedMode = sessionStorage.getItem('prefferedMode')

    if (storedMode == 'dark') {
        html.classList.remove('light');
        html.classList.add('dark');
    }
}

// switches the class the html element between light/dark with with a button toggle
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

// Called in toggleColorScheme() to also toggle the color of the waves-effect from the Materialize library
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

// Image slider on index
function initSlider() {
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize slider
        var sliders = document.querySelectorAll('.slider');
        var instances = M.Slider.init(sliders, {
            height: 700
        });
    });
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

// Finds the session-information class and set the innerHTML to session.storage
// TODO: 
function displaySessionInformation() {
    let message = sessionStorage.getItem('message');
    let messageType = sessionStorage.getItem('messageType')
    
    if (message != null || messageType != null) {
        M.toast({html: message, classes: messageType})
    }
}


/**
 * Updates the messages displayed on the toast and its class
 * @param {string} message - The message displayed on the toast
 * @param {string} messageType - The class that gets applied to the toast
 * @param {bool} displayNow - if True, display the sessionMessage regardless of the displayMessage flag
*/
function updateSessionMessage(message, messageType, displayNow=false) {
    sessionStorage.setItem('message', message);
    sessionStorage.setItem('messageType', messageType);

    if (displayNow) {
        sessionStorage.setItem('displayMessage', true);
    }
            
    if (sessionStorage.getItem('displayMessage' != true)) {
        sessionStorage.setItem('displayMessage', true);
        
    } else {
        sessionStorage.setItem('displayMessage', false);
        displaySessionInformation();
    }
    
}

// When the submit button is pressed check if the form is valid with loginFormCheck()
// if loginFormCheck() returns true then submit the form to app.py
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

function logout() {
    const logoutForm = document.getElementById('logout-form');
    
    logoutForm.addEventListener('submit', function() {
        updateSessionMessage('Logout Successful', 'success');
        sessionStorage.clear();
    });
}

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
    return true;
}

function usernameBasicCheck(username) {
    // TODO: checks for a username and returns an error message if its false. 
    // No error message will be returned for a success and therefore no need to return a bool, just count the return
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

function confirmBasicCheck(password, confirm) {
    if (password != confirm) {
        return 'Confirmation and password must match'
    }
    return true
}

// Input the different input elements so the error handler 
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

// Sends AJAX request to check the availability of a username in app.py
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

// Sends AJAX request to check if the login is successful 
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
                console.log(xhr, status, error)
                reject(error);
            }
        });
    });
}

// Sends AJAX request to redirect to error.html with errorMessage and errorCode
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

function pathnameRedirect(pathname) {
    window.location.pathname = pathname;
}

// Functions for Home.html

// Meant to switch between the home-tab and the game-tab
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

        xpBar.style.width = userLevel.percentage
    }
}



function displayUsername() {
/**
 * Gets the username from sessionStorage and displays it on the navbar
*/
    const usernameContainer = document.querySelector('.navbar-container.username > p');
    const username = sessionStorage.getItem('username');

    usernameContainer.innerHTML = username;
}

async function getUserLevels() {
/**
 * AJAX request to get the users levels and % to next level when homepage loads
 * and then to update the xp bars in the results container
*/
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
*/
async function displayLastGamesPlayed() {

    /**
    * AJAX request to run the sql query
    * @returns {promise} - Either returns up to 5 of the users previous games or an error
    */
    async function getLastGamesPlayed() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: '/get_last_games_played',
                method: 'POST',
                dataType: 'JSON',
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

    // Its better if a skeleton of the rows already exists in home.html so it can easily be modified
    // when a new game finishes and switchHomeTabs() gets called therefore this function gets called again
    // with the new information, if I used createElement() I would have to have another function
    // specifically for inserting another row and deleting the last one after switchHomeTabs() so I decided on this

    const resultsContainer = document.querySelector('.results-container');
    const resultsRows = resultsContainer.querySelectorAll('.results-row');
    
    // Map to associate the modes with their cooresponding google-icon name
    const iconMap = {'vanilla': 'icecream', 'timed': 'timer', 'choice': 'grid_view', 'sudden': 'skull'}

    // Map to associate the results index number to the mode
    const modeMap = {3: '+', 4: '−', 5: '×', 6: '÷', 7: 'x²'};

    const lastGamesPlayed = await getLastGamesPlayed();
    
    // lastGamesPlayed is limited to 5 rows.
    for (let i = 0; i < lastGamesPlayed.length; i++) {
        let lastGamePlayed = lastGamesPlayed[i]
        let resultsRow = resultsRows[i + 1]
        
        let iconContainer = resultsRow.querySelector('span');
        iconContainer.innerHTML = iconMap[lastGamePlayed[0]];

        let question = resultsRow.querySelector('.question-amount');
        question.innerHTML = lastGamePlayed[1];

        let modeContainer = resultsRow.querySelector('.mode-container');
        modeContainer.innerHTML = '';
        
        // Loops through the experience gained per mode
        for (let j = 3; j < 8; j++) {
            if (lastGamePlayed[j] !== 0) {
                let modeExperienceContainer = document.createElement('div');
                modeExperienceContainer.classList.add('mode-experience-container');
                
                let modeSymbol = document.createElement('p');
                modeSymbol.classList.add('mode-symbol');
                modeSymbol.innerHTML = modeMap[j];
                modeExperienceContainer.appendChild(modeSymbol);
                
                let modeExperience = document.createElement('p');
                modeExperience.classList.add('mode-experience');
                modeExperience.innerHTML = lastGamePlayed[j];
                modeExperienceContainer.appendChild(modeExperience);
                
                modeContainer.appendChild(modeExperienceContainer);
            } 
        }
        let percentage = resultsRow.querySelector('.percentage');
        percentage.innerHTML = (lastGamePlayed[2] / lastGamePlayed[1] * 100).toFixed(0) + '%';

        let timer = resultsRow.querySelector('.timer');
        timer.innerHTML = [lastGamePlayed[8].toFixed(2)] + 's';

        resultsRow.className = 'results-row ' + lastGamePlayed[0];
    }
}


/**
 * While on the play tab the key 'enter' doubles as a submit answer key.
 * @returns Only returns true when the enter key or submit button is pressed.
*/
function gameInput() {
    const gameTabInput = document.getElementById('input-result');
    const submitButton = document.getElementById('question-submit-button');
    var currentTab = document.querySelector('.full-page.active');

    const numberPad = document.getElementById('number-pad')
    const numberPadKeys = numberPad.querySelectorAll('.number-button')

    return new Promise((resolve) => {
        function keydownEvent(event) {
            let name = event.key;
            console.log(name, event)
            
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

       

        function clickEvent() {
            removeAllEventListeners();
            resolve(true);
        }

        function numpadEvent(event) {
            simulateKeydown(event.target.dataset.button);
        }

        function simulateKeydown(key) {
            console.log(key)

            gameTabInput.focus();
            if (key != 'Backspace') {
                gameTabInput.value += key
            } else {
                gameTabInput.value = gameTabInput.value.slice(0, -1)
            }
            
            // gameTabInput.dispatchEvent(event);
        }
        
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

// Updates sessionStorage every time a switch is toggled on the switchboard.
// It makes more sense to use sessionStorage since the switches have to remain at the state they were
// when the tab is refreshed, having this function return switchBoardState would require another function
// for saving the state of switches
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

// Checks sessionStorage for the state of the switches when home.html loads
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

// TODO
function initDropdownMenu() {
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
function initModeSelect() {
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
    
    swiper.on('transitionEnd', async function () {
        submitButtonActivation();
        changeButtonColors();
    });
    
    // Initializes all the tooltips in the settingsHeaders on the home-tab
    const settingsHeaders = document.querySelectorAll('.settings-header');
    initToolTips(settingsHeaders);
}

// Updates the span value container for whatever settings-container is being modified
function updateSliderValues() {
    const settingsContainers = document.querySelectorAll('.game-mode');

    settingsContainers.forEach((element) => {
        element.addEventListener('input', (event) => {
            let displayedValue = element.querySelector('.range-results');
            
            if (event.target.value != undefined) {
                displayedValue.innerHTML = event.target.value;
            }
        });
    });
}


// TODO : toggles the tooltips on mobile with click and hover on pc
function initToolTips(toolTipsNodeList) {
   
    // Assumes the user is on a mobile device unless pointer is detected then they have a mouse
    var isMobileDevice = true
    if (matchMedia('(pointer:fine)').matches) {
        isMobileDevice = false
    }

    // TOOD
    function toggleToolTip(toolTipContainer) {
        let isToolTipActive = toolTipContainer.classList.contains('active');

        if (!isToolTipActive) {
            toolTipContainer.classList.add('active');
        } else {
            toolTipContainer.classList.remove('active');
        }
    }

    // TODO - comments
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
    let activeSlide = document.querySelector('.swiper-slide.swiper-slide-active');
    const submitContainer = document.querySelector('.submit-container');
    let shouldActivate = submitButtonActivationCheck(activeSlide);


    if (shouldActivate == true) {
        submitContainer.classList.add('active');
    } else {
        submitContainer.classList.remove('active');
    }

}

// Only gets called by submitButtonActivation(activeSlide);
function submitButtonActivationCheck(activeSlide) {
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


// Function to change the colors of everything when the game mode is switched
// Gets called by initModeSelect()
// TODO change name
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


// The activeSlide parameter denotes what game mode the user selected
async function gameLogic(activeSlide) {
    const currentMode = activeSlide.querySelector('.game-mode').getAttribute('class').split(' ')[1];
    const switchboardState = JSON.stringify(getSwitchboardState());    
    
    const progressContainerGameQuestions = document.querySelector('.progress-container.game-questions');
    const progressContainerGameTimer = document.querySelector('.progress-container.game-timer');
    // const progressContainerQuestionTimer = document.querySelector('.progress-container.question-timer');

    let gameResults = [{'gameMode': currentMode}]
    
    // On an activeSlide with a timer and no question amount assume 1 question per second
    let questionAmount = activeSlide.querySelector('input').value;

    // Have to initialize timer here 
    let timer = 0;

    // Different flags
    var shouldEndQuestions = false;
    var shouldRecordResults = false;
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

    // This if statement covers all the gameplay for any timed modes: Timed, 
    if (activeSlide.querySelector('input').classList.contains('timer')) {
        timer = questionAmount * 1000;
        activateTimerProgress(progressContainerGameTimer, timer, true, 'linear');
        
        setTimeout(function() {
            shouldEndQuestions = true;
            result.value = 0;
            submitButton.click();
            triggerAnimation(result, 'invisible', 150)
        }, timer);
    // For all non-timer modes: Vanilla
    } else {
        activateTimerProgress(progressContainerGameTimer, (questionAmount * 10000), false, 'ease');
        initQuestionProgress(progressContainerGameQuestions, questionAmount);
    }

    const gameStartTime = new Date();
    var correct_answers = 0;
    
    for (let i = 0; i < generatedQuestions.length; i++) {
        result.value = '';

        let question = generatedQuestions[i];
        let questionStartTime = new Date();
        
        operand1.innerHTML = question['operand_1'];
        operand2.innerHTML = question['operand_2']; 
        operator.innerHTML = question['operator'];

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
                gameResults.pop();
                break;
                // remove the last entry of gameResult and send it to app.py 
            }

            let questionEndTime = new Date();
            let questionTimeElapsed = ((questionEndTime - questionStartTime) / 1000).toFixed(2);
            
            if (result.value == question['result']) {
                correct_answers++;
                
                activateQuestionProgress(progressContainerGameQuestions, true);
                triggerAnimation(submitButton, 'correct', 200);
                
                gameResults.push({'correct': true, 
                                  'operator': question['operator'],
                                  'timeElapsed': questionTimeElapsed,
                                  'difficulty': question['difficulty'], 
                                  'level': question['level']});
                
            } else {
                activateQuestionProgress(progressContainerGameQuestions, false);
                triggerAnimation(submitButton, 'incorrect', 200);
                
                gameResults.push({'correct': false, 
                                  'operator': question['operator'],
                                  'timeElapsed': questionTimeElapsed});
                
                if (currentMode == 'sudden') {
                    break;
                }
            }
        }
    }
    switchHomeTabs('home-tab');
    // AJAX request to send results and return stats while also saving results from a completed game

    // https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
    // Used this to convert new Date() into something that can fit into the sql DATE type
    let gameTimeStamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let gameEndTime = new Date();
    let gameTimeElapsed = ((gameEndTime - gameStartTime) / 1000).toFixed(2);

    // console.log(gameTimeElapsed, gameEndTime, gameStartTime)
    console.log(gameResults, gameResults[0])
    
    gameResults[0].gameTimer = gameTimeElapsed
    gameResults[0].gameDate = gameTimeStamp

    resultsRecorded = await recordResults(JSON.stringify(gameResults));

    progressContainerGameQuestions.innerHTML = ''
    successfullyFinishGame(resultsRecorded)
}

function successfullyFinishGame(resultsRecorded) {
    if (resultsRecorded == true) {
        updateSessionMessage('Game successfully recorded', 'success');
    } else {
        updateSessionMessage('Game results not recorded', 'error');
    }

    displayLastGamesPlayed();
    updateUserLevels();
    
}


/**
 * AJAX request to get a jsonify string with all the questions and answers.
 * @param {JSON} types - JSON object containing the selected math types
 * @param {number} amount - number of questioned selected by the user.
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
* @param TODO
* return TODO
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
  @param {bool} reverse - If true then the timer will decrease instead of increasing
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
    Triggers animations when the user submits their answer

    @param {object} element - The element that will receieve the class
    @param {string} animation - The class that will be added to trigger the animation
    @param {number} timeDelay - How many ms until the class gets removed again for the animation to reset
*/
function triggerAnimation(element, animation, timeDelay) {

    // console.log(element, animation, timeDelay)
    // console.log(typeof(element), typeof(animation), typeof(timeDelay))
    const removeAnimation = function () {
        element.classList.remove(animation);
    };
    
    element.classList.add(animation)
    setTimeout(removeAnimation, timeDelay)
}


main();