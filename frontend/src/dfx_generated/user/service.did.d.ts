import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Name = string;
export type Phone = string;
export interface _SERVICE {
  'insert' : ActorMethod<[Name, Phone], undefined>,
  'lookup' : ActorMethod<[Name], [] | [Phone]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
