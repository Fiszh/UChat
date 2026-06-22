export namespace Converter {
    interface ConditionalValue {
        param: string;
        value: string;
        values: Record<string, string>;
    }

    interface Param {
        param: string;
        priority?: boolean;
        values: ParamValues;
    }

    type ParamValues =
        | Record<string, string>
        | ConditionalValue[]
        | "boolean"
        | null;

    type ConditionalValues = Record<string, string>;

    type Settings = Record<string, Param[]>;
}

export {};
