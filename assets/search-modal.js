// assets/search‑modal.js
document.addEventListener('DOMContentLoaded', () => {

	const $ = (sel) => document.getElementById(sel);
	const o = $('hrdc-modal-overlay');
	if (!o) return;            /* shortcode not on page */

	$('hrdc-open-search-modal').onclick  = () => o.style.display = 'block';
	$('hrdc-close-search-modal').onclick = () => o.style.display = 'none';

	function gather() {
		return {
			city          : $('hrdc-city').value,
			reservedFor   : $('hrdc-demographic').value,
			felonies      : $('hrdc-felonies').value,
			creditCheck   : $('hrdc-credit').value,
			unitTypes     : $('hrdc-unit-types').value,
			pets          : $('hrdc-pets').value,
			socialSecurity: $('hrdc-social').value,
			category      : $('hrdc-housing-types').value,
		};
	}

	$('hrdc-apply-search').onclick = () => {
		document.dispatchEvent( new CustomEvent('hrdcApplyFilters', { detail: gather() }) );
		o.style.display = 'none';
	};

	$('hrdc-reset-search').onclick = () => {
		[ 'city','demographic','felonies','credit','unit-types','pets','social','housing-types' ]
		.forEach( id => $('hrdc-'+id).value = '' );
		document.dispatchEvent( new CustomEvent('hrdcApplyFilters', { detail: gather() }) );
		o.style.display = 'none';
	};
});
