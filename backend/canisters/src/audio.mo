import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Principal "mo:base/Principal";

// Blockchain implementation
actor audio {
    // Define a type to represent an audio file
    type AudioFile = {
        id: Nat;          // Unique identifier for the audio file
        data: Blob;       // Audio data, stored in binary format (Blob)
        owner: Principal;
        signature: Text;
        publicKey: Text; 
    };

    // Store audio files in an array
    var audios: [AudioFile] = [];

    // Function to upload an audio file
    public shared(msg)func upload(audioData: Blob, signature: Text, publicKey: Text) : async Nat {
    // Validate the signature off-chain (can be done in the caller)
    // Here you would normally verify the signature using the public key
    let audioId = Nat.add(Array.size(audios), 1); // Generate a unique ID
    let audioFile: AudioFile = { 
        id = audioId; 
        data = audioData; 
        owner = msg.caller; 
        signature = signature; // Bind the signature parameter
        publicKey = publicKey; // Bind the public key parameter
    };
    audios := Array.append(audios, [audioFile]); // Store the new audio in the array
    return audioId; // Return the ID of the uploaded audio
};


    // Function to retrieve an audio file by ID
    public func getAudio(id: Nat) : async ?AudioFile {
        if (id < Array.size(audios)) { 
            return ?audios[id]; // Return the audio file if it exists
        } else {
            return null; // Return null if the ID is out of bounds
        }
    };
};
