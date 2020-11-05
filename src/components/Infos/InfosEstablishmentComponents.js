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

    /* Initial state of modification for one establishment */
    const modifInitial = {
        id: null,
        name: null,
        website: null,
        deleted: false,
        description: null,
        address: null
    }

    /* State for set all the modifications in one */
    const [modification, setModification] = useState(modifInitial);

    /* State for get all the id of the modifications */
    const [idModif, setIdModif] = useState([]);

    /* State for the text that can be copied with the copy button (sharing link of website) */
    const [copied, isCopied] = useState(false);

    /* State of the user for the rating of establishment */
    const [userVoted, setUserVoted] = useState(false);

    const [evaluation, setEvaluation] = useState(0);

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
            let finalID = [];
            let finalModif = {};
            for (let modification of modifications) {
                if (modification.name !== null) {
                    finalModif.name = modification.name;
                }

                if (modification.description !== null) {
                    finalModif.description = modification.description;
                }

                if (modification.address !== null) {
                    finalModif.address = modification.address;
                }

                if (modification.website !== null) {
                    finalModif.website = modification.website;
                }

                if (modification.deleted !== null) {
                    finalModif.deleted = modification.deleted;
                }

                finalID.push(modification.id);

            }

            setIdModif(finalID);
            setModification(finalModif);


        }

        fetchModif();
    }, [eid]);


    /* Method to get the rating of one establishment */
    useEffect(() => {
        async function fetchEstablishmentEvaluation() {
            let getEvaluation = await Request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.grade}` + "/" + eid,
                getAccessTokenSilently,
                loginWithRedirect
            );
            setEvaluation(getEvaluation);
        }
        fetchEstablishmentEvaluation();
    }, [eid])


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
    //Method PUT to confirm all the modifications for one establishment
    const comfirmModifs = () => {
        idModif.map((modifId, index) => {
            confirmModif(modifId);
        })

    }

    //Method PUT
    const confirmModif = async (props) => {
        await Request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.modifications}` + "/" + props + "/1",
            getAccessTokenSilently,
            loginWithRedirect,
            "PUT"
        );
    }

    //Method to discard all the modifications for one establishment
    const discardModifs = () => {
        idModif.map((modifId, index) => {
            discardModif(modifId);
        })
    }

    //Method PUT
    const discardModif = async (props) => {
        await Request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.modifications}` + "/" + props + "/-1",
            getAccessTokenSilently,
            loginWithRedirect,
            "PUT"
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

    const deleteEstablishment = async () => {
        //Delete establishment
        //creation of the data
        const dataToInsert = {
            name: null,
            description: null,
            address: null,
            webSite: null,
            lat: poi.lat,
            lng: poi.lng,
            deleted: true,
            establishment: {
                establishmentId: poi.establishmentId
            },
            city: {
                postalCode: poi.city.postalCode,
                name: poi.city.name
            },
            type: {
                id: poi.type.id
            },
            user: {
                GithubId: context.user.githubId
            },
            //date format don't match from frontend to backend (frontend is strings and backend are VisualStudio dates objects)
            modificationDates: []
        }

        await Request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.modifications}`,
            getAccessTokenSilently,
            loginWithRedirect,
            "POST",
            dataToInsert
        );
        console.log(poi);
    }

    /* Method to get the sponsorization of one establishment */


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

                <p>Type :</p>
                    <h3>{poi.type.typeOfEstablishment}</h3>

                <p>Description :</p>
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

                <p>Evaluation: </p>

                {evaluation == "NaN" ?
                    <p>No rating for now</p>
                    :
                    <p>{evaluation}</p>

                }


                <h3>Web Site:</h3>
                {modification.website != null ?
                    <a href={"https://www.technopole.ch/"} target="_blank"
                       style={{color: "red"}}>{modification.webSite}</a>
                    :
                    <a href={"https://www.technopole.ch/"} target="_blank">{poi.webSite}</a>
                }

                {modification.deleted != true ?
                    null
                    :
                    <p style={{color: "red"}}>The establishment does not exist anymore</p>
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

                <br/>
                <div className="btnInfoContainer">
                    <CopyToClipboard
                        text={window.location.href}
                        onCopy={handleCopy}
                    >
                        <button>Copy Link</button>
                    </CopyToClipboard>


                    <button onClick={rateEstablishment}>Send rating</button>

                    {idModif.length == 0 ? null :
                        <>
                        <button onClick={discardModifs}>Discard Changes</button>

                        <button onClick={comfirmModifs}>Confirm Changes</button>
                        </>
                    }


                    <button onClick={modifyEstablishment}>Modify</button>
                    <button onClick={deleteEstablishment}>Delete</button>

                </div>
            </div>
            }

        </div>
    );

}


export default InfosEstablishment;
