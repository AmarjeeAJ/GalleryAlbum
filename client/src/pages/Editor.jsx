import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import HTMLFlipBook from 'react-pageflip';

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const res = await api.get(`/albums/${id}`);
                setAlbum(res.data);
                if (res.data.images && Array.isArray(res.data.images)) {
                    setPhotos(res.data.images);
                }
                setLoading(false);
            } catch (err) {
                alert('Error loading album');
                navigate('/dashboard');
            }
        };
        fetchAlbum();
    }, [id, navigate]);

    const handleUploadClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach(file => {
            formData.append('photos', file);
        });

        try {
            setUploading(true);
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newPhotos = res.data.urls.map(url => `http://localhost:5000${url}`);
            setPhotos(prev => [...prev, ...newPhotos]);
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleAutoDesign = async () => {
        if (photos.length === 0) {
            alert('Please upload photos first');
            return;
        }
        try {
            const res = await api.post(`/albums/${id}/autofill`, { images: photos });
            setAlbum(res.data);
            alert('Album layout generated!');
        } catch (err) {
            console.error(err);
            alert('Failed to generate layout');
        }
    };

    const handleSave = async () => {
        try {
            await api.put(`/albums/${id}`, { images: photos });
            alert('Album saved successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to save album');
        }
    };



    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this album?')) return;
        try {
            await api.delete(`/albums/${id}`);
            alert('Album deleted successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to delete album');
        }
    };

    if (loading) return <div>Loading Editor...</div>;

    // Helper to render pages for FlipBook
    const renderPage = (page, index) => {
        return (
            <div key={index} className="demoPage bg-white shadow-lg border-r border-gray-200 h-full relative overflow-hidden">



                <div className="w-full h-full">
                    {page.images && page.images.map((img, i) => (
                        <div key={i} className="w-full h-full">
                            <img
                                src={img.url}
                                alt=""
                                className="w-full h-full object-cover max-w-none"
                                style={img.styles || {}}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Images */}
            <div className="w-72 bg-gray-100 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <h2 className="font-bold text-gray-700">Photos</h2>
                    <input
                        type="file"
                        id="fileInput"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className="mt-2 w-full bg-indigo-600 text-white text-sm py-1 rounded disabled:bg-indigo-300"
                    >
                        {uploading ? 'Uploading...' : 'Upload Photos'}
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 gap-2">
                    {photos.map((src, i) => (
                        <div key={i} className="aspect-square bg-gray-300 rounded cursor-move hover:ring-2 ring-indigo-500 overflow-hidden">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    {photos.length === 0 && <div className="col-span-2 text-xs text-gray-400 text-center mt-4">No photos uploaded</div>}
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 bg-gray-200 flex flex-col relative">
                {/* Toolbar */}
                <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                    <span className="font-bold px-4">{album.title}</span>
                    <div className="space-x-2">
                        <button onClick={handleAutoDesign} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Auto Design</button>
                        <button onClick={handleSave} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Save</button>

                        <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                    </div>
                </div>

                {/* Canvas Scroll Area */}
                <div className="flex-1 overflow-hidden p-10 flex flex-col items-center justify-center bg-gray-300">
                    {album.pages && album.pages.length > 0 ? (
                        <HTMLFlipBook
                            width={400}
                            height={550}
                            size="stretch"
                            minWidth={300}
                            maxWidth={1000}
                            minHeight={400}
                            maxHeight={1533}
                            maxShadowOpacity={0.5}
                            showCover={true}
                            mobileScrollSupport={true}
                            className="shadow-2xl"
                            onFlip={(e) => setPageIndex(e.data)}
                        >
                            {album.pages.map((page, index) => renderPage(page, index))}
                        </HTMLFlipBook>
                    ) : (
                        <div className="bg-white shadow-2xl w-[800px] h-[550px] relative flex items-center justify-center">
                            <div className="text-gray-300 text-2xl font-bold uppercase tracking-widest">
                                No Pages Generated
                            </div>
                            <div className="absolute bottom-10 text-gray-400">
                                Upload photos and click "Auto Design"
                            </div>
                        </div>
                    )}

                    {/* Page Number Footer */}
                    {album.pages && album.pages.length > 0 && (
                        <div className="absolute bottom-1 text-gray-600 font-bold z-50">
                            {pageIndex === 0 ? 'Cover' : pageIndex === album.pages.length - 1 ? 'Back' : Math.ceil(pageIndex / 2)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Editor;
