import React, { useState } from 'react';

const UploadImage = ({ onUpload }) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = () => {
        if (image) {
            const formData = new FormData();
            formData.append('image', image);

            // Call the API to process the image
            fetch('/api/process-image', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    onUpload(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadImage;