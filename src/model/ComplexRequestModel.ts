import {PaginationModel} from "./PaginationModel";

export class ComplexRequestModel {
    public data: Array<any>;
    pagination: PaginationModel;
    request: (...args) => any;
    clear: () => any;
}