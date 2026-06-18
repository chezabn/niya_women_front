import React from "react";
import { Button } from "@/src/components/ui/Button";

interface Props {
    onPick: () => void;
}

export const PublicationMediaPicker = ({
                                           onPick,
                                       }: Props) => {
    return (
        <Button
            text="Ajouter des photos"
            onPress={onPick}
        />
    );
};