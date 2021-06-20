import {PaginationModel} from "./PaginationModel";

export class ApiModel {
    statusText: string;
    status: number;
    data: any;
    debug: any;
    pagination?: PaginationModel;
}