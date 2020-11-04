import React from "react";
import "./footerStyle.css";
import HES from "../../assets/HES.png"

//The class for display the footer of the page
class FooterComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    //the footer with the logo of the HES
    render() {
        return (
          <div>
              <footer>
                  <img src={HES} alt="hes-so FIG" className="pics"/>
              </footer>
          </div>
        );
    }
}

export default FooterComponent;