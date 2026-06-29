import { NotFoundContainer } from "./styledComponents"
import { Link } from "react-router-dom"
import { FaCompass, FaHome } from "react-icons/fa"

const NotFound = () => (
    <NotFoundContainer>
        <div className="nf-card animate-up">
            <div className="nf-icon"><FaCompass /></div>
            <h1>404</h1>
            <h2>Page not found</h2>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="btn btn-gradient">
                <FaHome style={{ marginRight: 8 }} /> Back to Home
            </Link>
        </div>
    </NotFoundContainer>
)

export default NotFound
