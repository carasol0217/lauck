export const idlFactory = ({ IDL }) => {
  const AudioFile = IDL.Record({
    'id' : IDL.Nat,
    'owner' : IDL.Principal,
    'data' : IDL.Vec(IDL.Nat8),
  });
  return IDL.Service({
    'getAudio' : IDL.Func([IDL.Nat], [IDL.Opt(AudioFile)], []),
    'upload' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Nat], []),
  });
};
export const init = ({ IDL }) => { return []; };
