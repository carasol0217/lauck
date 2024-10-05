export const idlFactory = ({ IDL }) => {
  const Contact = IDL.Record({ 'name' : IDL.Text, 'phone' : IDL.Text });
  return IDL.Service({
    'addContact' : IDL.Func([IDL.Principal, Contact], [], []),
    'getContacts' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(Contact))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
