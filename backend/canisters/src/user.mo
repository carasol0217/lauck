import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";

actor UserCanister {

  // Define the Contact type with name and phone number
  type Contact = {
    name: Text;
    phone: Text;
  };

  // Initialize an empty HashMap for contacts
  var contacts: HashMap.HashMap<Principal, [Contact]> = HashMap.HashMap<Principal, [Contact]>(0, Principal.equal, Principal.hash);

  // Add a new contact for the given user (Principal)
  public func addContact(user: Principal, newContact: Contact): async () {
    let existingContacts = contacts.get(user);
    switch (existingContacts) {
      case (?contactList) {
        // Manually create a new array and append the new contact
        let updatedContacts: [Contact] = Array.append(contactList, [newContact]);
        contacts.put(user, updatedContacts);
      };
      case null {
        // If the user has no contacts, create a new list with one contact
        contacts.put(user, [newContact]);  // Initialize with the new contact
      };
    };
  };

  // Get all contacts for the given user
  public query func getContacts(user: Principal): async ?[Contact] {
    return contacts.get(user);
  };
}
