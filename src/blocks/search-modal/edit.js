import { useState } from '@wordpress/element';
import { Modal, Button, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function SearchModalBlock() {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ filters, setFilters ] = useState({
		city: '',
		reservedFor: '',
		felonies: '',
		creditCheck: '',
		unitTypes: '',
		petsAllowed: '',
		socialSecurity: '',
		category: ''
	});

	const openModal = () => setIsOpen( true );
	const closeModal = () => setIsOpen( false );

	// Dispatch filter event with current filters
	const applyFilters = () => {
		const event = new CustomEvent( 'hrdcApplyFilters', { detail: filters } );
		document.dispatchEvent( event );
		closeModal();
	};

	// Reset filters to default values and dispatch empty filters event.
	const resetFilters = () => {
		const defaultFilters = {
			city: '',
			reservedFor: '',
			felonies: '',
			creditCheck: '',
			unitTypes: '',
			petsAllowed: '',
			socialSecurity: '',
			category: ''
		};
		setFilters( defaultFilters );
		const event = new CustomEvent( 'hrdcApplyFilters', { detail: defaultFilters } );
		document.dispatchEvent( event );
		closeModal();
	};

	return (
		<div className="hrdc-search-modal">
			<Button onClick={ openModal }>
				{ __( 'Search by Criteria', 'hrdc-custom-tools' ) }
			</Button>
			{ isOpen && (
				<Modal
					title={ __( 'Filter Listings', 'hrdc-custom-tools' ) }
					onRequestClose={ closeModal }
					shouldCloseOnClickOutside
				>
					<SelectControl
						label={ __( 'City', 'hrdc-custom-tools' ) }
						value={ filters.city }
						options={[
							{ label: __( 'Any', 'hrdc-custom-tools' ), value: '' },
							{ label: 'Bozeman', value: 'bozeman' },
							{ label: 'Belgrade', value: 'belgrade' },
							{ label: 'West Yellowstone', value: 'west yellowstone' },
							{ label: 'Livingston', value: 'livingston' },
							{ label: 'Clyde Park', value: 'clyde park' },
							{ label: 'Emigrant', value: 'emigrant' }
						]}
						onChange={ ( value ) => setFilters( { ...filters, city: value } ) }
					/>
					<SelectControl
						label={ __( 'Demographic', 'hrdc-custom-tools' ) }
						value={ filters.reservedFor }
						options={[
							{ label: __( 'None of the above', 'hrdc-custom-tools' ), value: '' },
							{ label: 'Senior (55+)', value: 'senior (55+)' },
							{ label: 'Senior (62+)', value: 'senior (62+)' },
							{ label: 'Person with Disabling Condition', value: 'person with disabling condition' }
						]}
						onChange={ ( value ) => setFilters( { ...filters, reservedFor: value } ) }
					/>
					<SelectControl
						label={ __( 'Do you have a felony conviction?', 'hrdc-custom-tools' ) }
						value={ filters.felonies }
						options={[
							{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
							{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' }
						]}
						onChange={ ( value ) => setFilters( { ...filters, felonies: value } ) }
					/>
					<SelectControl
						label={ __( 'Do you have good credit (above 600+)?', 'hrdc-custom-tools' ) }
						value={ filters.creditCheck }
						options={[
							{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
							{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' }
						]}
						onChange={ ( value ) => setFilters( { ...filters, creditCheck: value } ) }
					/>
					<SelectControl
						label={ __( 'Unit Types', 'hrdc-custom-tools' ) }
						value={ filters.unitTypes }
						options={[
							{ label: __( 'Any', 'hrdc-custom-tools' ), value: '' },
							{ label: 'Studio', value: 'studio' },
							{ label: '1 bedroom', value: '1 bedroom' },
							{ label: '2 bedrooms', value: '2 bedrooms' },
							{ label: '3 bedrooms', value: '3 bedrooms' },
							{ label: '4+ bedrooms', value: '4+ bedrooms' }
						]}
						onChange={ ( value ) => setFilters( { ...filters, unitTypes: value } ) }
					/>
					<SelectControl
						label={ __( 'Are you looking for pet friendly units (for non‑service animals)?', 'hrdc-custom-tools' ) }
						value={ filters.petsAllowed }
						options={[
							{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
							{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' }
						]}
						onChange={ ( value ) => setFilters( { ...filters, petsAllowed: value } ) }
					/>
					<SelectControl
						label={ __( 'Do you have a social security number?', 'hrdc-custom-tools' ) }
						value={ filters.socialSecurity }
						options={[
							{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
							{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' }
						]}
						onChange={ ( value ) => setFilters( { ...filters, socialSecurity: value } ) }
					/>
					<SelectControl
						label={ __( 'Housing Types', 'hrdc-custom-tools' ) }
						value={ filters.category }
						options={[
							{ label: __( 'Any', 'hrdc-custom-tools' ), value: '' },
							{ label: 'Low Income Tax Credit', value: 'low income tax credit' },
							{ label: 'Subsidized Housing', value: 'subsidized housing' },
							{ label: 'Market Rate', value: 'market rate' }
						]}
						onChange={ ( value ) => setFilters( { ...filters, category: value } ) }
					/>
					<div style={ { marginTop: '20px' } }>
						<Button isPrimary onClick={ applyFilters } style={ { marginRight: '10px' } }>
							{ __( 'Apply Filters', 'hrdc-custom-tools' ) }
						</Button>
						<Button onClick={ resetFilters }>
							{ __( 'Reset Filters', 'hrdc-custom-tools' ) }
						</Button>
					</div>
				</Modal>
			) }
		</div>
	);
}
