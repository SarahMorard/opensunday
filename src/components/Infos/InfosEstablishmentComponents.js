import React, {useContext, useEffect, useState} from "react";
import "./InfoEstablishmentStyle.css";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useParams, useHistory} from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import Request from "../../utils/request";
import endpoints from "../../endpoints.json";
import {UserContext} from "../../Context/UserContext";
import {useAuth0} from "@auth0/auth0-react";


//render the div with the infos of one selected establishment
function InfosEstablishment(props) {


    //All the Auth0 methods needed
    const {getAccessTokenSilently, loginWithRedirect} = useAuth0();
    /* Constext for the user */
    let context = useContext(UserContext);

    /* State of the stares for the establishment evaluation */
    let [stares, setStares] = useState(null);

    /* State for the current establishment according to the id of the url*/
    const [poi, setPoi] = useState(null);

    const modifInitial = {
        name: null,
        website: null,
        deleted: false,
        description: null,
        address: null
    }

    /* State for set all the modifications in one */
    const [modification, setModification] = useState(modifInitial);

    /* State for the text that can be copied with the copy button (sharing link of website) */
    const [copied, isCopied] = useState(false);

    /* State of the user for the rating of establishment */
    const [userVoted, setUserVoted] = useState(false);

    /* Get the parameter given at the end of the path */
    const {eid} = useParams();

    /* useHistory const */
    const history = useHistory();


    /** USEEFFECTS **/
    /* Modify the state of the infos for the establishment according it's id
     * The backend method will return one establishment based on the id
     */
    useEffect(() => {
        let rightPoi = props.ePoi.find(poi => poi.establishmentId === +eid);
        setPoi(rightPoi);

    }, [eid])


    /* Method POST to rate one establishment (send idUser, idEstablishment, the rating) */

    useEffect(() => {
        async function fetchUserVoted() {
            try {
                let verifUserVoted = await Request(
                    `${process.env.REACT_APP_SERVER_URL}${endpoints.userVoted}` + "/" + context.user.githubId + "/" + eid,
                    getAccessTokenSilently,
                    loginWithRedirect
                );
                setUserVoted(verifUserVoted);
            } catch (err) {
                console.error('problem verifiyng user vote', err);
            }
        }

        fetchUserVoted();
    }, [poi])


    //Fetch all the right modification according to the id of the establishment
    useEffect(() => {
        async function fetchModif() {
            let modifications = await Request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.modifications}` + "/" + eid,
                getAccessTokenSilently,
                loginWithRedirect
            );
            await console.log("MOD: " + modifications)


            let finalModif = {};
            for (let modification of modifications) {
                if (modification.name !== null) {
                    finalModif.name = modification.name;
                }
                if (modification.description !== null) {
                    finalModif.description = modification.description
                }
                if (modification.address !== null) {
                    finalModif.address = modification.address
                }

                if (modification.website !== null) {
                    finalModif.website = modification.website
                }

                if (modification.deleted !== null) {
                    finalModif.deleted = modification.deleted
                }
            }

            setModification(finalModif);


        }
        fetchModif();
    },[eid]);


/* Method POST to rate one establishment (send idUser, idEstablishment, the rating) */
const rateEstablishment = async () => {

    // If the user has note voted we had a vote
    console.log("USERVOTED : " + userVoted)

    if (userVoted == false) {
        const data =
            {
                establishment: poi,
                user: context.user,
                grade: stares
            };

        await Request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.rating}`,
            getAccessTokenSilently,
            loginWithRedirect,
            "POST",
            data
        )
    } else {
        alert("You have already voted for this establishment!")
    }
}

/** MODIFICATION METHODS **/
    //Method POST to confirm the modifications of one establishment
const comfirmModif = async () => {
        //call the db with id establsihment and to insert the modification in the establishment table
        const data = {
            modifId: poi.establishmentId,
            validated: 1
        };

        await Request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.modifications}`,
            getAccessTokenSilently,
            loginWithRedirect,
            "PUT",
            data
        );
    }

//Method to discard the modifications of one establishment
const discardModif = async () => {
    const data = {
        //Delete the modifications in the table Modification according to the id of the establishment
        modifId: poi.establishmentId,
        validated: -1
    };

    await Request(
        `${process.env.REACT_APP_SERVER_URL}${endpoints.modifications}`,
        getAccessTokenSilently,
        loginWithRedirect,
        "PUT",
        data
    );
}


/** HANDLING METHODS **/
/* Rate the establishment and call the method to update the rating of the establishment */
const handleRatingChange = (newRating) => {
    setStares(newRating);
}


/* Method to set the state of the copied value to copy the link of the website */
const handleCopy = () => {
    isCopied(true);
}

const modifyEstablishment = () => {
    props.setModif(poi);
    history.push("/modify");
}

const deleteEstablishment = () => {
    //Delete establishment
}


return (
    <div className="infoEstablishment" style={{width: props.display ? '20%' : '0%'}}>
        <a href="javascript:void(0)" className="infosClosebtn" onClick={() => history.push("/location")}>&times;</a>
        {poi != null &&
        <div className="infosContainer">

            {modification.name != null ?
                <h3 style={{color: "red"}}>{modification.name}</h3>
                :
                <h3>{poi.name}</h3>
            }

            {modification.description != null ?
                <h3 style={{color: "red"}}>{modification.description}</h3>
                :
                <h3>{poi.description}</h3>

            }


            {modification.address != null ?
                <h3 style={{color: "red"}}>{modification.address}</h3>
                :
                <h3>{poi.address}</h3>

            }

            <div className="stars">
                <ReactStars
                    count={5}
                    onChange={handleRatingChange}
                    size={25}
                    isHalf={false}
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    activeColor="#ffd700"
                />
            </div>

            <h3>Web Site:</h3>
            {modification.website != null ?
                <a href={"https://www.technopole.ch/"} target="_blank" style={{color: "red"}}>{modification.webSite}</a>
                :
                <a href={"https://www.technopole.ch/"} target="_blank">{poi.webSite}</a>
            }

            {modification.deleted != false ?
                <p style={{color: "red"}}>The establishment does not exist anymore</p>
                :
                null
            }

            <br/>
            <div className="btnInfoContainer">
                <CopyToClipboard
                    text={window.location.href}
                    onCopy={handleCopy}
                >
                    <button>Copy Link</button>
                </CopyToClipboard>


                <button onClick={rateEstablishment}>Send rating</button>
                <button onClick={discardModif}>Discard Changes</button>
                <button onClick={comfirmModif}>Confirm Changes</button>
                <button onClick={modifyEstablishment}>Modify</button>
                <button onClick={deleteEstablishment}>Delete</button>

            </div>
        </div>
        }

    </div>
);

}


export default InfosEstablishment;
