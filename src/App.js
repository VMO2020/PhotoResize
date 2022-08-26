import './App.css';
import { Resize } from './components/resize';

function App() {
	return (
		<div className='App'>
			<h1>PHOTO RESIZE</h1>
			<div className='photo-container'>
				<Resize />
			</div>
		</div>
	);
}

export default App;
