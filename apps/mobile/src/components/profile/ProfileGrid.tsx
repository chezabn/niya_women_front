import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
} from "react-native";

const SIZE =
    Dimensions.get("window").width / 3;

interface Props {
    posts: string[];
}

export const PostGrid = ({
                             posts,
                         }: Props) => {
    return (
        <FlatList
            data={posts}
            numColumns={3}
            scrollEnabled={false}
            keyExtractor={(
                item,
                index,
            ) =>
                `${item}-${index}`
            }
            renderItem={({
                             item,
                         }) => (
                <Image
                    source={{
                        uri: item,
                    }}
                    style={
                        styles.image
                    }
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        width: SIZE,
        height: SIZE,
    },
});