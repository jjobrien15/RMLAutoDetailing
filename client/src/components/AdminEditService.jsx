import axios from "axios";

import { useState, useRef, useEffect } from 'react'
import { useGetUserId } from "../hooks/useGetUserId";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faPlus, faSort } from '@fortawesome/free-solid-svg-icons'

import "../stylesheets/admin_services.scss";


const AdminEditService = ({ selectedService, closeEditService }) => {

    const userId = useGetUserId();
    const serviceId = selectedService.toString();

    const [perks, setPerks] = useState([]);
    const [newPerk, setNewPerk] = useState("");
    const dragPerk = useRef();
    const dragOverPerk = useRef();

    const [service, setService] = useState({
        createdBy: userId,
        title: "",
        description: "",
        price: "",
        perkList: []
    })

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/content/services/${serviceId}`);
                setService(response.data);
                setPerks(response.data.perkList);
            } catch (err) {
                console.log(err);
            }
        }
        fetchService();
    }, []);

    useEffect(() => (
        setService(p => ({...p, perkList:[...perks]}))
    ), [perks]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setService({...service, [name]:value});
    }

    const handleAddPerk = () => {
        newPerk !== "" && setPerks(currentPerks => [...currentPerks, newPerk]);
    }

    const handleChangePerk = (e) => {
        setNewPerk(e.target.value);
    }

    const handleDeletePerk = (key) => {
        setPerks(currentPerks => currentPerks.filter((_, index) => index !== key));
    }

    const handleSubmit = async () => {
        try{
            await axios.put(`${import.meta.env.VITE_BASE_URI}/content/updateService/${serviceId}`, {...service});
        }catch(err){
            console.log(err);
        }
    }

    const dragStart = (e) => {
        dragPerk.current = e.target.id;
    }

    const dragEnter = (e) => {
        dragOverPerk.current = e.currentTarget.id;
    }
    //Reorder/splice perks state on end of drag.
    const dragEnd = () => {
        const copyPerks = [...perks];
        const dragPerkContent = copyPerks[dragPerk.current];
        copyPerks.splice(dragPerk.current, 1);
        copyPerks.splice(dragOverPerk.current, 0, dragPerkContent);
        dragPerk.current = null;
        dragOverPerk.current = null;
        setPerks(copyPerks);
    }

  return (
      <div className="formPageContent">
        <div className="formPageModalHeader">
            <h1>Edit Service</h1>
              <button type="button" onClick={closeEditService}><FontAwesomeIcon icon={faX} /></button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="formGroup">
                <label htmlFor="title">Title: </label>
                <input type="text" name="title" id="title" value={service.title} onChange={handleChange}/>
            </div>
            <div className="formGroup">
                <label htmlFor="description">Description: </label>
                <input type="text" name="description" id="description" value={service.description} onChange={handleChange}/>
            </div>
            <div className="formGroup">
                <label htmlFor="price">Price: <small>(Blank or 0 will display "Contact for price")</small> </label>
                <input type="number" name="price" id="price" value={service.price} onChange={handleChange}/>
            </div>
              <div className="formGroup">
                  <label htmlFor="perk">Perks:</label>
                  <div className="perkInput">
                    <input type="text" name="perk" id="perk" value={newPerk} onChange={handleChangePerk}/>
                    <button type="button" className="addPerkBtn" onClick={handleAddPerk}><FontAwesomeIcon icon={faPlus}/></button>
                </div>
                <ul className="addedPerksList">
                {perks.map((perk, key)=>(
                    <li key={key} id={key} draggable onDragStart={(e) => dragStart(e)} onDragEnter={(e) => dragEnter(e)} onDragEnd={dragEnd}>
                        <button type="button" className = "sortPerkBtn">
                            <small><FontAwesomeIcon icon={faSort} /></small>
                        </button>
                        {perk}
                        <button type="button" className = "deletePerkBtn" onClick={() => handleDeletePerk(key)}>
                            <small><FontAwesomeIcon icon={faX} /></small>
                        </button>
                    </li>
                ))}
                </ul>
            </div>
                
            <div className="formGroup">
                <button type="submit" className="submitBtn">Save</button>
            </div>
        </form>
    </div>
  )
}

export default AdminEditService