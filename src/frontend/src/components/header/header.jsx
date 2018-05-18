import React from 'react'
import Navigation from '../navigation/navigation'
import NavigationItem from '../navigation/navigation-item'
import NavigationLink from '../navigation/navigation-link'
import NavigationList from '../navigation/navigation-list'
import NavigationListItem from '../navigation/navigation-list-item'
import Logo from '../logo/logo'
import Icon from '../icon/icon.jsx'
import config from '../../config.json'

export default class Header extends React.Component {

	render() {
		return (
			<header className="header">
				<Navigation>
					<NavigationItem>
						<NavigationLink target={'/'}>
							<Icon name="s2-logo" width={131} height={30} />
						</NavigationLink>
					</NavigationItem>
					<NavigationItem>
						<NavigationLink target={'/'}>
							<Logo small />
						</NavigationLink>
					</NavigationItem>
					<NavigationItem>
						<NavigationList>
							<NavigationListItem target={'/admin'}>
								<Icon name="options" width={20} height={20} />
							</NavigationListItem>
							<NavigationListItem target={config.slackChannelUrl}>
								<Icon name="slack" width={20} height={20} />
							</NavigationListItem>
							<NavigationListItem target={'/my-profile'}>
								<Icon name="user" width={20} height={20} />
							</NavigationListItem>
						</NavigationList>
					</NavigationItem>
				</Navigation>
			</header>
		)
	}
}
