import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { ResponseHeader } from './header.entity';
import { Request } from "./request.entity";
import { ResponsePayload } from "./payload.entity";

@Entity()
export class Response {

    @PrimaryColumn({type: 'varchar', length: 40})
    id: string;

    @Column({type: 'bigint'})
    timestamp: number;

    @Column()
    status: number;

    @OneToOne(() => ResponsePayload, payload => payload.response, {cascade: true})
    payload: ResponsePayload;

    @OneToOne(() => Request, request => request.response)
    @JoinColumn()
    request: Request;

    @OneToMany(() => ResponseHeader, header => header.parent, {cascade: true, eager: true})
    headers: ResponseHeader[]

    addHeader(header: ResponseHeader) {
        if (this.headers === null) {
            this.headers = new Array<ResponseHeader>();
        }

        this.headers.push(header);
    }

}