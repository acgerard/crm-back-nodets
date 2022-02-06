import {NextFunction} from "express";

export function getId(id: string): number {
    return parseInt(id)
}

export async function execute(next: NextFunction, callback: () => void) {
    try {
        await callback()
    } catch (e: any) {
        next(e)
    }
}