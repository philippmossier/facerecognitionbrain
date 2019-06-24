import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

// PAGE LAYOUT , from top to bottom :
// Navigation : Top Right Corner --> signOut, signIn , Register ( depends on routeChange )
// Logo : Top Left Corner --> Interactive Logo
// Rank : Upper Mid --> Show rank ( amount of detected images)
// ImageLinkForm : Middle --> insert link and detect button
// FaceRecognition : Displays your detected image with all the magic behind the scenes

//Face Recognition API for more security move this to the backend instead of frontend
const app = new Clarifai.App({
	apiKey: 'b570219188c44524bc5e5df0f089f315'
});

// Background effects
const particlesOptions = {
	particles: {
		number: {
			value: 120,
			density: {
				enable: true,
				value_area: 800
			}
		}
	}
};

const initialState = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'signIn',
	isSignedIn: false,
	user: {
		id: "",
		name: "",
		email: "",
		password: "",
		entries: 0,
		joined: ''
	}
}

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	//testImage: https://static1.squarespace.com/static/53974d6fe4b067f5901248a2/53974df3e4b0b28690e37782/53974e63e4b0670ac5257fcc/1407005189379/200707090453cr.jpg?format=2500w

	// Only for testing if connection works
	// componentDidMount() {
	// 	fetch("http://localhost:3000")
	// 		.then(response => response.json())
	// 		.then(console.log)
	// }


	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				password: data.password,
				entries: data.entries,
				joined: data.joined
			}
		})
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box; //API output :Percentage of location sidewise
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - clarifaiFace.right_col * width,
			bottomRow: height - clarifaiFace.bottom_row * height
		};
	};

	displayFacebox = (box) => {
		this.setState({ box: box });
	};

	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};

	onPictureSubmit = () => {
		// console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
		this.setState({ imageUrl: this.state.input });
		app.models
			.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
			.then(response => {
				if (response) {
					fetch("http://localhost:3000/image", {
						method: "put",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({    // just need to send user.id when user logins 
							id: this.state.user.id,

						})
					})
						.then(response => response.json())
						.then(count => {
							this.setState(Object.assign(this.state.user, { entries: count }))
						})
						.catch(console.log)
				}
				this.displayFacebox(this.calculateFaceLocation(response))
			})
			.catch((err) => console.log(err));
	};
	//Page Navigation
	onRouteChange = (route) => {
		if (route === "signOut") {
			this.setState(initialState)
		} else if (route === "home") {
			this.setState({ isSignedIn: true, })
		}
		this.setState({ route: route })
	};



	//Particles background effects need to be on top of Layout
	render() {
		return (
			<div className="App">
				<Particles className="Particles" params={particlesOptions} />
				<Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
				{this.state.route === 'home'
					? <div>
						<Logo />
						<Rank name={this.state.user.name} entries={this.state.user.entries} />
						<ImageLinkForm onPictureSubmit={this.onPictureSubmit} onInputChange={this.onInputChange} />
						<FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
					</div>
					: (
						this.state.route === "signin"
							? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
							: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />)

				}
			</div>
		);
	}
}

export default App;


