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

    /* State for the text that can be copied with the copy button (sharing link of website) */
    const [copied, isCopied] = useState(false);

    /* State for the modifiation that could have been done on one establishment */
    const [ModificationsPois, setModificationsPois] = useState(null);

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
    /*
    useEffect(() => {
        async function fetchUserVoted() {
            let verifUserVoted = await Request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.rating}` + "/" + context.user.githubId + "/" + eid,
                getAccessTokenSilently,
                loginWithRedirect
            );
            setUserVoted(verifUserVoted);
        }
        fetchUserVoted();
    },[poi])

     */


    //Fetch all the right modification according to the id of the establishment
    useEffect(() => {
        async function fetchModif() {
            let modif = await Request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.modifications}` + "/" + eid,
                getAccessTokenSilently,
                loginWithRedirect
            );
            setModificationsPois(modif);
        }
        console.log("MODIFICATIONS: " + ModificationsPois)
        fetchModif();
    }, eid);


    /* Method POST to rate one establishment (send idUser, idEstablishment, the rating) */
    const rateEstablishment = async() => {

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
    const comfirmModif = async() => {
        //call the db with id establsihment and to insert the modification in the establishment table
        const data = {
            modifId: ModificationsPois.establishmentId,
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
            modifId: ModificationsPois.establishmentId,
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
        props.modif(poi);
        history.push("/modify");
    }


    return (
        <div className="infoEstablishment" style={{width: props.display ? '20%' : '0%'}}>
            <a href="javascript:void(0)" className="infosClosebtn" onClick={() => history.push("/location")}>&times;</a>
            {poi != null &&
            <div className="infosContainer">
                {ModificationsPois.name != null ?
                    <h3 style={{color: "red"}}>{ModificationsPois.name}</h3>
                    :
                    <h3>{poi.name}</h3>
                }

                {ModificationsPois.description != null ?
                    <h3 style={{color:"red"}}>{ModificationsPois.description}</h3>
                    :
                    <h3>{poi.description}</h3>
                }

                {ModificationsPois.address != null ?
                    <h3 style={{color:"red"}}>{ModificationsPois.address}</h3>
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
                {ModificationsPois.website != null ?
                    <a href={"https://www.technopole.ch/"} target="_blank">{ModificationsPois.webSite}</a>
                    :
                    <a href={"https://www.technopole.ch/"} target="_blank" style={{color: "red"}}>{poi.webSite}</a>
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
                    </div>
                </div>
            }

        </div>
        );

    }



export default InfosEstablishment;
