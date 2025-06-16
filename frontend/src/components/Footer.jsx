import '../styles/navbar.css'; // Consider renaming to 'Footer.css' if it's only for footer styles

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section logo">
        <img src="../img/Medipal.jpg" alt="Medipal Logo" />
      </div>

      <div className="footer-section footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="/how">How It Works</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/sign">Sign Up</a></li>
        </ul>
      </div>

      <div className="footer-section services">
        <h3>Services</h3>
        <ul>
          <li>Smart Savings Circles</li>
          <li>Health Risk Quiz</li>
          <li>AI Health Nudges</li>
          <li>Nearby Clinics & Pharmacies</li>
          <li>Expense Tracking Wallets</li>
        </ul>
      </div>

      <div className="footer-section privacy">
        <h3>Legacy & Policy</h3>
        <ul>
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
          <li>Cookie Policy</li>
        </ul>
      </div>

      <div className="end">
        <p>&copy; 2025 Hacktivity. All rights reserved.</p>
      </div>
    </footer>
  );
}
