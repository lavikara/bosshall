import {PaginationModel} from '../../model/PaginationModel';
import {Subscription} from 'rxjs';

export interface RequestInterface {
    data: any[];
    pagination: PaginationModel;
    request: () => Subscription;
    clear: () => void;
    get?: () => any[];
    select?: (data: any[]) => void;
}
