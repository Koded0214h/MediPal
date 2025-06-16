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
                        <li><a href='/about'>About</a></li>
                        <li><a href='/how'>How It Works</a></li>
                        <li><a href='/contact'>Contact</a></li>
                        <li><a href="login">Login</a></li>
                        <li><a href="/sign">Sign Up</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}