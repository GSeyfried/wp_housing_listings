function getMultiValue(id) {
  const el = document.getElementById(id);
  if (!el) return [];
  // Choices gives us a helper
  if (el.choices) return el.choices.getValue(true);  // raw values
  return Array.from(el.selectedOptions).map(o => o.value);
}

function clearMulti(id){
  	const el = document.getElementById(id);
  	if (!el) return;

	if (el.choices){
	el.choices.removeActiveItems();
	if (!el.multiple){
		el.choices.setChoiceByValue('');
		el.choices.showPlaceholder(true);   // 👈 new line
 	 }
	}
}

document.addEventListener('DOMContentLoaded', function() {
    const openBtn   = document.getElementById('hrdc-open-search-modal');
    const closeBtn  = document.getElementById('hrdc-close-search-modal');
    const overlay   = document.getElementById('hrdc-modal-overlay');
    const applyBtn  = document.getElementById('hrdc-apply-search');
    const resetBtn  = document.getElementById('hrdc-reset-search');

	document.querySelectorAll('#hrdc-modal-overlay select').forEach(sel => {
        const c = new Choices(sel, {
            removeItemButton : sel.multiple,   // chips get × only on multi-selects
            searchEnabled    : false,  // no type-ahead field
            shouldSort       : false,  // keep original order
            itemSelectText   : '',     // hide tooltip
            classNames       : { containerOuter: 'hrdc-choices' }
        });
        sel.choices = c;              // expose instance for getMultiValue / clearMulti
		sel.style.display = 'none';
    });

	/* ——— open / close ——— */
	openBtn?.addEventListener('click', () => {document.body.classList.add('modal-open');overlay.style.display = 'block'});
	closeBtn?.addEventListener('click', () => {document.body.classList.remove('modal-open');overlay.style.display = 'none'});

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
		document.body.classList.remove('modal-open');
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
		document.body.classList.remove('modal-open');
	});
});
