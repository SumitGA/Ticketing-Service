import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
	return (
		<div>
      <Header currentUser={currentUser}/>
			<Component {...pageProps} />
		</div>
	);
};

AppComponent.getInitialProps = async (appContext) => {
	const client = buildClient(appContext.ctx);
	const { data } = await client.get('/api/users/currentuser');

	// Calling getInitialProps of Landing page and manually sending back data to the Landing page
	let pageProps = {};
	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(appContext.ctx);
	}
  //Returning data and props to all the pages
	return {
		pageProps,
		...data
	};
};

export default AppComponent;
