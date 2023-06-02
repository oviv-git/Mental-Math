function main() {
    initializeModals();
} 


function initializeModals() {
    document.addEventListener('DOMContentLoaded', function() {
        var modals = document.querySelectorAll('.modal')
        var instances = M.Modal.init(modals);
    });
}


main();