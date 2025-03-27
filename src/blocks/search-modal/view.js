document.addEventListener('DOMContentLoaded', function() {
    const openBtn   = document.getElementById('hrdc-open-search-modal');
    const closeBtn  = document.getElementById('hrdc-close-search-modal');
    const overlay   = document.getElementById('hrdc-modal-overlay');
    const applyBtn  = document.getElementById('hrdc-apply-search');
    const resetBtn  = document.getElementById('hrdc-reset-search');

    if ( openBtn && overlay ) {
        openBtn.addEventListener('click', () => {
            overlay.style.display = 'block';
        });
    }
    if ( closeBtn && overlay ) {
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }
    if ( applyBtn && overlay ) {
        applyBtn.addEventListener('click', () => {
            // read form values, dispatch event, then hide
            const filters = {
                city: document.getElementById('hrdc-city')?.value || '',
                reservedFor: document.getElementById('hrdc-demographic')?.value || '',
                felonies: document.getElementById('hrdc-felonies')?.value || '',
                creditCheck: document.getElementById('hrdc-credit')?.value || '',
                unitTypes: document.getElementById('hrdc-unit-types')?.value || '',
                pets: document.getElementById('hrdc-pets')?.value || 'no',
                socialSecurity: document.getElementById('hrdc-social')?.value || '',
                category: document.getElementById('hrdc-housing-types')?.value || '',
            };
            console.log(filters);
            document.dispatchEvent(new CustomEvent('hrdcApplyFilters', { detail: filters }));
            overlay.style.display = 'none';
        });
    }
    if ( resetBtn && overlay ) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('hrdc-city').value = '';
            document.getElementById('hrdc-demographic').value = '';
            document.getElementById('hrdc-felonies').value = '';
            document.getElementById('hrdc-credit').value = '';
            document.getElementById('hrdc-unit-types').value = '';
            document.getElementById('hrdc-pets').value = '';
            document.getElementById('hrdc-social').value = '';
            document.getElementById('hrdc-housing-types').value = '';

            // dispatch default filters
            const defaultFilters = {
                city: '',
                reservedFor: '',
                felonies: '',
                creditCheck: '',
                unitTypes: '',
                pets: '',
                socialSecurity: '',
                category: ''
            };
            document.dispatchEvent(new CustomEvent('hrdcApplyFilters', { detail: defaultFilters }));
            overlay.style.display = 'none';
        });
    }
});
