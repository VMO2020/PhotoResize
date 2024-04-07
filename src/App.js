import './App.scss';
import { Resize } from './components/resize';

function App() {
	return (
		<div className="App">
			<header>
				<h2>PHOTO RESIZE</h2>
				<h1>
					Select a JPG, PNG or JPEG photo and resize it by defining new height
					and width pixels. Change image dimensions for use in web applications
					in JPEG format.
				</h1>
			</header>

			<main className="photo-container">
				<Resize />
			</main>

			<footer>
				<p>
					<a href="https://vmog.net/" target="_blank" rel="noreferrer">
						Copyright and web design by © VMOG
					</a>
				</p>
				<p>
					<i>Liverpool UK 2022</i>
				</p>
			</footer>
		</div>
	);
}

export default App;
