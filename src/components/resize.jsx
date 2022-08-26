import React, { useState } from 'react';

export const Resize = () => {
	const [image, setImage] = useState(null);
	const [imageName, setImageName] = useState(null);
	const [maxValue, setMaxValue] = useState(1920); // max width or height px
	const [widthValue, setWidthValue] = useState(1024);
	const [heightValue, setHeightValue] = useState(768);
	const [oldWidthValue, setOldWidthValue] = useState(1024);
	const [oldheightValue, setOldHeightValue] = useState(768);
	const [imageSize, setImageSize] = useState(1); // Image size KB
	const [OldImageSize, setOldImageSize] = useState(1); // Image size KB

	const handleMaxValue = (e) => {
		setMaxValue(e.target.value);
		let limit = e.target.value;

		if (image) {
			let file = image;
			preview_image(file, limit);
		}
	};

	const handleImageResize = () => {
		// Get image from input
		const file = document.getElementById('file');
		setImage(file);
		// Process Image
		let limit = maxValue;

		preview_image(file, limit);
	};

	const reduce_image_file_size = async (
		base64Str,
		limit,
		MAX_WIDTH = limit,
		MAX_HEIGHT = limit
	) => {
		let resized_base64 = await new Promise((resolve) => {
			let img = new Image();
			img.src = base64Str;
			img.onload = () => {
				let canvas = document.createElement('canvas');
				let width = img.width;
				let height = img.height;
				setOldWidthValue(width);
				setOldHeightValue(height);

				if (width > height) {
					if (width > MAX_WIDTH) {
						height *= MAX_WIDTH / width;
						width = MAX_WIDTH;
					}
				} else {
					if (height > MAX_HEIGHT) {
						width *= MAX_HEIGHT / height;
						height = MAX_HEIGHT;
					}
				}

				setWidthValue(width);
				setHeightValue(height);

				canvas.width = width;
				canvas.height = height;
				let ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, width, height);
				//get the base64-encoded Data URI from the resize image
				resolve(ctx.canvas.toDataURL('image/jpeg', 0.8));
			};
		});
		return resized_base64;
	};

	const image_to_base64 = async (file) => {
		let result_base64 = await new Promise((resolve) => {
			let fileReader = new FileReader();

			fileReader.onload = (e) => resolve(fileReader.result);
			fileReader.onerror = (error) => {
				console.log(error);
				alert('An Error occurred please try again, File might be corrupt');
			};

			// Image turned to base64-encoded Data URI.
			fileReader.readAsDataURL(file);
			fileReader.name = file.name; //get the image  name
			fileReader.size = file.size; //get the image size
			fileReader.type = file.type; //get the image type
			setImageName(fileReader.name);
		});
		return result_base64;
	};

	const preview_image = async (file, limit) => {
		// Image to base64
		const res = await image_to_base64(file.files[0]);

		if (res) {
			// Original image
			const olds = calc_image_size(res);
			setOldImageSize(olds);
			// console.log('Old size => ', olds, 'KB');

			// Resize image
			const resized = await reduce_image_file_size(res, limit);
			const news = calc_image_size(resized);
			setImageSize(news);
			// console.log('New size => ', news, 'KB');

			document.getElementById('new').src = resized;
			document.querySelector('#hidden').classList.remove('hidden');
		} else {
			console.log('image return err');
		}
	};

	const calc_image_size = (image_to_process) => {
		let y = 1;
		if (image_to_process.endsWith('==')) {
			y = 2;
		}
		const x_size = image_to_process.length * (3 / 4) - y;
		return Math.round(x_size / 1024);
	};

	return (
		<div className='container'>
			<div>
				<label>SELECT max size: </label>
				<select onChange={handleMaxValue}>
					<option value='1920'>1920px</option>
					<option value='1440'>1440px</option>
					<option value='1280'>1280px</option>
					<option value='1080'>1080px</option>
					<option value='810'>810px</option>
					<option value='720'>720px</option>
					<option value='600'>600px</option>
					<option value='400'>400px</option>
				</select>
			</div>
			<br />
			<input
				id='file'
				accept='.jpg, .png, .jpeg'
				type='file'
				onChange={handleImageResize}
			/>
			<br />
			<br />
			<div className='hidden' id='hidden'>
				<img src='' id='new' alt='rezised' />
				<p>{imageName}</p>

				<p>
					Original: {oldWidthValue.toFixed(0)}px x {oldheightValue.toFixed(0)}px
					_ <b>{OldImageSize.toFixed(0)}</b>KB
				</p>
				<p>
					Resized: {widthValue}px x {heightValue}px _
					<b>{imageSize.toFixed(0)}</b>KB
				</p>
				{imageName && (
					<a
						href={document.getElementById('new').src}
						download={imageName}
						id='new'
						className='btn__click'
					>
						Download Image
					</a>
				)}
			</div>
		</div>
	);
};
