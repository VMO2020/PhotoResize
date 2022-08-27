import './App.css';
import { Resize } from './components/resize';

function App() {
	return (
		<div className='App'>
			<h2>PHOTO RESIZE</h2>
			<h1>
				Select a JPG, PNG or JPEG photo and resize it by defining new height and
				width pixels. Change image dimensions for use in web applications in
				JPEG format.
			</h1>
			<div className='photo-container'>
				<Resize />
			</div>
			<footer>
				<p>
					<a href='https://vmog.net/' target='_blank' rel='noreferrer'>
						Copyright and web design by © VMOG
					</a>
				</p>
				<p> Liverpool UK 2022 </p>
			</footer>
		</div>
	);
}

export default App;
