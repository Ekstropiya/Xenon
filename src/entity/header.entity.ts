import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Request } from "./request.entity";
import { Response } from "./response.entity";

@Entity('request_header')
export class RequestHeader {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key: string;

    @Column()
    value: string;

    @ManyToOne(() => Request, req => req.headers)
    parent: Request;

}

@Entity('response_header')
export class ResponseHeader {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key: string;

    @Column()
    value: string;

    @ManyToOne(() => Response, res => res.headers)
    parent: Response;

}