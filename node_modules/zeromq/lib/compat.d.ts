/// <reference types="node" />
import { EventEmitter } from "events";
import * as zmq from ".";
declare const shortOptions: {
    _fd: number;
    _ioevents: number;
    _receiveMore: number;
    _subscribe: number;
    _unsubscribe: number;
    affinity: number;
    backlog: number;
    identity: number;
    linger: number;
    rate: number;
    rcvbuf: number;
    last_endpoint: number;
    reconnect_ivl: number;
    recovery_ivl: number;
    sndbuf: number;
    mechanism: number;
    plain_server: number;
    plain_username: number;
    plain_password: number;
    curve_server: number;
    curve_publickey: number;
    curve_secretkey: number;
    curve_serverkey: number;
    zap_domain: number;
    heartbeat_ivl: number;
    heartbeat_ttl: number;
    heartbeat_timeout: number;
    connect_timeout: number;
};
declare class Context {
    static setMaxThreads(value: number): void;
    static getMaxThreads(): number;
    static setMaxSockets(value: number): void;
    static getMaxSockets(): number;
    constructor();
}
declare type SocketType = "pair" | "req" | "rep" | "pub" | "sub" | "dealer" | "xreq" | "router" | "xrep" | "pull" | "push" | "xpub" | "xsub" | "stream";
declare type Callback = (err?: Error) => void;
declare class Socket extends EventEmitter {
    [key: string]: any;
    type: SocketType;
    private _msg;
    private _recvQueue;
    private _sendQueue;
    private _paused;
    private _socket;
    private _count;
    constructor(type: SocketType);
    _recv(): Promise<void>;
    _send(): Promise<void>;
    bind(address: string, cb?: Callback): this;
    unbind(address: string, cb?: Callback): this;
    connect(address: string): this;
    disconnect(address: string): this;
    send(message: zmq.MessageLike[], flags?: number, cb?: Callback): this;
    read(): void;
    bindSync(...args: Parameters<Socket["bind"]>): void;
    unbindSync(...args: Parameters<Socket["unbind"]>): void;
    pause(): void;
    resume(): void;
    close(): this;
    get closed(): boolean;
    monitor(interval: number, num: number): this;
    unmonitor(): this;
    subscribe(filter: string): this;
    unsubscribe(filter: string): this;
    setsockopt(option: number | keyof typeof shortOptions, value: any): this;
    getsockopt(option: number | keyof typeof shortOptions): string | number | boolean | null;
}
declare function createSocket(type: SocketType, options?: {
    [key: string]: any;
}): Socket;
declare function curveKeypair(): {
    public: string;
    secret: string;
};
declare function proxy(frontend: Socket, backend: Socket, capture?: Socket): void;
declare const version: string;
export { version, Context, Socket, createSocket as socket, createSocket, curveKeypair, proxy, shortOptions as options, };
