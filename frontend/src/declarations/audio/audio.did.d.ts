import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AudioFile {
  'id' : bigint,
  'owner' : Principal,
  'data' : Uint8Array | number[],
}
export interface _SERVICE {
  'getAudio' : ActorMethod<[bigint], [] | [AudioFile]>,
  'upload' : ActorMethod<[Uint8Array | number[]], bigint>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
