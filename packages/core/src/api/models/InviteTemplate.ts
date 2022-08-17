/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type InviteTemplate = {
    template_id: string;
    language: string;
    type: InviteTemplate.type;
    params: any;
};

export namespace InviteTemplate {

    export enum type {
        INVITE = 'invite',
    }


}

