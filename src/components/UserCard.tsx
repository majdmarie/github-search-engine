// User card component that can be called to display users avatar and name, usually this component is used as a part of a list.
import React from 'react';
import fullStarIcon from '../icons/fullStar.svg';
import emptyStarIcon from '../icons/emptyStar.svg';
import { Link } from 'react-router-dom';
import { UserDetails } from '../models';

// Define the props for the UserCard component
interface UserCardProps {
    user: UserDetails;
    isFavorite: boolean;
    toggleFavorite: () => void;
}

// UserCard component receives props and renders user information
const UserCard: React.FC<UserCardProps> = ({ user, isFavorite, toggleFavorite }) => {
    return (
        <div key={user.id} className={"user flex flex-row justify-between items-center w-full p-2 border-b border-gray-300"}>
            <div className="user-info flex flex-row items-center">
                <img src={user.avatar_url} alt={user.login} className="h-10 w-10 rounded-full mr-2" />
                <Link to={`/user/${user.login}`}>@{user.login}</Link>
            </div>
            <img
                src={isFavorite ? fullStarIcon : emptyStarIcon}
                alt={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                onClick={toggleFavorite} // Clicking the icon triggers the toggleFavorite function
                className="h-4 w-4 cursor-pointer"
            />
        </div>
    );
};

export default UserCard;