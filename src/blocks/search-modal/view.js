
document.addEventListener('DOMContentLoaded', function(){
    var openBtn = document.getElementById('gt-open-search-modal');
    var overlay = document.getElementById('gt-search-modal-overlay');
    var closeBtn = document.getElementById('gt-close-search-modal');
    var applyBtn = document.getElementById('gt-apply-search');

    if ( openBtn ) {
        openBtn.addEventListener('click', function(){
            overlay.style.display = 'flex';
        });
    }
    if ( closeBtn ) {
        closeBtn.addEventListener('click', function(){
            overlay.style.display = 'none';
        });
    }
    if ( applyBtn ) {
        applyBtn.addEventListener('click', function(){
            var city = document.getElementById('gt-city').value;
            var category = document.getElementById('gt-category').value;
            // Dispatch a custom event with search criteria so that the housing listings block can update.
            var event = new CustomEvent('gtApplyFilters', { detail: { city: city, category: category } });
            document.dispatchEvent(event);
            overlay.style.display = 'none';
        });
    }
});
