function main() {

    rightHere = window.location.pathname

    if (window.location.pathname == '/') {
        initSlider();
        initForm();
        darkModeToggle();
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
    var tabs = document.querySelectorAll('.tabs')
    var tabInstances = M.Tabs.init(tabs);

    
    var loginButton = document.getElementById('login-button')
    var registerButton = document.getElementById('register-button')
    
    var loginTabButton = document.getElementById('login-tab-button') 
    var registerTabButton = document.getElementById('register-tab-button') 
    
    loginButton.addEventListener('click', function() {
        modalInstance.open();
        console.log(loginTabButton)
        loginTabButton.click();
        loginTabButton.click();
    });
    registerButton.addEventListener('click', function() {
        modalInstance.open();
        registerTabButton.click();
    });
}


function darkModeToggle() {

    var toggle = document.querySelector('.dark-mode-toggle')
    var html = document.querySelector('html')

    toggle.addEventListener('click', function() {
        if (html.classList.contains('light') == true) {
            html.classList.remove('light');
            html.classList.add('dark');
        }
        else if (html.classList.contains('dark') == true) {
            html.classList.remove('dark')
            html.classList.add('light')

        }
    });
}




main();