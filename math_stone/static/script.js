function main() {
    storedColorScheme();
    wavesEffectToggle();
    displaySessionInformation();
    switch (window.location.pathname) {
        case '/':
            colorSchemeToggle();
            initSlider();
            initForm();
            registerFormSubmit();
            loginFormSubmit();
            break;
        case '/home':
            colorSchemeToggle();
            switchboard();
            initCarousel();
    }
}

function storedColorScheme() {
    let html = document.querySelector('html')
    let storedMode = sessionStorage.getItem('prefferedMode')

    if (storedMode == 'dark') {
        html.classList.remove('light');
        html.classList.add('dark');
    }
}

function colorSchemeToggle() {
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

function initSlider() {
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize slider
        var sliders = document.querySelectorAll('.slider');
        var instances = M.Slider.init(sliders, {
            height: 700
        });
    });
}

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

function initCarousel() {
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.carousel');
        var instances = M.Carousel.init(elems);
      });
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

function loginFormSubmit() {
    var loginForm = document.getElementById('login-form')

    loginForm.addEventListener('submit', async function(e)  {
        e.preventDefault();
        var isValid = await loginFormCheck()
        if (isValid == true) {
            updateSesssionMessage('Login Successful', 'success');
            loginForm.submit();
        }
    })
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

    isUsernameAvailable = await checkUsernameAvailability(username.value)
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
        var isValid = await registerFormCheck()
        if (isValid == true) {
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

// Sends AJAX request 
function errorRedirect(errorMessage, errorCode) {
    $.ajax({
        url: '/error_redirect',
        method: 'POST',
        dataType: 'json',
        data: {'errorMessage': errorMessage, 'errorCode': errorCode},
        success: function(response) {
            console.log('errorRedirect Success.');
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
function switchboard() {
    var switchboard = document.getElementById('switchboard');

    switchboard.addEventListener('click', function(event) {
        if (event.target.classList.contains('switch')) {
            let clickedButton = event.target

            if (clickedButton.classList.contains('active')) {
                clickedButton.classList.remove('active');
            } else {
                clickedButton.classList.add('active');
            }
        }
    })
}

function initModeSelect() {

}
// AJAX request asking for the 
function getModes() {

}



main();