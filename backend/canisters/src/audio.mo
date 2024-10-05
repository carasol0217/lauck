import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Error "mo:base/Error";

// define the interface type
type UserCanisterInterface = actor {
    getFriendPublicKeys : shared (Principal) -> async ?[Text];
};

actor audio {
    type AudioFile = {
        id: Nat;
        ipfsHash: Text;
        owner: Principal;
        signature: Text;
        publicKey: Text;
    };

    var audios: [AudioFile] = [];
    
    private let userCanister : UserCanisterInterface = actor("REPLACE_WITH_CANISTER_ID");

    public shared(msg) func upload(ipfsHash: Text, signature: Text) : async Nat {
        let publicKeyOpt = await userCanister.getFriendPublicKeys(msg.caller);
        switch (publicKeyOpt) {
            case (?keys) {
                let publicKey = keys[0];
                
                let audioId = Nat.add(Array.size(audios), 1);
                let audioFile: AudioFile = {
                    id = audioId;
                    ipfsHash = ipfsHash;
                    owner = msg.caller;
                    signature = signature;
                    publicKey = publicKey;
                };
                audios := Array.append(audios, [audioFile]);
                return audioId;
            };
            case null {
                throw Error.reject("Public key not found");
            };
        };
    };
}