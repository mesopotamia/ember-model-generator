interface ISwaggerDefinition {
    properties: {
        [propName: string]: ISwaggerProperty,
    };
}

interface ISwaggerDefinitions {
    [definitionName: string]: ISwaggerDefinition;
}

interface ISwaggerProperty {
    type?: string;
    format?: string;
    default?: boolean;
    $ref?: any;
    items?: {
        $ref: string;
    };
}

interface ITransformedSwaggerDefinition {
    modelName: string;
    relationship?: {
        hasMany: string[];
        belongsTo: string
    };
    val: ISwaggerDefinition;
}

interface ICommandDefinitionObject {
    type: string;
    name: string;
    relationship: any;
}