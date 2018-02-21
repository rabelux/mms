import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from 'material-ui/Dialog';

import CollectionIcon from 'Fragments/CollectionIcon';
import MenuIcon from 'material-ui-icons/MoreVert';

import PubSub from 'pubsub-js';
import Server from 'server';

const styles = {
};

// TODO: The hover effect is currently hacked by global CSS, should probably better be handled locally, but how?

class CollectionListItem extends Component {
	state = {
		anchorEl: null,
		confirmOpen: false,
	}

	handleMenuClick = (event) => {
		event.stopPropagation();
		event.preventDefault();
		this.setState({ anchorEl: event.currentTarget });
	}

	handleMenuClose = (event) => {
		event.stopPropagation();
		event.preventDefault();
		this.setState({ anchorEl: null });
	}

	handleItemClick = () => {
		if (this.props.click === 'edit') {
			PubSub.publish('EDIT_COLLECTION', { collection: this.props.collection });
		} else {
			PubSub.publish('SHOW_VIEW', { view: 'collection', props: {collection: this.props.collection} });
		}
	}

	handleEdit = (event) => {
		this.handleMenuClose(event);
		PubSub.publish('EDIT_COLLECTION', { collection: this.props.collection });
	}

	handleShowConfirm = (event) => {
		event.stopPropagation();
		event.preventDefault();
		this.handleMenuClose();
		this.setState({ confirmOpen: true });
	}

	handleDelete = () => {
		Server.deleteCollection({ id: this.props.collection.id });
		PubSub.publish('SHOW_SNACKBAR', {
			message: 'Collection "' + this.props.collection.name + '" was deleted.',
			autoHide: 5000,
		});
	}

	handleConfirmClose = () => {
		this.setState({ confirmOpen: false });
	}

	formatFoldersString = () => {
		var res = '';
		const folders = this.props.collection.folders;
		if (folders) {
			res += (folders.length > 1 ? 'Folders:' : 'Folder:') + ' ';
			res += folders.join(', ');
		}
		return res;
	}

	render() {
		return (
			<div>
				<ListItem
					button
					key={this.props.collection.id}
					className='listItem'
					onClick={this.handleItemClick}>
					<Avatar>
						<CollectionIcon type={this.props.collection.type} />
					</Avatar>
					<ListItemText
						primary={this.props.collection.name}
						secondary={this.formatFoldersString()}
					/>
					<IconButton aria-label='ItemMenu' className='itemButtonOnHover' onClick={this.handleMenuClick}>
						<MenuIcon />
					</IconButton>

					{/* Menu */}
					<Menu
						id='collectionmenu'
						anchorEl={this.state.anchorEl}
						open={Boolean(this.state.anchorEl)}
						onClose={this.handleMenuClose}
					>
						<MenuItem onClick={this.handleEdit}>Edit</MenuItem>
						<MenuItem onClick={this.handleShowConfirm}>Delete</MenuItem>
					</Menu>
				</ListItem>

				{/* Confirmation */}
				<Dialog
					open={this.state.confirmOpen}
					onClose={this.handleConfirmClose}
				>
					<DialogTitle>{'Delete collection "' + this.props.collection.name + '"?'}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							This cannot be undone, the collection will be deleted permanently with all the stored metadata.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleConfirmClose}>
							Cancel
						</Button>
						<Button onClick={this.handleDelete} color='primary' autoFocus>
							Delete
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

CollectionListItem.propTypes = {
	classes: PropTypes.object.isRequired,
	collection: PropTypes.object.isRequired,
	click: PropTypes.string,
};

export default withStyles(styles)(CollectionListItem);