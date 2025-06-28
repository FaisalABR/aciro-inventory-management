import { IUser } from "./entities";

export type TInertiaProps = {
    auth: {
        user: IUser;
    };
    flash: {
        success: string;
        error: string;
    };
};
