import Map "mo:base/HashMap";
import Text "mo:base/Text";

actor {

  type Name = Text;
  type Phone = Text;

  // The phonebook will map a name to a phone number
  let phonebook = Map.HashMap<Name, Phone>(0, Text.equal, Text.hash);

  // Insert a new entry into the phonebook (Name and Phone)
  public func insert(name: Name, phone: Phone): async () {
    phonebook.put(name, phone);  // Store the phone number under the given name
  };

  // Look up a phone number by name
  public query func lookup(name: Name): async ?Phone {
    phonebook.get(name);  // Return the phone
  };
};