// A profile page to show user details
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import leftArrowIcon from './icons/leftArrow.svg';
import emptyStarIcon from './icons/emptyStar.svg';
import fullStarIcon from './icons/fullStar.svg';
import { UserDetails } from './models';
import UserDetailsCard from './components/UserDetailsCard'; // Import UserDetailsCard component

function UserProfile() {
    const navigate = useNavigate();
    const { username } = useParams<{ username: string }>(); // Get username from URL params

    // State for user details, error, and favorites
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [error, setError] = useState('');
    const [favorites, setFavorites] = useState<UserDetails[]>(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        // Function to fetch user details based on his username
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${username}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: UserDetails = await response.json();
                console.log(data);
                setUserDetails(data);
            } catch (error) {
                console.error('Fetching user details failed:', error);
                setError('Failed to fetch user details.');
            }
        };

        fetchUserDetails();
    }, [username]);

    // Show empty page when the user details are still loading
    if (!userDetails) return null;

    if (error) return <div>Error: {error}</div>;

    // Function that navigates to the previous page
    const handleBackClick = () => {
        navigate(-1);
    };

    // Check if the user is a favorite
    const isFavorite = favorites.some(favUser => favUser.id === userDetails.id);

    // Function that toggles favorite status
    const toggleFavorite = (user: UserDetails) => {
        setFavorites(prevFavorites => {
            let updatedFavorites;

            if (prevFavorites.some(favUser => favUser.id === user.id)) {
                updatedFavorites = prevFavorites.filter(favUser => favUser.id !== user.id);
            } else {
                updatedFavorites = [...prevFavorites, user];
            }

            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

            return updatedFavorites;
        });
    };

    return (
        <header className="bg-[#ededed] w-full min-h-screen flex flex-col items-center">
            <div className="w-full bg-white flex flex-col items-center justify-center h-14">
                <div className="flex flex-row items-center justify-between w-full px-2 sm:w-2/3 md:w-1/2 lg:w-1/3">
                    <div className="flex flex-row items-center w-full sm:w-3/4">
                        <img
                            src={leftArrowIcon}
                            alt="Search"
                            className="h-4 w-4 cursor-pointer mr-3"
                            onClick={handleBackClick} // Handle click to go back
                        />
                        <span>@{userDetails?.login}</span>
                    </div>
                    <img
                        src={isFavorite ? fullStarIcon : emptyStarIcon}
                        alt={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        className="h-4 w-4"
                        onClick={() => toggleFavorite(userDetails)} // Toggle favorite status
                    />
                </div>
            </div>
            <UserDetailsCard
                userDetails={userDetails}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
            />
        </header>
    );
}

export default UserProfile;