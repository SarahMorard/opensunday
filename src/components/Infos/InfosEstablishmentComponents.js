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

    /* State of the stares for the establishment evaluation */
    let [stares, setStares] = useState(0);

    /* Constext for the user */
    let context = useContext(UserContext);


    /* State for the current establishment according to the id of the url*/
    const [poi, setPoi] = useState(null);


    /* State for the text that can be copied with the copy button (sharing link of website) */
    const [copied, isCopied] = useState(false);


    /* Get the parameter given at the end of the path */
    const {eid} = useParams();

    /* useHistory const */
    const history = useHistory();

    const [ModificationsPois, setModificationsPois] = useState(null);



    /* Modify the state of the infos for the establishment according it's id
     *  The backend method will return one establishment based on the id
     * */
    useEffect(() => {
        let rightPoi = props.ePoi.find(poi => poi.id === +eid);
        setPoi(rightPoi);
    }, [eid])


    /*
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

        fetchModif();
    }, eid);

    */

    const M1 = {
        idEstablishment: 2,
        name: null,
        description: "ok",
        address: "ok"
    }
    const M2 = {
        idEstablishment: 3,
        name: "ok",
        description: null,
        address: "ok"
    }
    const M3 = {
        idEstablishment: 4,
        name: "ok",
        description: null,
        address: null
    }

    /* Modiy the state of the modification to get the modification that was
   *  done on the establishment that we clicked
   * */
    useEffect(() => {
        setModificationsPois(M1)
    }, [eid])


    /* Method to set the state of the copied value to copy the link of the website */
    const handleCopy = () => {
        isCopied(true);
    }


    /* Method POST to rate one establishment (send idUser, idEstablishment, the rating) */
    const rateEstablishment = async() => {
        const data = {
            githubID: context.user,
            establishmentID: poi.id,
            rating: stares
        };

        await Request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`,
            getAccessTokenSilently,
            loginWithRedirect,
            "POST",
            data
        );
    }

    //Method POST to confirm the modifications of one establishment
    const comfirmModif = async(values) => {
        //call the db with id establsihment and to insert the modification in the establishment table
        const data = {
            modifId: ModificationsPois.id,
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
            modifId: ModificationsPois.id,
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


    /* Rate the establishment and call the method to update the rating of the establishment */
    const handleRatingChange = (newRating) => {
        setStares(newRating);
        return (
            rateEstablishment
        )
    }


    return (

            <div className="infoEstablishment" style={{width: props.display ? '20%' : '0%'}}>
                <a href="javascript:void(0)" className="infosClosebtn" onClick={() => history.push("/location")}>&times;</a>
                <img className="image" src="https://www.technopole.ch/data/images/galeries/ciel/IMG_1341.JPG"/>
                {poi != null &&
                    <div className="infosContainer">
                        {ModificationsPois.name != null ?
                            <h3 style={{color: "red"}}>{poi.name}</h3> :
                            <h3>{poi.name}</h3>

                        }

                        {ModificationsPois.description != null ?
                            <h3 style={{color: "red"}}>{poi.description}</h3> :
                            <h3>{poi.description}</h3>

                        }

                        {ModificationsPois.address != null ?
                            <h3 style={{color: "red"}}>{poi.address}</h3> :
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
                        <a href={"https://www.technopole.ch/"} target="_blank">{poi.webSite}</a><br/>
                        <CopyToClipboard
                            text={window.location.href}
                            onCopy={handleCopy}
                        >
                            <button >Copy Link</button>
                        </CopyToClipboard>

                        <br/>
                        <button onClick={comfirmModif}>Confirm Changes</button>
                        <br/>
                        <button onClick={discardModif}>Discard Changes</button>

                    </div>
                }
            </div>
            );

            }

            export default InfosEstablishment;
