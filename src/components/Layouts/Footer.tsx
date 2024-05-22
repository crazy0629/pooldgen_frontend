
const Footer = () => {
  return (
    <footer>
        <div className="footer-top">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="mb-4">
                           
                           
                        </div>
                        <ul className="footer-link mb-3 mb-md-5">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">About</a>
                            </li>
                           
                            <li className="nav-item">
                                <a className="nav-link" href="#">Roadmap</a>
                            </li>
                            
                           
                        </ul>
                        <div className="social-media">
                            <a href="#">
                                <img src="images/tweeter.png" alt="social-icon" />
                            </a>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <div className="container">
                <p>© 2024 All Rights Reserved - Pool Games</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer
