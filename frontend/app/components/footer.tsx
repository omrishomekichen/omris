import "./css/footer.css"
export default function Footer(){
    return(
           <footer className="footer">

        <div className="footer-container">

          <div className="footer-brand">

            <a href="#" className="footer-logo">
              Omri's Home Kitchen
            </a>

            <p>
              © 2024 Omri's Home Kitchen. Artisanal Quality Pickles.
            </p>

          </div>

          <div className="footer-links">

            <a href="#">
              Privacy Policy
            </a>

            <a href="#">
              Shipping Info
            </a>

            <a href="#">
              Terms of Service
            </a>

            <a href="#">
              Contact Us
            </a>

          </div>

        </div>

      </footer>
    )
}