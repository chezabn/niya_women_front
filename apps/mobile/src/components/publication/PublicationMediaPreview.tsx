import React from "react";
import {
    Image,
    FlatList,
    StyleSheet,
} from "react-native";

interface Props {
    medias: string[];
}

export const PublicationMediaPreview = ({
                                            medias,
                                        }: Props) => {
    return (
        <FlatList
            horizontal
            data={medias}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
                <Image
                    source={{ uri: item }}
                    style={styles.image}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        width: 120,
        height: 120,
        borderRadius: 12,
        marginRight: 12,
    },
});