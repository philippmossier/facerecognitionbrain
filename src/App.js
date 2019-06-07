import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
	apiKey: 'b570219188c44524bc5e5df0f089f315'
});

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

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: {}
		};
	}

	calculateFaceLocation = () => { };

	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = () => {
		// console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
		this.setState({ imageUrl: this.state.input });
		app.models
			.predict(
				Clarifai.FACE_DETECT_MODEL,
				this.state.input)
			.then(response => this.calculateFaceLocation(response))
			.catch(err => console.log(err));
	}


	render() {
		return (
			<div className="App" >
				<Particles className="Particles" params={particlesOptions} />
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm onButtonSubmit={this.onButtonSubmit} onInputChange={this.onInputChange} />
				<FaceRecognition imageUrl={this.state.imageUrl} />
			</div>
		);
	}
}

export default App;
