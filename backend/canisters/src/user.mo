import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";

actor UserCanister {

  // define the Contact type with name and phone number
  type Contact = {
    name: Text;
    phone: Text;
  };

  // define a new type for storing friends' public keys
  type PublicKey = Text;  //should be a proper PublicKey type

  // contacts
  var contacts: HashMap.HashMap<Principal, [Contact]> = HashMap.HashMap<Principal, [Contact]>(0, Principal.equal, Principal.hash);

  // initialize empty HashMap for storing public keys of friends
  var friendKeys: HashMap.HashMap<Principal, [PublicKey]> = HashMap.HashMap<Principal, [PublicKey]>(0, Principal.equal, Principal.hash);

  // add a new contact for the given user (Principal)
  public func addContact(user: Principal, newContact: Contact): async () {
    let existingContacts = contacts.get(user);
    switch (existingContacts) {
      case (?contactList) {
        let updatedContacts: [Contact] = Array.append(contactList, [newContact]);
        contacts.put(user, updatedContacts);
      };
      case null {
        contacts.put(user, [newContact]);  // initialize with the new contact
      };
    };
  };

  // remove contact for the given user (Principal) by contact name
  public func removeContact(user: Principal, contactName: Text): async () {
    let existingContacts = contacts.get(user);
    switch (existingContacts) {
      case (?contactList) {
        let updatedContacts = Array.filter<Contact>(contactList, func (contact) : Bool {
          contact.name != contactName;
        });
        contacts.put(user, updatedContacts);  // Update contacts after removal
      };
      case null {
        return;
      };
    };
  };

  // add a friend's public key for the user
  public func addFriendPublicKey(user: Principal, friendPublicKey: PublicKey): async () {
    let existingKeys = friendKeys.get(user);
    switch (existingKeys) {
      case (?publicKeyList) {
        let updatedKeys: [PublicKey] = Array.append(publicKeyList, [friendPublicKey]);
        friendKeys.put(user, updatedKeys);
      };
      case null {
        // if no keys are stored yet, initialize the list with the new public key
        friendKeys.put(user, [friendPublicKey]);
      };
    };
  };

  // get all friends' public keys for the user
  public query func getFriendPublicKeys(user: Principal): async ?[PublicKey] {
    return friendKeys.get(user);
  };

  // get all contacts for the given user
  public query func getContacts(user: Principal): async ?[Contact] {
    return contacts.get(user);
  };
}
