export const idlFactory = ({ IDL }) => {
    return IDL.Service({
      'insert': IDL.Func([IDL.Text, IDL.Text], [], []),
      'lookup': IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
      // Add more methods here based on your `user.did` file
    });
  };
  