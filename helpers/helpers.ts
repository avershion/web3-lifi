import { TokenType } from "@/components/TokenList/types";

export const isTokenArrayEqual = (a: TokenType[], b: TokenType[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (
            a[i].address !== b[i].address ||
            a[i].balance !== b[i].balance ||
            a[i].symbol !== b[i].symbol
        ) {
            return false;
        }
    }
    return true;
};
