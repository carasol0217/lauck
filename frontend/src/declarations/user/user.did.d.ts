import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Contact { 'name' : string, 'phone' : string }
export interface _SERVICE {
  'addContact' : ActorMethod<[Principal, Contact], undefined>,
  'getContacts' : ActorMethod<[Principal], [] | [Array<Contact>]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
