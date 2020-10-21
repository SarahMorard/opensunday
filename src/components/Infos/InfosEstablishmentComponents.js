import React, {useContext, useState} from "react";
import "./InfoEstablishmentStyle.css";
import BeautyStars from 'beauty-stars';

function InfosEstablishment (props) {

     let [stares, setStares] = useState(0);

    //Function to add the establishment to the favorit list
    const addToFavorits = () => {

    }

    return(
        <div className="infoEstablishment" style={{width: props.display ? '20%': '0%'}}>

            <a href="javascript:void(0)" class="infosClosebtn" onClick={props.toggleChangeDisplay}>&times;</a>
            <img className="image" src="https://www.technopole.ch/data/images/galeries/ciel/IMG_1341.JPG"/>
            <div className="infosContainer">
                <h3><b>Technopole</b></h3>
                <p>Rue de Technopôle 1, 3960 Sierre</p>
                <h3>Open on: </h3>
                <h4>...</h4>
                <button className="btnFav">Add to favorits</button>

                <div className="stars">
                    <BeautyStars
                        value={stares}
                        onChange={value => setStares(value)}
                        inactiveColor="white"
                        // Gérer les étoiles en responsive!!!
                    />
            </div>
                <h3>Web Site:</h3>
                <a href={"https://www.technopole.ch/"}>https://www.technopole.ch/</a><br/>
                <button className="btnModify">Modify</button>
            </div>
        </div>

    );

}

export default InfosEstablishment;
