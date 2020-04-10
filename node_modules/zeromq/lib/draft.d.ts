/// <reference types="node" />
import { Socket } from "./native";
import { Message, MessageLike, Readable, SocketOptions, Writable } from ".";
export declare class Server extends Socket {
    constructor(options?: SocketOptions<Server>);
}
interface ServerRoutingOptions {
    routingId: number;
}
export interface Server extends Readable<[Message, ServerRoutingOptions]>, Writable<MessageLike, [ServerRoutingOptions]> {
}
export declare class Client extends Socket {
    constructor(options?: SocketOptions<Client>);
}
export interface Client extends Readable<[Message]>, Writable<MessageLike> {
}
export declare class Radio extends Socket {
    constructor(options?: SocketOptions<Radio>);
}
interface RadioGroupOptions {
    group: Buffer | string;
}
export interface Radio extends Writable<MessageLike, [RadioGroupOptions]> {
}
export declare class Dish extends Socket {
    constructor(options?: SocketOptions<Dish>);
    join(...values: Array<Buffer | string>): void;
    leave(...values: Array<Buffer | string>): void;
}
interface DishGroupOptions {
    group: Buffer;
}
export interface Dish extends Readable<[Message, DishGroupOptions]> {
}
export declare class Gather extends Socket {
    constructor(options?: SocketOptions<Gather>);
}
export interface Gather extends Readable<[Message]> {
    conflate: boolean;
}
export declare class Scatter extends Socket {
    constructor(options?: SocketOptions<Scatter>);
}
export interface Scatter extends Writable<MessageLike> {
    conflate: boolean;
}
export declare class Datagram extends Socket {
    constructor(options?: SocketOptions<Datagram>);
}
export interface Datagram extends Readable<[Message, Message]>, Writable<[MessageLike, MessageLike]> {
}
export {};
