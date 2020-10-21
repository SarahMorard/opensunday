import React, {useEffect, useState} from "react";
import "./Modifications.css";

function Modifications () {

    const [modifs, setModif] = useState(null);

    useEffect(() => {

        async function fetchModificationsFromDb () {
            //call the db for have the modifications (return a list of objects )
            //temporary :
            const modifTest1 = {
                modifID: 1,
                idUser: "Github|4427786",
                date: "18.10.2020",
                idEstablishment: 1235852,
                name: null,
                idType: null,
                description: null,
                address: "Rue de la plaine 19",
                idTown: null,
                open: null,
                lat: null,
                long: null,
                website: "www.pinkfoodasia.ch",
                validated: false
            };
            const modifTest2  = {
                modifID: 2,
                idUser: "Github|4427786",
                date: "19.10.2020",
                idEstablishment: 1235852,
                name: "Vache et moi",
                idType: "restaurant",
                description: null,
                address: null,
                idTown: null,
                open: null,
                lat: null,
                long: null,
                website: null,
                validated: null
            };
            const modifList = [modifTest1, modifTest2];

            await setModif(modifList);
        }

        fetchModificationsFromDb();


    }, []);

    let banUser = (props) => {
        //call the db for ban "props"
        console.log(props);
    }

    return (
        <ul>
            {modifs===null ? null : modifs.map((item, index) =>
                <li key={item.modifID}>
                    <span>idUser : {item.idUser}</span>
                    <span>, date : {item.date}</span>
                    <span>, idEstablishment : {item.idEstablishment}</span>
                    {item.name ? <span>, name : {item.name}</span> : null}
                    {item.idType ? <span>, idType : {item.idType}</span> : null}
                    {item.description ? <span>, description : {item.description}</span> : null}
                    {item.address ? <span>, address : {item.address}</span> : null }
                    {item.idTown ? <span>, idTown : {item.idTown}</span> : null}
                    {item.open ? <span>, open : {item.open}</span> : null}
                    {item.lat ? <span>, lat : {item.lat}</span> : null}
                    {item.long ? <span>, long : {item.long}</span> : null}
                    {item.website ? <span>, website : {item.website}</span> : null}
                    {item.validated ? <span>, validated : {item.validated}</span> : null}
                    <button onClick={banUser(item.idUser)}>Ban user {item.idUser}</button>
                </li>
            )}
        </ul>
    )
}
export default Modifications;