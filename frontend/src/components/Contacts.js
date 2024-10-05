import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';  // Dfinity agent for calling the canister
import { idlFactory as userIDL } from '../dfx_generated/user';  // Adjust the path based on your project setup

const Contacts = ({ principal }) => {
  const [contacts, setContacts] = useState([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [userCanister, setUserCanister] = useState(null);

  useEffect(() => {
    // Initialize the canister and agent to interact with the blockchain
    const initializeCanister = async () => {
      const agent = new HttpAgent({ host: 'http://127.0.0.1:8000' }); // Local replica
      const canisterId = process.env.REACT_APP_CANISTER_ID_USER;      // Get the Canister ID from .env
      const actor = Actor.createActor(userIDL, { agent, canisterId });
      setUserCanister(actor);
    };
    initializeCanister();
  }, []);

  useEffect(() => {
    // Fetch the contacts for the user from the blockchain
    const fetchContacts = async () => {
      if (principal && userCanister) {
        try {
          console.log(`Fetching contacts for principal: ${principal}`);
          const fetchedContacts = await userCanister.getContacts(principal);
          console.log('Fetched contacts:', fetchedContacts);
          setContacts(fetchedContacts || []);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      }
    };
    fetchContacts();
  }, [principal, userCanister]);

  const handleAddContact = async (event) => {
    event.preventDefault();

    if (newContactName && newContactPhone && principal && userCanister) {
      const newContact = { name: newContactName, phone: newContactPhone };
      console.log('Adding new contact:', newContact);

      try {
        // Add contact to the blockchain via the canister
        await userCanister.addContact(principal, newContact);
        setContacts((prevContacts) => [...prevContacts, newContact]);
      } catch (error) {
        console.error('Error adding contact:', error);
      }

      // Clear input fields after adding
      setNewContactName('');
      setNewContactPhone('');
    }
  };

  return (
    <div>
      <h2>Contacts</h2>
      <form onSubmit={handleAddContact}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={newContactPhone}
            onChange={(e) => setNewContactPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Contact</button>
      </form>

      <h3>Contact List</h3>
      {contacts.length > 0 ? (
        <ul>
          {contacts.map((contact, index) => (
            <li key={index}>
              {contact.name} - {contact.phone}
            </li>
          ))}
        </ul>
      ) : (
        <p>No contacts found</p>
      )}
    </div>
  );
};

export default Contacts;
