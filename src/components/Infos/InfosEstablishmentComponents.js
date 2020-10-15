import React, {useContext, useState} from "react";
import "./InfoEstablishmentStyle.css";
import BeautyStars from 'beauty-stars';

function InfosEstablishment () {

    let [display, setDisplay] = useState(true);

    let [stares, setStares] = useState(0);


    // Method toogle for the state
    const toggleChangeDisplay = () => {
        if (display) {
            setDisplay(display = false);
        }else {
            setDisplay(display = true);
        }
    }

    //Function to add the establishment to the favorit list
    const addToFavorits = () => {

    }



    return(
        <div className="infoEstablishment" style={{width: display ? '20%': '0%'}}>

            <a href="javascript:void(0)" class="infosClosebtn" onClick={toggleChangeDisplay}>&times;</a>
            <img class="image" src="https://www.technopole.ch/data/images/galeries/ciel/IMG_1341.JPG"/>
            <div class="infosContainer">
                <h4><b>Technopole</b></h4>
                <p>Rue de Technopôle 1, 3960 Sierre</p>
                <h3>Open on: </h3>
                <h4>...</h4>
                <button class="btnFav">Add to favorits</button>

                <div className="stars">
                    <BeautyStars
                        value={stares}
                        onChange={value => setStares(value)}
                        inactiveColor="white"
                        // Gérer les étoiles en responsive!!!
                    />
            </div>

            </div>
        </div>

    );

}

export default InfosEstablishment;
