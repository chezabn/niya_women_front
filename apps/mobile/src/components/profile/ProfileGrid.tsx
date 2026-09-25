import React from "react";

import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    Publication,
} from "@niyya/types";

import { colors } from "@/src/theme";


interface Props {
    posts: Publication[];
    onPress: (
        publication: Publication,
    ) => void;
}


export const PostGrid = ({
    posts,
    onPress,
}: Props) => {
    return (
        <FlatList
            data={posts}
            scrollEnabled={false}
            keyExtractor={(item) =>
                item.id.toString()
            }
            contentContainerStyle={
                styles.container
            }
            renderItem={({ item }) => (
                <Pressable
                    onPress={() =>
                        onPress(item)
                    }
                    style={({ pressed }) => [
                        styles.post,
                        pressed &&
                            styles.pressed,
                    ]}
                >
                    <View
                        style={
                            styles.header
                        }
                    >
                        <Text
                            style={
                                styles.author
                            }
                        >
                            {item.author.username}
                        </Text>

                        {item.is_edited && (
                            <Text
                                style={
                                    styles.edited
                                }
                            >
                                Modifiée
                            </Text>
                        )}
                    </View>

                    {item.caption ? (
                        <Text
                            style={
                                styles.caption
                            }
                        >
                            {item.caption}
                        </Text>
                    ) : null}

                    <View
                        style={
                            styles.footer
                        }
                    >
                        <Text
                            style={
                                styles.date
                            }
                        >
                            {formatDate(
                                item.created_at,
                            )}
                        </Text>

                        {item.comments_enabled && (
                            <Text
                                style={
                                    styles.comments
                                }
                            >
                                Commentaires activés
                            </Text>
                        )}
                    </View>
                </Pressable>
            )}
        />
    );
};


const formatDate = (
    date: string,
) => {
    return new Date(
        date,
    ).toLocaleDateString(
        "fr-FR",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        },
    );
};


const styles =
    StyleSheet.create({
        container: {
            paddingTop: 16,
            paddingBottom: 16,
        },

        post: {
            paddingVertical: 16,
            paddingHorizontal: 16,
            marginBottom: 12,
            backgroundColor:
                colors.white,
            borderWidth: 1,
            borderColor: "#EEE",
            borderRadius: 12,
        },

        pressed: {
            opacity: 0.7,
        },

        header: {
            flexDirection:
                "row",
            alignItems:
                "center",
            justifyContent:
                "space-between",
            marginBottom: 10,
        },

        author: {
            fontSize: 15,
            fontWeight: "700",
            color: colors.black,
        },

        edited: {
            fontSize: 12,
            color: colors.primary,
            fontWeight: "600",
        },

        caption: {
            fontSize: 15,
            lineHeight: 22,
            color: colors.black,
            marginBottom: 12,
        },

        footer: {
            flexDirection:
                "row",
            alignItems:
                "center",
            justifyContent:
                "space-between",
        },

        date: {
            fontSize: 12,
            color: "#888",
        },

        comments: {
            fontSize: 12,
            color: "#888",
        },
    });
