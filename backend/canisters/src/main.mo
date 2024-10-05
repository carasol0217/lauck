import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

// Define the interfaces for the other canisters
type AudioInterface = actor {
    upload : shared (Text, Text) -> async Nat;
    getAudio : shared (Nat) -> async ?AudioFile;
    getAudiosByOwner : shared (Principal) -> async [AudioFile];
};

type UserInterface = actor {
    addContact : shared (Principal, Contact) -> async ();
    removeContact : shared (Principal, Text) -> async ();
    addFriendPublicKey : shared (Principal, PublicKey) -> async ();
    getFriendPublicKeys : shared (Principal) -> async ?[PublicKey];
    getContacts : shared (Principal) -> async ?[Contact];
};

// Define the types that match your user.mo definitions
type Contact = {
    name: Text;
    phone: Text;
};

type PublicKey = Text;

type AudioFile = {
    id: Nat;
    ipfsHash: Text;
    owner: Principal;
    signature: Text;
    publicKey: Text;
};

actor MainCanister {
    // actor references
    private let audioCanister : AudioInterface = actor("3snml-rqaaa-aaaam-qbeua-cai");
    private let userCanister : UserInterface = actor("33ohx-hyaaa-aaaam-qbevq-cai");

    public shared(msg) func uploadAudio(ipfsHash: Text, signature: Text) : async Nat {
        let publicKeyOpt = await userCanister.getFriendPublicKeys(msg.caller);

        switch (publicKeyOpt) {
            case (?publicKeys) {
                let publicKey = publicKeys[0];
                let audioId = await audioCanister.upload(ipfsHash, signature);
                return audioId;
            };
            case null {
                Debug.print("No public key found for this user.");
                return 0;
            };
        };
    };

    public func getAudioById(id: Nat) : async ?AudioFile {
        return await audioCanister.getAudio(id);
    };

    public func getAudiosByOwner(owner: Principal) : async [AudioFile] {
        return await audioCanister.getAudiosByOwner(owner);
    };

    public shared(msg) func addContact(name: Text, phone: Text) : async () {
        let contact: Contact = { name = name; phone = phone };
        await userCanister.addContact(msg.caller, contact);
    };

    public shared(msg) func removeContact(contactName: Text) : async () {
        await userCanister.removeContact(msg.caller, contactName);
    };

    public shared(msg) func addFriendPublicKey(friendPublicKey: PublicKey) : async () {
        await userCanister.addFriendPublicKey(msg.caller, friendPublicKey);
    };

    public shared(msg) func getFriendPublicKeys() : async ?[PublicKey] {
        return await userCanister.getFriendPublicKeys(msg.caller);
    };

    public shared(msg) func getContacts() : async ?[Contact] {
        return await userCanister.getContacts(msg.caller);
    };
};