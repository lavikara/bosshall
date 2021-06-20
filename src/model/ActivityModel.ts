import {BrandModel} from "./BrandModel";

export class ActivityModel {
    public id: number;
    public brandId: number;
    public description: string;
    public createdAt: string;
    public updatedAt: string;

    public Brand?: BrandModel;
}