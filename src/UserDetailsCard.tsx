// A card component that displays well-styled details about the user
import React from 'react';
import fullStarIcon from './fullStar.svg';
import emptyStarIcon from './emptyStar.svg';
import { UserDetails } from './models';

// Props that are received by the parent
interface UserDetailsCardProps {
    userDetails: UserDetails;
    isFavorite: boolean;
    toggleFavorite: (user: UserDetails) => void;
}

const UserDetailsCard: React.FC<UserDetailsCardProps> = ({ userDetails, isFavorite, toggleFavorite }) => {
    return (
        <div className="bg-white rounded-lg shadow mt-2 flex flex-col w-full p-2 sm:w-2/3 md:w-1/2 lg:w-1/3">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-x-4">
                    <img src={userDetails.avatar_url} className="w-40 h-40 rounded-lg" alt="" />
                    <div className="flex flex-col gap-y-3">
                        <div className="flex flex-col gap-y-1">
                            <span className="text-2xl font-bold">{userDetails.name}</span>
                            <span className="text-sm text-blue-400">@{userDetails.login}</span>
                            <span className="text-base text-gray-400">{userDetails.bio}</span>
                        </div>

                        <div className="flex flex-row gap-x-2">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl text-black">{userDetails.followers}</span>
                                <span className="text-[10px] text-gray-400">FOLLOWERS</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-3xl text-black">{userDetails.following}</span>
                                <span className="text-[10px] text-gray-400">FOLLOWING</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-3xl text-black">{userDetails.public_repos}</span>
                                <span className="text-[10px] text-gray-400">REPOS</span>
                            </div>
                        </div>
                    </div>
                </div>
                <img
                    src={isFavorite ? fullStarIcon : emptyStarIcon}
                    alt={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => toggleFavorite(userDetails)}
                />
            </div>
        </div>
    );
};

export default UserDetailsCard;