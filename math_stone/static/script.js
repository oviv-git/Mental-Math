function main() {

    storedColorScheme();
    wavesEffectToggle();
    displaySessionInformation();
    switch (window.location.pathname) {
        case '/':
            toggleColorScheme();
            initSlider();
            initForm();
            registerFormSubmit();
            loginFormSubmit();
            break;
        case '/home':
            updateUserLevels();
            switchHomeTabs();
            loadSwitchboard();
            toggleColorScheme();
            toggleSwitchboard();
            initModeSelect();
            updateSliderValues();
            modeSelectMultipleChoice();
            submitButtonActivation();
            startGame();
    }
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
    var toggle = document.querySelector('.dark-mode-toggle')
    var html = document.querySelector('html')

    toggle.addEventListener('click', function() {
        if (html.classList.contains('light') == true) {
            html.classList.remove('light');
            html.classList.add('dark');
            sessionStorage.setItem('prefferedMode', 'dark')
        } 
        else if (html.classList.contains('dark') == true) {
            html.classList.remove('dark')
            html.classList.add('light')
            sessionStorage.setItem('prefferedMode', 'light')
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
    var modal = document.querySelector('.modal')
    var modalInstance = M.Modal.init(modal);

    // Initialize tabs
    var tab = document.querySelector('.tabs')
    var tabInstances = M.Tabs.init(tab);
    
    var loginButton = document.getElementById('login-button')
    var registerButton = document.getElementById('register-button')
    
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
    let modalOverlay = document.querySelector('.modal-overlay')
    let forms = document.querySelectorAll('form')

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
function displaySessionInformation() {
    let message = sessionStorage.getItem('message');
    let messageType = sessionStorage.getItem('messageType')
    
    if (message != null || messageType != null) {
        M.toast({html: message, classes: messageType})
    }
}

// messageType is success or failure
function updateSesssionMessage(message, messageType) {
    sessionStorage.setItem('message', message);
    sessionStorage.setItem('messageType', messageType);
    displaySessionInformation();
}

// When the submit button is pressed check if the form is valid with loginFormCheck()
// if loginFormCheck() returns true then submit the form to app.py
function loginFormSubmit() {
    var loginForm = document.getElementById('login-form')

    loginForm.addEventListener('submit', async function(e)  {
        e.preventDefault();
        var isValid = await loginFormCheck()
        if (isValid == true) {
            updateSesssionMessage('Login Successful', 'success');
            loginForm.submit();
        }
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
        .then(function(available) {
            if (!available) {
                return true;
            } else {
                return ("That username isn't registered");
            }
        })
        .catch(function(error) {
            // Should redirect to the error page using javascript if it cant connect to app.py
            console.log("error", error);
        })

    if (!errorHandler(isUsernameAvailable, username, usernameErrorBox, usernameLabel)) {
        return false;
    }

    isLoginSuccessful = await checkValidLogin(username.value, password.value)
        .then(function(successful) {
            if (successful) {
                return true;
            } else {
                return ("Incorrect password")
            }
        })
        .catch(function(error) {
            // Should redirect to the error page using javascript if it cant connect to app.py
        })
        
    if (!errorHandler(isLoginSuccessful, password, passwordErrorBox, passwordLabel)) {
        unsuccessfulAttemptsLeft--;
        password.dataset.attempts = unsuccessfulAttemptsLeft;
        if (password.dataset.attempts == 0) {
            password.dataset.attempts = 3;
            updateSesssionMessage('Too many unsuccessful login attempts', 'error')
            clearForm();
        }
        return false;
    }
    return true;
}

function registerFormSubmit() {
    var registerForm = document.getElementById('reg-form')

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        let isValid = await registerFormCheck()
        console.log(isValid)
        if (isValid == true) {
            console.log('Why tho?')
            updateSesssionMessage('Registration Successful', 'success')
            registerForm.submit();
        }
    })
}

async function registerFormCheck() {
    var username = document.getElementById('reg-username');
    var usernameErrorBox = document.getElementById('reg-username-error');
    var usernameLabel = document.getElementById('reg-username-label');
    
    var password = document.getElementById('reg-password');
    var passwordErrorBox = document.getElementById('reg-password-error')
    var passwordLabel = document.getElementById('reg-password-label')
    
    var confirm = document.getElementById('reg-confirm');
    var confirmErrorBox = document.getElementById('reg-confirm-error')
    var confirmLabel = document.getElementById('reg-confirm-label')

    if (!errorHandler(usernameBasicCheck(username.value), username, usernameErrorBox, usernameLabel)) {   
        return false;
    }
    isUsernameAvailable = await checkUsernameAvailability(username.value)
        .then(function(available) {
            if (available) {
                return true;
            } else {
                return ('Username is not available');
            }
        })
        .catch(function(error) {
            console.log("error", error);
        })
    if (!errorHandler(isUsernameAvailable, username, usernameErrorBox, usernameLabel)) {
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
        return "Must enter a username"
    }

    if (/\s/.test(username)) {
        return "Username can't any contain spaces"
    }

    if (username.length < 1 || username.length > 32) {
        return "Username must be between 1-32 characters long";
    }

    if (/^[A-z]/.test(username) == false) {
        return "Username must start with a letter";
    }

    return true;
}

function passwordBasicCheck(password) {
    if (password.length == 0 ) {
        return "Must enter a password"
    }
    
    if (password.length < 8) {
        return "Password must be atleast 8 characters long"
    }
    
    if (/\s/.test(password)) {
        return "Password can't any contain spaces"
    }

    if (/^[a-zA-Z]+$/.test(password)) {
        return "Password must contain atleast one letter and number"
    }
    
    return true
}

function confirmBasicCheck(password, confirm) {
    if (password != confirm) {
        return "Confirmation and password must match"
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
function checkUsernameAvailability(username) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'check_username_availability',
            method: 'POST',
            dataType: 'json',
            data: {'username': username},
            success: function(response) {
                resolve(response['available']);
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
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

/**
 * While on the play tab the key 'enter' doubles as a submit answer key.
 * @returns Only returns true when the enter key or submit button is pressed.
*/
function gameInput() {
    return new Promise((resolve) => {
        
        const gameTabInput = document.getElementById('input-result');

        var currentTab = document.querySelector('.full-page.active');
        const submitButton = document.getElementById('question-submit-button');

        // Functionally adds autofocus for valid input[type='number'] keypresses

        if (currentTab.id === 'game-tab') {
            
            document.addEventListener('keydown', (event) => {
                let name = event.key;
                
                if (currentTab.id === 'game-tab') {
                    gameTabInput.focus();
                };

                // If the key pressed is enter the question gets submitted 
                if (name === 'Enter') {
                    resolve(true);
                };
            });
    
            submitButton.addEventListener('click', (event) => {
                resolve(true)
            })
        } else {
            document.removeEventListener('keydown');
        }
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
            addition: true,
            subtraction: true,
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

// Initializes the mode select cards
function initModeSelect() {
    let deviceMaxWidth = screen.width
    var swiper = new Swiper();

    if (deviceMaxWidth > 800) {
        swiper = new Swiper('.swiper', {
            grabCursor: true,
            effect: "creative",
            loop: true,
            creativeEffect: {
                prev: {
                    shadow: false,
                    translate: ["-120%", 0, -500],
                },
                next: {
                    shadow: false,
                    translate: ["120%", 0, -500],
                },
            },
        });
        
    } else {
        swiper = new Swiper(".mySwiper", {
            slidesPerView: 1,
            loop: true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
        });
        
    }
    swiper.on('transitionEnd', async function () {
        submitButtonActivation();
        changeButtonColors();
    });
}

// Updates the span value container for whatever settings-container is being modified
function updateSliderValues() {
    const settingsContainers = document.querySelectorAll('.game-mode');

    settingsContainers.forEach((element) => {
        element.addEventListener('input', (event) => {
            let displayedValue = element.querySelector('span');
            
            if (event.target.value != undefined) {
                displayedValue.innerHTML = event.target.value;
            }
        });
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
    const submitContainer = document.querySelector('.submit-container');
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

function changeButtonColors() {
    const switchboard = document.getElementById('switchboard');
    const submitButton = document.getElementById('submit-button');

    let activeSlide = document.querySelector('.swiper-slide.swiper-slide-active');
    let currentMode = activeSlide.querySelector('.game-mode').getAttribute('class').split(' ')[1];

    switchboard.className = 'switchboard-container ' + currentMode;
    submitButton.className = 'submit-button ' + currentMode;
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

    let currentMode = activeSlide.querySelector('.game-mode').getAttribute('class').split(' ')[1];
    let switchboardState = JSON.stringify(getSwitchboardState());

    let gameResults = []
    
    let questionAmount = activeSlide.querySelector('input').value;
    let timer = 0;
    let shouldEndQuestions = false;
    
    // Array which stores the game results to send back to app.py
    let generatedQuestions = await generateQuestions(switchboardState, questionAmount)
    console.log(generatedQuestions)
    

    switchHomeTabs('game-tab');
    activateGameTimer(20, 'test');

    // All of the operand containers
    const operand1 = document.getElementById('operand-1');
    const operand2 = document.getElementById('operand-2');
    const operator = document.getElementById('operator');
    const result = document.getElementById('input-result');
    const submitButton = document.getElementById('question-submit-button');

    // If the current game mode is timed or sudden death
    if (activeSlide.querySelector('input').classList.contains('timer')) {
        timer = questionAmount * 1000;
        setTimeout(function() {
            shouldEndQuestions = true;
            result.value = 0;
            submitButton.click();
        }, timer);
    }
    
    var correct_answers = 0;
    for (let i = 0; i < generatedQuestions.length; i++) {
                
        let question = generatedQuestions[i];
        
        let questionStartTime = new Date();
        
        operand1.innerHTML = question['operand_1'];
        operand2.innerHTML = question['operand_2']; 
        operator.innerHTML = question['operator']
        
        let userSubmission = await gameInput();

        // Question can not be accidently submitted while the input field is empty 
        while (result.value.length == 0) {
            let userSubmission = await gameInput();
            
            if (result.value.length != 0) {
                shouldEndQuestions = true
                continue;
            }
        }

        // userSubmission becomes true gameInput gets a response above
        if (userSubmission === true) {

            if (shouldEndQuestions == true) {
                gameResults.pop()
                break
                // remove the last entry of gameResult and send it to app.py 
            }

            let questionEndTime = new Date();
            let questionTimeElapsed = ((questionEndTime - questionStartTime) / 1000).toFixed(2);

            if (result.value == question['result']) {
                triggerAnimation(submitButton, 'correct', 200);
                correct_answers++;
                gameResults.push({'correct': true, 'operator': question['operator'], 'timeElapsed': questionTimeElapsed,
                                'difficulty': question['difficulty'], 'level': question['level']})
            } else {
                triggerAnimation(submitButton, 'incorrect', 200);
                gameResults.push({'correct': false, 'operator': question['operator'], 'timeElapsed': questionTimeElapsed})
            }
            
            result.value = '';
            continue;
        }
    
    }
    // AJAX request to send results and return stats while also storing results from a completed game
    // potentially a seperate function just for successfully ending a game
    
    // console.log(generatedQuestions, gameResults)
    let experienceGained = await recordResults(JSON.stringify(gameResults));
    console.log(experienceGained)
    successfullyFinishGame(gameResults, currentMode)

    // let gameEndTime = new Date();
    // let gameTimeElapsed = (gameEndTime - gameStartTime) / 1000;
    // console.log(gameTimeElapsed);
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
            dataType: 'json',
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
                resolve(response);
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

function successfullyFinishGame(gameResults, gameMode) {
    switchHomeTabs('home-tab');
    updateUserLevels();
    console.log(gameResults, gameMode)
}

/* 
Starts the game timer on the game-tab when a game is started
    @ para
*/
function activateGameTimer(length, direction) {
/** 
    Starts the game timer on the game-tab when a game is started
    @param {number} length - The element that will receieve the class
    @param {string} direction - The class that will be added to trigger the animation
*/
    const gameTimer = document.querySelector('.game-timer');

    // The animation of the timer bar doesn't work if its outside of a setTimeout
    setTimeout(function() {
        gameTimer.classList.add('active');
      }, 10);
    
    // gameTimer.style.background = 'blue';

    console.log(length, direction, gameTimer)
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
                console.log('UPDATE USER LEVELS - ERROR -', xhr, status, error);
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


function triggerAnimation(element, animation, timeDelay) {
/** 
 * Triggers animations when the user submits their answer
 * @param {object} element - The element that will receieve the class
 * @param {string} animation - The class that will be added to trigger the animation
 * @param {number} timeDelay - How many ms until the class gets removed again for the animation to reset
*/

    // console.log(element, animation, timeDelay)
    // console.log(typeof(element), typeof(animation), typeof(timeDelay))
    const removeAnimation = function () {
        element.classList.remove(animation);
    };
    
    element.classList.add(animation)
    setTimeout(removeAnimation, timeDelay)
}


main();