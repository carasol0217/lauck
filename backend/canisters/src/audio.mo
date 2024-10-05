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
        owner: Principal; // The owner of the audio file, represented as a Principal (user identity)
    };

    // Store audio files in an array
    var audios: [AudioFile] = [];

    // Function to upload an audio file
    public shared(msg) func upload(audioData: Blob) : async Nat {
        let audioId = Nat.add(Array.size(audios), 1); // Generate a unique ID for the new audio
        let audioFile: AudioFile = { id = audioId; data = audioData; owner = msg.caller }; 
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
