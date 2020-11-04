import React, {useEffect, useState, useContext} from "react";
import "./Modifications.css";
import Request from "../../utils/request";
import endpoints from "../../endpoints.json";
import {useAuth0} from "@auth0/auth0-react";



//take all the modifications in the db and render it for the admin
function Modifications () {

    //a state with the list of modifications
    const [modifs, setModif] = useState(null);

    let {
        loginWithRedirect,
        getAccessTokenSilently,
    } = useAuth0();

    //at the load of the page, get the modifications from db
    useEffect(() => {

        async function fetchModificationsFromDb () {

            //call the db for have the modifications (return a list of objects )
            let listOfModifications = await Request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.modifications}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            //put the list in the state
            await setModif(listOfModifications);
        }
        fetchModificationsFromDb();
    }, []);

    //the effect of the ban button (ban a user)
    let banUser = async (props) => {

        const data = {
            id: props
        }

        //call the db for ban "props" (this will ban the user)
        await Request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.users}` + "/" + props,
            getAccessTokenSilently,
            loginWithRedirect,
            "PUT",
            data
        );
        //inform the admin that the user has been correctly banned
        alert("The user has been banned");
    }

    //return all the modifications made by the users, if it's null (the user didn't modify the attribute) we don't render it
    return (
        <ul className="myModifs">
            {modifs===null ? null : modifs.map((item, index) =>
                <li key={item.modifID} className="list" style={{backgroundColor: item.validated >= 3 ? "rgba(0, 255, 0, 0.2)" : item.validated < 1 ? "rgba(255, 0, 0, 0.2)" : "white"}}>
                    <span><span className="bold">idUser : </span>idUser : {item.idUser}</span>
                    <span>,<span className="bold"> date : </span>{item.date}</span>
                    <span>,<span className="bold"> idEstablishment : </span>{item.idEstablishment}</span>
                    {item.name ? <span>,<span className="bold"> name : </span>{item.name}</span> : null}
                    {item.idType ? <span>,<span className="bold"> idType : </span>{item.idType}</span> : null}
                    {item.description ? <span>,<span className="bold"> description : </span>{item.description}</span> : null}
                    {item.address ? <span>,<span className="bold"> address : </span>{item.address}</span> : null }
                    {item.idTown ? <span>,<span className="bold"> idTown : </span>{item.idTown}</span> : null}
                    {item.closed ? <span>,<span className="bold"> closed : </span>{item.closed.map((day, index) =>
                        <span>{day} </span>
                    )}</span> : null}
                    {item.lat ? <span>,<span className="bold"> lat : </span>{item.lat}</span> : null}
                    {item.long ? <span>,<span className="bold"> long : </span>{item.long}</span> : null}
                    {item.website ? <span>,<span className="bold"> website : </span>{item.website}</span> : null}
                    <span>,<span className="bold"> validated : </span>{item.validated}</span>
                    {/*The button for ban a user*/}
                    <button onClick={() => banUser(item.idUser)} className="banButton">Ban user {item.idUser}</button>
                </li>
            )}
        </ul>
    )
}
export default Modifications;