import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
} from "react-native";

import {
    Publication,
} from "@niyya/types";

const SIZE =
    Dimensions.get("window").width / 3;

interface Props {
    posts: Publication[];
}

export const PostGrid = ({
                             posts,
                         }: Props) => {
    return (
        <FlatList
            data={posts}
            numColumns={3}
            scrollEnabled={false}
            keyExtractor={(item) =>
                item.id.toString()
            }
            renderItem={({ item }) => {
                const cover =
                    item.medias?.[0];

                if (!cover) {
                    return null;
                }

                return (
                    <Image
                        source={{
                            uri: cover.file,
                        }}
                        style={
                            styles.image
                        }
                    />
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        width: SIZE,
        height: SIZE,
    },
});