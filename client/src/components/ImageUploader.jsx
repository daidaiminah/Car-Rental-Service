// import { useState } from 'react';
// import { toast } from 'react-toastify';
// import { FiUpload, FiX } from 'react-icons/fi';
// const ImageUploader = ({ 
//   onUpload, 
//   existingImage, 
//   folder = 'uploads',
//   aspectRatio = 4/3,
//   shape = 'rectangle' // 'rectangle' or 'circle'
// }) => {
//   const [image, setImage] = useState(existingImage || '');
//   const [loading, setLoading] = useState(false);
//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     // Validate file type
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error('Only JPG, JPEG, PNG, and WebP images are allowed');
//       return;
//     }
//     // Validate file size (8MB max)
//     if (file.size > 8 * 1024 * 1024) {
//       toast.error('Image size should be less than 8MB');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
//     formData.append('folder', folder);
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );
//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }
//       const data = await response.json();
//       setImage(data.secure_url);
//       onUpload({ 
//         url: data.secure_url,
//         publicId: data.public_id
//       });
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       toast.error('Failed to upload image. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleRemove = () => {
//     setImage('');
//     onUpload({ url: '', publicId: '' });
//   };
//   const containerClasses = shape === 'circle' 
//     ? 'rounded-full overflow-hidden' 
//     : 'rounded-lg';
//   return (
//     <div className={`relative ${containerClasses} ${shape === 'circle' ? 'w-full h-full' : ''}`}>
//       {image ? (
//         <div className="relative group">
//           <img
//             src={image}
//             alt="Uploaded"
//             className={`w-full h-full object-cover ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
//           />
//           <button
//             type="button"
//             onClick={handleRemove}
//             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//             title="Remove image"
//           >
//             <FiX size={16} />
//           </button>
//         </div>
//       ) : (
//         <label 
//           className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer ${
//             shape === 'circle' ? 'rounded-full w-full h-full' : 'rounded-lg p-8'
//           }`}
//         >
//           <input
//             type="file"
//             className="hidden"
//             accept="image/jpeg, image/png, image/webp"
//             onChange={handleUpload}
//           />
//           <FiUpload className={`text-gray-400 ${shape === 'circle' ? 'h-8 w-8' : 'h-12 w-12'}`} />
//           {shape !== 'circle' && (
//             <>
//               <p className="mt-2 text-sm text-gray-600 text-center">
//                 Click to upload an image
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 JPG, JPEG, PNG, or WEBP (Max: 8MB)
//               </p>
//             </>
//           )}
//         </label>
//       )}
//       {loading && (
//         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="text-white">Uploading...</div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default ImageUploader;

import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiUpload, FiX } from 'react-icons/fi';

const ImageUploader = ({ 
  onUpload, 
  existingImage, 
  folder = 'uploads',
  aspectRatio = 4/3,
  shape = 'rectangle'
}) => {
  const [image, setImage] = useState(existingImage || '');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file size (8MB max)
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size should be less than 8MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImage(data.secure_url);
      onUpload(data.secure_url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage('');
    onUpload('');
  };

  return (
    <div className="space-y-2">
      {image ? (
        <div className={`relative ${shape === 'circle' ? 'rounded-full aspect-square' : ''}`}>
          <img
            src={image}
            alt="Uploaded"
            className={`w-full ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} object-cover`}
            style={{ aspectRatio }}
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            disabled={loading}
          >
            <FiX size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          {loading ? (
            <span className="text-gray-500">Uploading...</span>
          ) : (
            <>
              <FiUpload className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-sm text-gray-500">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">JPG, PNG, or WebP (max 8MB)</p>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleUpload}
            disabled={loading}
            required
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;