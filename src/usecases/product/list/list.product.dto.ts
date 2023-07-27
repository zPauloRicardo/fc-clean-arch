export interface OutputProductDto {
    id: string;
    name: string;
    price: number;
};

export interface OutputListProductDto {
    products: OutputProductDto[];
}