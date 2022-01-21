import {Min} from 'class-validator';


export class PaginationParams {
    @Min(0)
    readonly offset: number;

    @Min(1)
    readonly limit: number;
}