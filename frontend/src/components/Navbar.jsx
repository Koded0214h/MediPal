import { Link } from 'react-router-dom';
import '../styles/navbar.css'

export default function Navbar({ isAuthenticated }) {
    return(
        <div>
            <nav>
                <div className='logo'>
                    <img 
                        src="../img/Medipal.jpg" 
                        alt="Medipal Logo"
                    />
                </div>
                <div className="nav-links">
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        {isAuthenticated && (
                            <>
                                <li><Link to='/dashboard'>Dashboard</Link></li>
                                <li><Link to='/health-profile-form'>Health Profile</Link></li>
                                <li><Link to='/wallet'>Wallet</Link></li>
                                <li><Link to='/contact'>Contact</Link></li>
                                {/* Add other authenticated links as needed */}
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    )
}