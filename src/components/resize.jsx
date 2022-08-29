import React, { useState, useEffect } from 'react';

// Library
import exifr from 'exifr'; // => exifr/dist/full.umd.cjs

export const Resize = () => {
	// EXIF
	const [previewIMG, setPreviewIMG] = useState();
	const [dataValue, setDataValue] = useState('');
	const [created, setCreated] = useState(null); // Created Date
	// IMAGE
	const [imageName, setImageName] = useState(null); // Image name
	const [imageFile, setImageFile] = useState(null);
	const [maxValue, setMaxValue] = useState(1920); // max width or height px
	const [imageQuality, setImageQuality] = useState(1); // Image quality 0.8 to 1
	const [widthValue, setWidthValue] = useState(1024);
	const [heightValue, setHeightValue] = useState(768);
	const [oldWidthValue, setOldWidthValue] = useState(1024);
	const [oldheightValue, setOldHeightValue] = useState(768);
	const [imageSize, setImageSize] = useState(1); // Image size KB
	const [OldImageSize, setOldImageSize] = useState(1); // Image size KB
	// Filters
	const [brightness, setBrightness] = useState(1); // Image brightness 0-2
	const [contrast, setContrast] = useState(1); // Image contrast 0-2
	const [saturate, setSaturate] = useState(1); // Image saturate 0-2

	const filtersReset = () => {
		setBrightness(1);
		setContrast(1);
		setSaturate(1);
		let limit = maxValue;
		let quality = imageQuality;
		let bright = 1;
		let contra = 1;
		let satu = 1;

		if (imageFile) {
			let file = imageFile;
			preview_image(file, limit, quality, bright, contra, satu);
		}
	};

	const handleBrightness = (e) => {
		setBrightness(e.target.value);
		let limit = maxValue;
		let quality = imageQuality;
		let bright = e.target.value;
		let contra = contrast;
		let satu = saturate;

		if (imageFile) {
			let file = imageFile;
			preview_image(file, limit, quality, bright, contra, satu);
		}
	};

	const handleContrast = (e) => {
		setContrast(e.target.value);
		let limit = maxValue;
		let quality = imageQuality;
		let bright = brightness;
		let contra = e.target.value;
		let satu = saturate;

		if (imageFile) {
			let file = imageFile;
			preview_image(file, limit, quality, bright, contra, satu);
		}
	};

	const handleSaturate = (e) => {
		setSaturate(e.target.value);
		let limit = maxValue;
		let quality = imageQuality;
		let bright = brightness;
		let contra = contrast;
		let satu = e.target.value;

		if (imageFile) {
			let file = imageFile;
			preview_image(file, limit, quality, bright, contra, satu);
		}
	};

	const handleMaxValue = (e) => {
		setMaxValue(e.target.value);
		let limit = e.target.value;
		let quality = imageQuality;
		let bright = brightness;
		let contra = contrast;
		let satu = saturate;

		if (imageFile) {
			let file = imageFile;
			preview_image(file, limit, quality, bright, contra, satu);
		}
	};
	const handleQuality = (e) => {
		setImageQuality(e.target.value);
		let limit = maxValue;
		let quality = e.target.value;
		let bright = brightness;
		let contra = contrast;
		let satu = saturate;

		if (imageFile) {
			let file = imageFile;
			preview_image(file, limit, quality, bright, contra, satu);
		}
	};

	const handleImageResize = (e) => {
		// Get image from input
		const file = document.getElementById('file');
		setImageFile(file);
		// Process Image
		let limit = maxValue;
		let quality = imageQuality;
		// Filters Reset
		filtersReset();

		preview_image(file, limit, quality);
	};

	const reduce_image_file_size = async (
		base64Str,
		limit,
		quality,
		bright,
		contra,
		satu,
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
				// Filters
				ctx.filter = `brightness(${bright}) contrast(${contra}) saturate(${satu})`;

				// Draw canvas image
				ctx.drawImage(img, 0, 0, width, height);

				//get the base64-encoded Data URI from the resize image
				if (quality == 0.95) {
					resolve(ctx.canvas.toDataURL('image/jpeg', 0.95));
				} else if (quality == 0.9) {
					resolve(ctx.canvas.toDataURL('image/jpeg', 0.9));
				} else if (quality == 0.85) {
					resolve(ctx.canvas.toDataURL('image/jpeg', 0.85));
				} else if (quality == 0.8) {
					resolve(ctx.canvas.toDataURL('image/jpeg', 0.8));
				} else {
					resolve(ctx.canvas.toDataURL('image/jpeg', 1));
				}
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

	const preview_image = async (file, limit, quality, bright, contra, satu) => {
		const reset = '';
		setPreviewIMG(reset);

		// Image to base64
		const res = await image_to_base64(file.files[0]);

		if (res) {
			setPreviewIMG(res);
			// Original image
			const olds = calc_image_size(res);
			setOldImageSize(olds);
			// console.log('Old size => ', olds, 'KB');

			// Resize image
			const resized = await reduce_image_file_size(
				res,
				limit,
				quality,
				bright,
				contra,
				satu
			);
			const news = calc_image_size(resized);
			setImageSize(news);
			// console.log('New size => ', news, 'KB');

			document.getElementById('new').src = resized;
			document.querySelector('#hidden').classList.remove('hidden');

			// Change Date Format
			var date = new Date(dataValue.CreateDate).toDateString();
			setCreated(date);
			// console.log(date);
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

	useEffect(() => {
		previewIMG &&
			exifr
				.parse(`${previewIMG}`, { userComment: true, xmp: true })
				.then((output) => setDataValue(output));
	}, [previewIMG]);

	return (
		<div className='container'>
			<label htmlFor='file' className='image-btn'>
				Select Image
			</label>
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
				<br />
				<br />
				<div className='filters'>
					<div>
						<label htmlFor='brightness'>Brightness</label>
						<input
							type='range'
							min='0'
							max='2'
							step='0.01'
							value={brightness}
							name='brightness'
							id='brightness'
							className='slider'
							onChange={handleBrightness}
						/>
					</div>
					<div>
						<label htmlFor='contrast'>Contrast</label>
						<input
							type='range'
							min='0'
							max='2'
							step='0.01'
							value={contrast}
							name='contrast'
							id='contrast'
							className='slider'
							onChange={handleContrast}
						/>
					</div>
					<div>
						<label htmlFor='saturate'>Saturate</label>
						<input
							type='range'
							min='0'
							max='2'
							step='0.01'
							value={saturate}
							name='saturate'
							id='saturate'
							className='slider'
							onChange={handleSaturate}
						/>
					</div>
					<button onClick={filtersReset}>Reset</button>
				</div>
				<br />
				<br />
				<div className='custome-select'>
					<label className='select'>SELECT max side: </label>
					<select onChange={handleMaxValue}>
						<option value='1920'>1920px</option>
						<option value='1530'>1530px</option>
						<option value='1440'>1440px</option>
						<option value='1280'>1280px</option>
						<option value='1080'>1080px</option>
						<option value='900'>900px</option>
						<option value='720'>720px</option>
						<option value='630'>630px</option>
						<option value='400'>400px</option>
					</select>
				</div>
				<br />
				<div className='custome-select'>
					<label className='select'>SELECT image quality: </label>
					<select onChange={handleQuality}>
						<option value='1'>100%</option>
						<option value='0.95'>95%</option>
						<option value='0.9'>90%</option>
						<option value='0.85'>85%</option>
						<option value='0.8'>80%</option>
					</select>
				</div>

				<p>{imageName}</p>
				<div className='data-container'>
					<pre className='exif-data'>
						{dataValue && (
							<>
								<p>Camera Model: {dataValue.Model}</p>

								{dataValue.Lens && <p>Lens: {dataValue.Lens}</p>}

								<p>ISO:{dataValue.ISO}</p>
								<p>f:{dataValue.FNumber}</p>
								<p>
									S:1/
									{Math.trunc(1 / dataValue.ExposureTime)}
								</p>
								<p>
									Focal:
									{dataValue.FocalLength}mm
								</p>
								{dataValue.subject && <p>Subject: {dataValue.subject}</p>}

								{dataValue.Copyright && <p>Copyright: {dataValue.Copyright}</p>}

								{created !== 'Invalid Date' && <p>Created: {created}</p>}

								{/* <p>{JSON.stringify(dataValue, null, '\t')}</p> */}
							</>
						)}
					</pre>
				</div>

				<p>
					Original: {oldWidthValue.toFixed(0)}px x {oldheightValue.toFixed(0)}px
					_ <b>{OldImageSize.toFixed(0)}</b>KB
				</p>
				<p>
					Resized: {widthValue}px x {heightValue}px _
					<b>
						{imageSize.toFixed(0)}KB _ {imageQuality * 100}%
					</b>
				</p>
				<br />
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
			<br />
		</div>
	);
};
