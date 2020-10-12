//============================Class Info establishement + options=======================================================
import React, {useContext} from "react";
import "./InfoEstablishmentStyle.css";
import BeautyStars from 'beauty-stars';

class InfosEstablishment extends React.Component {
    constructor() {
        super();

        //Ref for the infoEstablishment div
        this.infosRef = React.createRef();
    }


    //State of the stars (in hook for better code?)
    starState = { value: 0 };


    //Function to add the establishment to the favorit list
    addToFavorits = () => {

    }


    //Close the information card about the establishment
    //Set the width of the bar to 0 to close it
    closeInfos = () => {
        return this.infosRef.current.style.width = 0;
    }

    openInfos = () => {
        return this.infosRef.current.style.width = '20%';
    }


    render() {
        return(
            <div class="infoEstablishment" ref={this.infosRef}>

                <a href="javascript:void(0)" class="infosClosebtn" onClick={this.closeInfos}>&times;</a>
                <img class="image" src="https://www.technopole.ch/data/images/galeries/ciel/IMG_1341.JPG"/>
                <div class="infosContainer">
                    <h4><b>Technopole</b></h4>
                    <p>Rue de Technopôle 1, 3960 Sierre</p>
                    <h3>Open on: </h3>
                    <h4>...</h4>
                    <button class="btnFav">Add to favorits</button>

                    <div className="stars">
                        <BeautyStars
                            value={this.starState.value}
                            onChange={value => this.setState({value})}
                            inactiveColor="white"
                        />
                </div>

                </div>
            </div>

        );
    }
}

export default InfosEstablishment;
