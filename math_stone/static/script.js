function main() {
    if (window.location.pathname == '/') {
        initSlider();
        initForm();
        darkModeToggle();
        registerVerification();
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

function loginVerification() {
    // TODO
}

function registerVerification() {
    var registerForm = document.getElementById('reg-form')

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var username = document.getElementById('reg-username')
        var password = document.getElementById('reg-password')
        var confirm = document.getElementById('reg-confirm')

        // Running Basic Tests
        if (!usernameErrorHandler(usernameBasicCheck(username.value), username)) {
            return
        }
        if (usernameAvailability(username.value)) {
            usernameErrorHandler("Username is already registered", username)
            return
        }
        if (!passwordErrorHandler(passwordBasicCheck(password.value), password)) {
            return
        }
        if (!confirmErrorHandler(confirmBasicCheck(password.value, confirm.value), confirm)) {
            return
        }
        
    })
}

function usernameBasicCheck(username) {
    // TODO: checks for a username and returns an error message if its false. 
    // No error message will be returned for a success and therefore no need to return a bool, just count the return
    if (/\s/.test(username)) {
        return "Username can't any contain spaces"
    }
    if (username.length < 1 || username.length > 20) {
        return "Username must be between 1-20 characters long";
    }
    if (/^[A-z]/.test(username) == false) {
        return "Username must start with a letter";
    }
    return true;
}

function usernameErrorHandler(errorMessage, username) {
    var usernameErrorBox = document.getElementById('reg-username-error');
    var usernameLabel = document.getElementById('reg-username-label');

    if (errorMessage != true) {
        usernameErrorBox.innerHTML = errorMessage;

        usernameErrorBox.classList.remove('fade-out')
        usernameErrorBox.classList.add('fade-in');

        usernameLabel.classList.remove('success');
        username.classList.remove('success');
        usernameLabel.classList.add('failure');
        username.classList.add('failure');
        return false
    }
    else {
        usernameErrorBox.classList.remove('fade-in');
        usernameErrorBox.classList.add('fade-out');

        usernameLabel.classList.add('success');
        username.classList.add('success');
        usernameLabel.classList.remove('failure');
        username.classList.remove('failure');
        return true
    }
}

function passwordBasicCheck(password) {
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

function passwordErrorHandler(errorMessage, password) {
    var passwordLabel = document.getElementById('reg-password-label')
    var passwordErrorBox = document.getElementById('reg-password-error')

    if (errorMessage != true) {
        passwordErrorBox.innerHTML = errorMessage;

        passwordErrorBox.classList.remove('fade-out');
        passwordErrorBox.classList.add('fade-in');

        passwordLabel.classList.remove('success');
        password.classList.remove('success');
        passwordLabel.classList.add('failure');
        password.classList.add('failure');
        return false
    } else {
        passwordErrorBox.classList.remove('fade-in')
        passwordErrorBox.classList.add('fade-out')

        passwordLabel.classList.add('success')
        password.classList.add('success')
        passwordLabel.classList.remove('failure')
        password.classList.remove('failure')
        return true
    }
}

function confirmBasicCheck(password, confirm) {
    if (password != confirm) {
        return "Confirmation and password must match"
    }
    return true
}

function confirmErrorHandler(errorMessage, confirm) {
    var confirmErrorBox = document.getElementById('reg-confirm-error')
    var confirmLabel = document.getElementById('reg-confirm-label')

    if (errorMessage != true) {
        confirmErrorBox.innerHTML = errorMessage;

        confirmErrorBox.classList.remove('fade-out');
        confirmErrorBox.classList.add('fade-in');

        confirmLabel.classList.remove('success');
        confirm.classList.remove('success');
        confirmLabel.classList.add('failure');
        confirm.classList.add('failure');
        return false
    } else {
        confirmErrorBox.classList.remove('fade-in')
        confirmErrorBox.classList.add('fade-out')

        confirmLabel.classList.add('success')
        confirm.classList.add('success')
        confirmLabel.classList.remove('failure')
        confirm.classList.remove('failure')
        return true
    }
}
// Sends AJAX request to check the availability of a username in app.py
function usernameAvailability(username) {
    $.ajax({
        url: 'check_username_availability',
        method: 'POST',
        dataType: 'json',
        data: {'username': username},
        success: function(response) {
            if (response.availabile) {
                return true
            } else {
                return false
            }
        },
        error: function(xhr, status, error) {
            console.log(status, error)
            // handle ajax error
            // redirect to error page with the error code
        }
    })
}

function darkModeToggle() {

    var toggle = document.querySelector('.dark-mode-toggle')
    var html = document.querySelector('html')

    toggle.addEventListener('click', function() {
        if (html.classList.contains('light') == true) {
            html.classList.remove('light');
            html.classList.add('dark');
        } else if (html.classList.contains('dark') == true) {
            html.classList.remove('dark')
            html.classList.add('light')
        }
    });
}


function errorRedirect(errorMessage, errorCode) {
    $.ajax({
        url: '/error_redirect',
        method: 'POST',
        dataType: 'json',
        data: {'errorMessage': errorMessage, 'errorCode': errorCode}
    })
}



main();