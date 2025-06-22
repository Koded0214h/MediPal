import '../styles/navbar.css'
export default function Navbar() {
    return(
        <div>
            <nav>
                <div className='logo'>
                    <img 
                        src="../img/Medipal.jpg" 
                        alt=""
                    />
                </div>
                <div className="nav-links">
                    <ul>
                        <li><a href='/profile'>Profile</a></li>
                        <li><a href='/settings'>Settings</a></li>
                        <li><a href='/contact'>Contact</a></li>
                        <li><a href="/register">Sign Up</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}