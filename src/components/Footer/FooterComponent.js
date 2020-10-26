import React from "react";
import "./footerStyle.css";
import HES from "../../assets/HES.png"

class FooterComponent extends React.Component {
    constructor(props) {
        super(props);
    }

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