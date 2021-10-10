import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Request } from "./request.entity";
import { Response } from "./response.entity";

@Entity('request_payload')
export class RequestPayload {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Request, request => request.payload)
    @JoinColumn()
    request: Request;

    @Column({
        type: "text", transformer: {
            to: (value: string) => {
                return Buffer.from(value, 'binary').toString('base64');
            },
            from: (value: string) => {
                return Buffer.from(value, 'base64').toString('binary');
            }
        }
    })
    content: string;

    @Column()
    type: string;

}

@Entity('response_payload')
export class ResponsePayload {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Response, response => response.payload)
    @JoinColumn()
    response: Response;

    @Column({
        type: "text",
        transformer: {
            to: (value: string) => {
                return Buffer.from(value, 'binary').toString('base64');
            },
            from: (value: string) => {
                return Buffer.from(value, 'base64').toString('binary');
            }
        }
    })
    content: string;

    @Column()
    type: string;

}