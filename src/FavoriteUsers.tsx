import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import leftArrowIcon from './leftArrow.svg';
import fullStarIcon from './fullStar.svg';
import { UserDetails } from './models';
import UserCard from './UserCard';

interface FavoritesUserProps {
    toggleFavorite: (user: UserDetails) => void;
}

function FavoriteUsers({ toggleFavorite: toggleFavoriteProp }: FavoritesUserProps) {
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState<UserDetails[]>(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    const toggleFavorite = (user: UserDetails) => {
        toggleFavoriteProp(user);

        setFavorites(prevFavorites => {
            return prevFavorites.some(favUser => favUser.id === user.id)
                ? prevFavorites.filter(favUser => favUser.id !== user.id)
                : [...prevFavorites, user];
        });
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <header className="bg-[#ededed] w-full min-h-screen flex flex-col items-center">
            <div className="w-full bg-white flex flex-col items-center justify-center h-14">
                <div className="flex flex-row items-center justify-between w-full px-2 sm:w-2/3 md:w-1/2 lg:w-1/3">
                    <div className="flex flex-row items-center w-full sm:w-3/4">
                        <img src={leftArrowIcon} alt="Search" className="h-4 w-4 cursor-pointer mr-3" onClick={handleBackClick} />
                        <span>Favorites</span>
                    </div>
                    <img src={fullStarIcon} alt="Favorites" className="h-4 w-4" />
                </div>
            </div>
            <div className="search-results bg-white rounded-lg shadow mt-2 flex flex-col items-center justify-between w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                {favorites.map((user, index) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        isFavorite={favorites.some(favUser => favUser.id === user.id)}
                        toggleFavorite={() => toggleFavorite(user)}
                    />
                ))}
            </div>
        </header>
    );
}

export default FavoriteUsers;