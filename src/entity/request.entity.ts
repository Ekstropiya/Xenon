import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { RequestHeader } from './header.entity';
import { Response } from "./response.entity";
import { RequestPayload } from "./payload.entity";

@Entity()
export class Request {

    @PrimaryColumn({type: 'varchar', length: 40})
    id: string;

    @Column({type: 'bigint'})
    timestamp: number = Date.now();

    @Column()
    method: string;

    @Column()
    host: string;

    @Column()
    url: string;

    @Column()
    httpVersion: string;

    @OneToOne(() => RequestPayload, payload => payload.request, {cascade: true})
    payload: RequestPayload;

    @OneToOne(() => Response, response => response.request, {cascade: true, eager: true})
    response: Response;

    @OneToMany(() => RequestHeader, header => header.parent, {cascade: true, eager: true})
    headers: RequestHeader[];

    addHeader(header: RequestHeader) {
        if (this.headers === null) {
            this.headers = new Array<RequestHeader>();
        }

        this.headers.push(header);
    }

}