export class PaginationModel {
    public start: number;
    public end: number;
    public total: number;
    public next: number;
    public prev: number;

    constructor() {

    }

    public putPagination(pagination?: PaginationModel) {
        if (pagination && pagination.next) {
            this.start = pagination.start ? pagination.start : 1;
            this.end = pagination.end;
            this.total = pagination.total;
            this.next = pagination.next ? pagination.next : 1;
            this.prev = pagination.prev;
        }
    }
}
