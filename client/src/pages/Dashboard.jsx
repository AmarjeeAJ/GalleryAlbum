import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [albums, setAlbums] = useState([]);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const res = await api.get('/albums');
                setAlbums(res.data);
            } catch (err) {
                console.error('Failed to fetch albums', err);
            }
        };
        if (user) fetchAlbums();
    }, [user]);

    const handleCreateAlbum = async () => {
        // For prototype, just create a default one
        try {
            const newAlbum = {
                title: 'New Album ' + new Date().toISOString(),
                type: 'manual',
                parameters: { size: '10x10' },
                clientId: user.id
            };
            await api.post('/albums', newAlbum);
            // Refresh list
            const res = await api.get('/albums');
            setAlbums(res.data);
        } catch (err) {
            alert('Failed to create album');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="space-x-4">
                    <span className="font-semibold">Hello, {user?.username}</span>
                    <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create New Card */}
                <div
                    onClick={handleCreateAlbum}
                    className="bg-white p-6 rounded shadow cursor-pointer hover:bg-gray-50 flex items-center justify-center h-48 border-2 border-dashed border-gray-300"
                >
                    <span className="text-xl text-gray-500">+ Create New Album</span>
                </div>

                {/* Album Cards */}
                {albums.map(album => (
                    <div key={album._id} className="bg-white p-6 rounded shadow h-48 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold">{album.title}</h3>
                            <p className="text-sm text-gray-500 capitalize">{album.type} Design</p>
                            <p className="text-xs text-gray-400 mt-2">Status: {album.status}</p>
                        </div>
                        <button
                            onClick={() => navigate(`/editor/${album._id}`)}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold self-start"
                        >
                            Open Editor &rarr;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
