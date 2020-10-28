import React, {useContext, useEffect, useState} from "react";
import "./InfoEstablishmentStyle.css";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useParams, useHistory} from 'react-router-dom';
import ReactStars from "react-rating-stars-component";

//render the div with the infos of one selected establishment
function InfosEstablishment(props) {

    /* State of the stares for the establishment evaluation */
    let [stares, setStares] = useState(0);

    /* State for the current establishment according to the id of the url*/
    const [poi, setPoi] = useState(null);


    /* State for the text that can be copied with the copy button (sharing link of website) */
    const [copied, isCopied] = useState(false);


    /* Get the parameter given at the end of the path */
    const {eid} = useParams();
    const history = useHistory();

    /* Modify the state of the infos for the establishment according it's id
   *  The backend method will return one establishment based on the id
   * */
    useEffect(() => {
        let rightPoi = props.poi.find(poi => poi.id === +eid);
        setPoi(rightPoi);
    }, [eid])


    const handleCopy = () => {
        isCopied(true);
    }

    return (

            <div className="infoEstablishment" style={{width: props.display ? '20%' : '0%'}}>
                <a href="javascript:void(0)" className="infosClosebtn" onClick={() => history.push("/location")}>&times;</a>
                <img className="image" src="https://www.technopole.ch/data/images/galeries/ciel/IMG_1341.JPG"/>

                {poi != null &&
                    <div className="infosContainer">

                        <h3>{poi.name}</h3>
                        <p>{poi.description}</p>
                        <p>{poi.address}</p>
                        <h3>Open on Sunday: </h3>
                        <h4>{poi.isOpenSunday.toString()}</h4>
                        <h3>Open on holiday: </h3>
                        <h4>{poi.isOpenPH.toString()}</h4>

                        <button className="btnFav">Add to favorits</button>

                        <div className="stars">
                            <ReactStars
                                count={5}
                                onChange={() => setStares(5)}
                                size={24}
                                isHalf={true}
                                emptyIcon={<i className="far fa-star"></i>}
                                halfIcon={<i className="fa fa-star-half-alt"></i>}
                                fullIcon={<i className="fa fa-star"></i>}
                                activeColor="#ffd700"
                            />
                        </div>
                        <h3>Web Site:</h3>
                        <a href={"https://www.technopole.ch/"}>{poi.webSite}</a><br/>
                        <CopyToClipboard text={poi.webSite}
                                         onCopy={handleCopy}>
                            <button className="btnCopy">Copy Link</button>
                        </CopyToClipboard>
                    </div>
                }
            </div>
            );

            }

            export default InfosEstablishment;
