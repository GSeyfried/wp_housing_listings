function getMultiValue(id) {
	const el = document.getElementById(id);
	return el ? Array.from(el.selectedOptions).map(o => o.value) : [];
}

function clearMulti(id) {
	const el = document.getElementById(id);
	if (el) Array.from(el.options).forEach(o => (o.selected = false));
}

document.addEventListener('DOMContentLoaded', function() {
    const openBtn   = document.getElementById('hrdc-open-search-modal');
    const closeBtn  = document.getElementById('hrdc-close-search-modal');
    const overlay   = document.getElementById('hrdc-modal-overlay');
    const applyBtn  = document.getElementById('hrdc-apply-search');
    const resetBtn  = document.getElementById('hrdc-reset-search');

	/* ——— open / close ——— */
	openBtn?.addEventListener('click', () => (overlay.style.display = 'block'));
	closeBtn?.addEventListener('click', () => (overlay.style.display = 'none'));

	/* ——— APPLY ——— */
	applyBtn?.addEventListener('click', () => {
		const filters = {
			city          : getMultiValue('hrdc-city'),          // array  []
			reservedFor   : getMultiValue('hrdc-demographic'),   // array  []
			unitTypes     : getMultiValue('hrdc-unit-types'),    // array  []
			category      : getMultiValue('hrdc-housing-types'), // array  []

			felonies      : document.getElementById('hrdc-felonies')?.value || '',
			creditCheck   : document.getElementById('hrdc-credit')?.value   || '',
			pets          : document.getElementById('hrdc-pets')?.value     || 'no',
			socialSecurity: document.getElementById('hrdc-social')?.value   || '',
		};

		document.dispatchEvent(
			new CustomEvent('hrdcApplyFilters', { detail: filters })
		);
		overlay.style.display = 'none';
	});

	/* ——— RESET ——— */
	resetBtn?.addEventListener('click', () => {
		/* clear all multi-selects  */
		['hrdc-city', 'hrdc-demographic', 'hrdc-unit-types', 'hrdc-housing-types']
			.forEach(clearMulti);

		/* clear normal selects   */
		['hrdc-felonies', 'hrdc-credit', 'hrdc-pets', 'hrdc-social']
			.forEach(id => {
				const el = document.getElementById(id);
				if (el) el.value = '';
			});

		const defaultFilters = {
			city: [], reservedFor: [], unitTypes: [], category: [],
			felonies:'', creditCheck:'', pets:'', socialSecurity:''
		};
		document.dispatchEvent(
			new CustomEvent('hrdcApplyFilters', { detail: defaultFilters })
		);
		overlay.style.display = 'none';
	});
});
