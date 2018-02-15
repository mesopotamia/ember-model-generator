import {expect} from "chai";
import {
    getArrayFromDefinitions, getCommandsFromMultipleDefinitions,
    getEmberDataRelationship, getEmberDataType, getModelCommand,
    getModelNamesFromDefinitions, getRelationship,
} from "../src/command-generator";

describe("commandGenerator module", () => {
    describe("I should get a command from swagger definition", () => {
        it("command should have the correct information", () => {
            /*tslint:disable:max-line-length*/
            const emberDataCommand = `ember g model order shipDate:date complete:boolean`;
            const inputDefinition: ISwaggerDefinitions = {
                Order: {
                    properties: {
                        shipDate: {
                            type: "string",
                            format: "date-time",
                        },
                        complete: {
                            type: "boolean",
                            default: false,
                        },
                    },
                },
            };

            const transformedDefinition: ITransformedSwaggerDefinition = getArrayFromDefinitions(inputDefinition)[0];
            expect(getModelCommand(transformedDefinition)).to.be.eql(emberDataCommand);
        });
        it("command should ignore id", () => {
            /*tslint:disable:max-line-length*/
            const emberDataCommand = `ember g model order shipDate:date complete:boolean`;
            const inputDefinition: ISwaggerDefinitions = {
                Order: {
                    properties: {
                        id: {
                            type: "integer",
                            format: "int64",
                        },
                        shipDate: {
                            type: "string",
                            format: "date-time",
                        },
                        complete: {
                            type: "boolean",
                            default: false,
                        },
                    },
                },
            };
            const transformedDefinition: ITransformedSwaggerDefinition = getArrayFromDefinitions(inputDefinition)[0];
            expect(getModelCommand(transformedDefinition)).to.be.eql(emberDataCommand);
        });
    });
    describe("I should get ember data types from swagger definition", () => {
        it ("get date type", () => {
            const prop = {
                type: "string",
                format: "date",
            };
            expect(getEmberDataType(prop)).to.be.equal("date");
        });
        it ("get date type from date-time", () => {
            const prop = {
                type: "string",
                format: "date-time",
            };
            expect(getEmberDataType(prop)).to.be.equal("date");
        });
        it ("get string type", () => {
            const prop = {
                type: "string",
                format: "",
            };
            expect(getEmberDataType(prop)).to.be.equal("string");
        });
        it ("get number type", () => {
            const prop = {
                type: "number",
            };
            expect(getEmberDataType(prop)).to.be.equal("number");
        });
        it ("get number type even when float format is provided", () => {
            const prop = {
                type: "number",
                format: "float",
            };
            expect(getEmberDataType(prop)).to.be.equal("number");
        });
        it ("get number type even when integer type is provided", () => {
            const prop = {
                type: "integer",
                format: "float",
            };
            expect(getEmberDataType(prop)).to.be.equal("number");
        });
        it ("get boolean type ", () => {
            const prop = {
                type: "boolean",
            };
            expect(getEmberDataType(prop)).to.be.equal("boolean");
        });
    });
    describe("I should get relationships with ember data", () => {
        const swaggerDef: ISwaggerDefinitions = {
            Category: {
                properties: {
                    id: {
                        type: "integer",
                        format: "int64",
                    },
                    shipDate: {
                        type: "string",
                        format: "date-time",
                    },
                    complete: {
                        type: "boolean",
                        default: false,
                    },
                },
            },
            Pet: {
                properties: {
                    category: {
                        $ref: "#/definitions/Category",
                    },
                    tags: {
                        items: {
                            $ref: "#/definitions/Tag",
                        },
                    },
                },
            },
            Tag : {
                properties: {
                    id: {
                        type: "integer",
                        format: "int64",
                    },
                    name: {
                        type: "string",
                    },
                },
            },

        };
        it("check hasMany relationship", () => {
            expect(getEmberDataRelationship(swaggerDef.Pet.properties.tags)).to.be.equal("has-many:tag");
        });
        it("check belongs-to relationship", () => {
            expect(getEmberDataRelationship(swaggerDef.Pet.properties.category)).to.be.equal("belongs-to:category");
        });
        it("check model names from definitions", () => {
            expect(getModelNamesFromDefinitions(swaggerDef)).to.be.deep.equal(["Category", "Pet", "Tag"]);
        });
        it("get array of definitions (transformed definitions)", () => {
            expect(getArrayFromDefinitions(swaggerDef)).to.be.deep.equal([
                {
                    modelName: "Category",
                    val: {
                        properties: {
                            complete: {
                                default: false,
                                type: "boolean",
                            },
                            id: {
                                format: "int64",
                                type: "integer",
                            },
                            shipDate: {
                                format: "date-time",
                                type: "string",
                            },
                        },
                    },
                },
                {
                    modelName: "Pet",
                    val: {
                        properties: {
                            category: {
                                $ref: "#/definitions/Category",
                            },
                            tags: {
                                items: {
                                    $ref: "#/definitions/Tag",
                                },
                            },
                        },
                    },
                },
                {
                    modelName: "Tag",
                    val: {
                        properties: {
                            id: {
                                format: "int64",
                                type: "integer",
                            },
                            name: {
                                type: "string",
                            },
                        },
                    },
                },
            ]);
        });
        it("get belongsTo relationship from property", () => {
            expect(getRelationship(swaggerDef.Pet.properties.category)).to.be.deep.equal({
                belongsTo: "category",
            });
        });
        it("get hasMany relationship from property", () => {
            expect(getRelationship(swaggerDef.Pet.properties.tags)).to.be.deep.equal({
                hasMany: "tag",
            });
        });
        it("get command with relationship", () => {
            expect(getCommandsFromMultipleDefinitions(swaggerDef)).to.be.deep.equal([
                "ember g model category shipDate:date complete:boolean",
                "ember g model pet category:belongs-to:category tags:has-many:tag",
                "ember g model tag name:string",
            ]);
        });
    });
});
