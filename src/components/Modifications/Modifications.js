import React, {useEffect, useState, useContext} from "react";
import "./Modifications.css";


//take all the modifications in the db and render it for the admin
function Modifications () {

    //a state with the list of modifications
    const [modifs, setModif] = useState(null);

    //at the load of the page, get the modifications from db
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
                validated: 5
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
                validated: 5
            };
            const modifTest3  = {
                modifID: 3,
                idUser: "Github|4427786",
                date: "19.10.2020",
                idEstablishment: 1235853,
                name: "panne d'inspi",
                idType: "restaurant",
                description: "on test d'écrire des trucs longs et pas forcément avec beaucoup de sens parce qu'on test la longueur et le comportement du CSS",
                address: "Rue d'on sais pas trop ou 3",
                idTown: 123558,
                open: "je sais pas comment on va mettre ça là omg -_-",
                lat: 46.569,
                long: 9.355554,
                website: "panne d'inspi.ch",
                validated: 1
            };
            const modifList = [modifTest1, modifTest2, modifTest3];

            await setModif(modifList);
        }

        fetchModificationsFromDb();
    }, []);

    //the effect of the ban button
    let banUser = (props) => {
        //call the db for ban "props"
        console.log(props);
    }

    //return all the modifications made by the users
    return (
        <ul>
            {modifs===null ? null : modifs.map((item, index) =>
                <li key={item.modifID} className="list" style={{backgroundColor: item.validated >= 5 ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)"}}>
                    <span><span className="bold">idUser : </span>idUser : {item.idUser}</span>
                    <span>,<span className="bold"> date : </span>{item.date}</span>
                    <span>,<span className="bold"> idEstablishment : </span>{item.idEstablishment}</span>
                    {item.name ? <span>,<span className="bold"> name : </span>{item.name}</span> : null}
                    {item.idType ? <span>,<span className="bold"> idType : </span>{item.idType}</span> : null}
                    {item.description ? <span>,<span className="bold"> description : </span>{item.description}</span> : null}
                    {item.address ? <span>,<span className="bold"> address : </span>{item.address}</span> : null }
                    {item.idTown ? <span>,<span className="bold"> idTown : </span>{item.idTown}</span> : null}
                    {item.open ? <span>,<span className="bold"> open : </span>{item.open}</span> : null}
                    {item.lat ? <span>,<span className="bold"> lat : </span>{item.lat}</span> : null}
                    {item.long ? <span>,<span className="bold"> long : </span>{item.long}</span> : null}
                    {item.website ? <span>,<span className="bold"> website : </span>{item.website}</span> : null}
                    {item.validated ? <span>,<span className="bold"> validated : </span>{item.validated}</span> : null}
                    <button onClick={() => banUser(item.idUser)} className="banButton">Ban user {item.idUser}</button>
                </li>
            )}
        </ul>
    )
}
export default Modifications;