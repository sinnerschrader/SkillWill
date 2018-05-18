import React from 'react'
import Icon from '../../icon/icon'

const AdminListItemHeader = props => {
	return (
		<header className="admin-list__item-header">
			<div className="admin-list__item-header__left">
				<h3 className="admin-list__item-header__title">{props.title}</h3>
			</div>
			<div className="admin-list__item-header__right">
				<button className="admin__button" onClick={props.handleDelete}>
					<Icon name="delete" width={20} height={20} />
				</button>
				<button className="admin__button" onClick={props.handleEdit}>
					<Icon name="edit" width={18} height={20} />
				</button>
			</div>
		</header>
	)
}

export default AdminListItemHeader
