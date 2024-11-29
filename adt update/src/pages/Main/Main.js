import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/'); 
  };

  // Check authentication
  useEffect(() => {
    if (!accessToken) {
      navigate('/'); 
    }
  }, [accessToken, navigate]);

  return (
    <div className="Main">
      <div className="container">
        {/* Sidebar Navigation */}
        <div className="navigation">
          <ul>
            <li>
              <Link to="/main/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/main/movies">Movies</Link>
            </li>
            <li className="logout">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
