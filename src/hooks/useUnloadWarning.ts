import { useEffect } from "react";

export default function useUnloadWarning(condition: boolean) {
    useEffect(() => {
        if (!condition) {
            return;
        }

        const listener = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener("beforeunload", listener);

        return () => window.removeEventListener("beforeunload", listener);
    }, [condition]);
}
