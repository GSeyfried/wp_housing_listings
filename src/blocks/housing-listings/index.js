import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name, {
    edit: Edit,
    save: () => null // dynamic block: save is handled by PHP
});

