import { Injectable } from "@nestjs/common";
import { PaginationException } from "@shared/exceptions/pagination.exception";
import { MetadataPaginatedInfo } from "@shared/interfaces/response.interface";
import { Service } from "@shared/interfaces/service.interface";

@Injectable()
export class GetMetadataService implements Service {
    async execute(page: number, count: number, limit: number): Promise<MetadataPaginatedInfo> {
        const lastPageCalc = Math.ceil(count / limit);
        const lastPage = lastPageCalc > 0 ? lastPageCalc : 1;

        if (page > lastPage || page < 1) {
            throw new PaginationException();
        }

        return {
            type: "paginated",
            currentPage: page,
            next: lastPage > page ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
            lastPage,
            perPage: limit,
            total: count,
        };
    }
}
