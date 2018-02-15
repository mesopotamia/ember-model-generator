import {get, map} from "lodash";
const EMBER_MODEL_GENERATE = "ember g model";
export const getModelCommand = (definition: ITransformedSwaggerDefinition) => {
    const modelName: string = definition.modelName;
    const propsAndTypes = getPropertyNamesAndTypes(definition.val.properties);
    const propsAndTypesCommand = getCommandDefinitionObject(propsAndTypes);
    return `${EMBER_MODEL_GENERATE} ${modelName.toLowerCase()} ${propsAndTypesCommand}`;
};
export const getCommandsFromMultipleDefinitions = (swaggerDefinition: ISwaggerDefinitions) => {

    return getArrayFromDefinitions(swaggerDefinition).map(getModelCommand);
};
export const getModelNamesFromDefinitions = (definitions: ISwaggerDefinitions) => {
    return Object.keys(definitions);
};
const getFirstModelNameFromDefinitions = (definitions: ISwaggerDefinitions) => {
    return Object.keys(definitions)[0];
};
const getPropertyNamesAndTypes = (props): ICommandDefinitionObject[] => {
    return map(props, (item: ISwaggerProperty, key: string) => {
        return {
            name: key,
            type: getEmberDataType(item) || "",
            relationship: getEmberDataRelationship(item),
        };
    });
};
const getCommandDefinitionObject = (propsAndTypes: ICommandDefinitionObject[]): string => {
    return excludeIdFromCommand(propsAndTypes)
        .map((item: ICommandDefinitionObject) => {
            if (item.relationship) {
                return `${item.name}:${item.relationship}`;
            }
            return `${item.name}:${item.type}`;
        })
        .join(" ");
};
/*tslint:disable:max-line-length*/
const excludeIdFromCommand = (propsAndTypes: ICommandDefinitionObject[]): ICommandDefinitionObject[] => {
    return propsAndTypes.filter((item) => item.name !== "id");
};
export const getEmberDataType = (prop: ISwaggerProperty) => {
    const emberDataType = mapping[prop.type];
    if (typeof emberDataType === "object") {
        const format = emberDataType.format[prop.format];
        if (!format) {
            return emberDataType.default;
        }
        return format;
    }
    return emberDataType;
};
/*tslint:disable:object-literal-key-quotes*/
const mapping = {
    "string": {
        default: "string",
        format: {
            "date": "date",
            "date-time": "date",
        },
    },
    "number": "number",
    "integer": "number",
    "boolean": "boolean",
};
export const getEmberDataRelationship = (prop: ISwaggerProperty) => {
    if (get(prop, "items.$ref")) {
        const modelName = getModelNameFromRef(prop.items.$ref);
        return `has-many:${modelName}`;
    } else if (prop.$ref) {
        const modelName = getModelNameFromRef(prop.$ref);
        return `belongs-to:${modelName}`;
    }
};
export const getRelationship = (prop: ISwaggerProperty) => {
    if (get(prop, "items.$ref")) {
        const ref = get(prop, "items.$ref");
        return {
            hasMany: getModelNameFromRef(ref),
        };
    } else if (prop.$ref) {
        return {
            belongsTo: getModelNameFromRef(prop.$ref),
        };
    }
};
const getModelNameFromRef = (ref: string) => {
    const segments = ref.split("/");
    return segments[segments.length - 1].toLowerCase();
};
export const getArrayFromDefinitions = (definitions: ISwaggerDefinitions): ITransformedSwaggerDefinition[] => {
    return map(definitions, (item, key) => {
        return {
            modelName: key,
            val: item,
        };
    });
};
