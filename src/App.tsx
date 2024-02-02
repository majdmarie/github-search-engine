import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserProfile from "./UserProfile";
import FavoriteUsers from "./FavoriteUsers";
import searchIcon from "./icons/search.svg";
import favoritesListIcon from "./icons/favoritesList.svg";
import { UserDetails } from "./models";
import "./App.css";
import UserCard from "./components/UserCard";

interface GitHubApiResponse {
  items: UserDetails[];
}

function App() {
  // State for the search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for search results
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const resultsPerPage = 40;

  // Function to fetch user details from GitHub API
  async function fetchUserDetailss(query: string, page: number): Promise<GitHubApiResponse | null> {
    // If you reached the maximum API calles (which can be checked through the browser console), please add your api token.
    const response = await fetch(
      `https://api.github.com/search/users?q=${query}&page=${page}&per_page=${resultsPerPage}`
    );

    if (response.status === 403) {
      console.log("Rate limit exceeded");
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GitHubApiResponse = await response.json();
    return data;
  }

  // Function to load more users
  const loadMoreUsers = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetchUserDetailss(searchQuery, currentPage);
      if (response && response.items.length > 0) {
        setUsers((prevUsers) => [...prevUsers, ...response.items]);
        setError("");
      } else {
        setError("No more users to load or rate limit hit");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users.");
    }
    setLoading(false);
  };

  // State for user favorites
  const [favorites, setFavorites] = useState<UserDetails[]>(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Function to toggle favorite status
  const toggleFavorite = (user: UserDetails) => {
    setFavorites((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.some((favUser) => favUser.id === user.id)) {
        updatedFavorites = prevFavorites.filter(
          (favUser) => favUser.id !== user.id
        );
      } else {
        updatedFavorites = [...prevFavorites, user];
      }
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  // Effect to initiate search and debounce it
  useEffect(() => {
    const initiateSearch = async () => {
      setUsers([]);
      setCurrentPage(1);
      setError("");

      if (searchQuery.length >= 3) {
        loadMoreUsers();
      }
    };

    // Do debouncing so the number of api calls is reduced as minimum as possible. Only do an Api request when the user stops typing
    const debounceSearch = setTimeout(() => {
      initiateSearch();
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  useEffect(() => {
    loadMoreUsers();
  }, [currentPage]);

  // Effect to handle scrolling and load more users
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - 100 ||
        loading
      ) {
        return;
      }
      setCurrentPage((currentPage) => currentPage + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <Router>
      <Routes>
        <Route path="/user/:username" element={<UserProfile />} />
        <Route
          path="/favorites"
          element={<FavoriteUsers toggleFavorite={toggleFavorite} />}
        />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route
          path="/"
          element={
            <header className="bg-[#ededed] w-full min-h-screen flex flex-col items-center">
              <div className="w-full bg-white flex flex-col items-center justify-center h-14">
                <div className="flex flex-row items-center justify-between w-full px-2 sm:w-2/3 md:w-1/2 lg:w-1/3">
                  <div className="flex flex-row items-center w-full sm:w-3/4">
                    <img
                      src={searchIcon}
                      alt="Search"
                      className="h-4 w-4 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for GitHub users..."
                      className="border-none text-gray-700 py-1 px-2 focus:outline-none w-full"
                    />
                  </div>

                  <Link to="./favorites">
                    <img
                      src={favoritesListIcon}
                      alt="Favorites List"
                      className="h-5 w-5"
                    />
                  </Link>
                </div>
              </div>
              {users?.length === 0 ? (
                <p className="pt-4">No search results ...</p>
              ) : (
                <div className="search-results bg-white rounded-lg shadow mt-2 flex flex-col items-center justify-between w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                  {users.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      isFavorite={favorites.some(
                        (favUser) => favUser.id === user.id
                      )}
                      toggleFavorite={() => toggleFavorite(user)}
                    />
                  ))}
                </div>
              )}
            </header>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;