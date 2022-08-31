/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CustomTemplate = {
    template_id: string;
    language: string;
    type: CustomTemplate.type;
    template: string;
    params: any;
};

export namespace CustomTemplate {

    export enum type {
        CUSTOM = 'custom',
    }


}

