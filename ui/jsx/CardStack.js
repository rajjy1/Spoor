import { CardStack, Card } from 'react-cardstack';
import React from 'react';
import ReactDOM from 'react-dom';

const styles = {
    cardHeader: {
        display: 'flex',
        height: '100px',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        color: '#fff',
    },
    headerName: {
        margin: 0,
        fontWeight: 500,
        fontSize: '25px',
        textAlign: 'right'
    },
    headerTitle: {
        margin: '4px 0 0',
        fontWeight: 300,
        fontSize: '17px',
        opacity: 0.8,
        textAlign: 'right',
        display: 'hidden'
    }
};

const App = (props) => (
	<CardStack
		height={500}
		width={400}
		background='#f8f8f8'
	  hoverOffset={25}
	  position= 'fixed'>

		<Card background='#5674b9'>
      <TeamMemberCard
		imgSrc='../../resources/images/crucible-icon.png'
		imgBorderColor='#6A067A'
		name='Crucible'
		titleid='reviews'
	      id = "crucible"
	      inputVisible = 'none'
        />
		</Card>

		<Card background='#00bff3'>
			<TeamMemberCard
		imgSrc='../../resources/images/jenkins-icon.png'
		imgBorderColor='#015389'
		titleid='failed'
				name='Jenkins'
				id = "jenkins"
				inputVisible = 'none'/>
		</Card>

		<Card background='#3cb878'>
			<TeamMemberCard
		        imgSrc='../../resources/images/jira-icon.png'
				imgBorderColor='#6A067A'
				name='Jira'
				titleid='jiras'
				id = "jira"
				inputVisible = 'none'/>
		</Card>

		<Card background='#acd373'>
			<TeamMemberCard
		        imgSrc='../../resources/images/github-icon.png'
		        imgBorderColor='#086C32'
				name='Github'
				titleid='requests'
				id = "github"
				inputVisible = 'none'/>
		</Card>

        <Card background='#b7b7b7'>
			<TeamMemberCard
				imgSrc='../../resources/images/happy_icon.png'
				imgBorderColor='#086C32'
				name='Spoor'
				title='what you owe to your team'
				mobileNo='0491 570 157'
				id = "spoor"
				inputVisible = 'visible'
				role="Isaac has overseen all of Hunter and Co's creative efforts for the last five years. He's ability to generate a shared vision between teams throughout the company has been his biggest achievement."
			/>
		</Card>

	</CardStack>
);

const ProfilePicture = ({ imgSrc, borderColor }) => (
	<img
		style={{
			width: '40px',
			height: '40px',
			borderRadius: '100%',
			border: `3px solid ${borderColor}`
		}}
		src={imgSrc}
	/>
);

const DetailsRow = ({ icon, title, summary }) => {
	const styles = {
		row: {
			width: '100%',
			padding: '0 20px',
			display: 'flex',
			alignItems: 'center',
			margin: '25px 0'
		},
		icon: {
			display: 'block',
			width: '25px',
			height: '30px',
			margin: '0 20px 0 0',
			borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
			textAlign: 'center',
			fontSize: '22px'
		},
		title: {
			fontWeight: 500,
			fontSize: '20px',
			margin: 0,
			fontStyle: 'italic'
		}
	};
	const renderSummary = () => {
		if(summary) return (
			<p style={{ fontWeight: 300, lineHeight: 1.45 }}>
				{summary}
			</p>
		);
		return null;
	};

	return (
		<div style={styles.row}>
			<span className={`icon ${icon}`}
			style={Object.assign({}, styles.icon, {alignSelf: 'flex-start'})}></span>
			<div style={{ width: '80%' }}>
				<h2 style={styles.title}>
					{title}
				</h2>
				{renderSummary()}
			</div>
		</div>
	);
};

const TeamMemberCard = (props) => (
	<div style={{ position: 'absolute', top: 0 }}>
		<header style={styles.cardHeader} className='card-header-details'>
			<ProfilePicture imgSrc={props.imgSrc} borderColor={props.imgBorderColor} />
            <div>
                <p id={props.titleid}> </p>
            </div>
			<div>
				<h1 style={styles.headerName}>{props.name}</h1>
				<h3 style={styles.headerTitle} className='icon ion-ios-arrow-down'>{props.status}</h3>
			</div>
		</header>
        <div>
            <p><ul id = {props.id} className="componentul"> </ul></p>
        </div>
    </div>
);

ReactDOM.render(<App />, document.getElementById('root'));