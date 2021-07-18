import axios from 'axios';

const LandingPage = ({ currentUser }) => {
	return <div>Landing Page</div>;
};

LandingPage.getInitialProps = async ({ req }) => {
	if (typeof window === 'undefined') {
		const {
			data
		} = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
			headers: req.headers
		});
		return data;
		// we are on the server
	} else {
		// we are on the browser!
		// requests can be made with a base url of ''
		const { data } = await axios.get('/api/users/currentuser');
		return data;
	}
	return {};
};

export default LandingPage;
