export interface Indicador {
    Valor: string;
    Fecha: string;
}

export interface IndicadorValues {
    id: number,
    nombre: string;
    tipo: string;
    symbol: string;
    data?: Indicador[];
}

export type IndicatorType = "dolar" | "euro" | "ipc" | "uf" | "utm";