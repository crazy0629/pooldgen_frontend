const Header = ({ points }: { points: number }) => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand p-0" href="#">
            <img src="images/pool.png" alt="logo" />
          </a>
          <div className="collapse navbar-collapse" id="navbar-right">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#aboutUs">
                  About
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#roadmap">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="primary-btn buy-btn">
              <span>{String(points)} POOL</span>
            </div>

            <button
              className="navbar-toggler p-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbar-right"
              aria-controls="navbar-right"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="toggle-menu-icon">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
