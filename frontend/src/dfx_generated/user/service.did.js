export const idlFactory = ({ IDL }) => {
  const Name = IDL.Text;
  const Phone = IDL.Text;
  return IDL.Service({
    'insert' : IDL.Func([Name, Phone], [], []),
    'lookup' : IDL.Func([Name], [IDL.Opt(Phone)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
