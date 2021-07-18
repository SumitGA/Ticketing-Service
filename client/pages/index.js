import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
	console.log(currentUser);
	return <div>Landing Page</div>;
};

LandingPage.getInitialProps = async (context) => {
	const client = buildClient(context);
	const { data } = await client.get('/api/users/currentuser');
	return data;
};

export default LandingPage;
