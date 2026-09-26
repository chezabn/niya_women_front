import React from "react";

import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    Publication,
} from "@niyya/types";

import { colors } from "@/src/theme";


interface Props {
    posts: Publication[];

    onPress: (
        publication: Publication,
    ) => void;

    onLike: (
        publication: Publication,
    ) => void;
}


export const PublicationList = ({
                                    posts,
                                    onPress,
                                    onLike,
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
                    {/* Header */}
                    <View
                        style={
                            styles.header
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.author
                                }
                            >
                                {item.author.username}
                            </Text>

                            <Text
                                style={
                                    styles.date
                                }
                            >
                                {formatDate(
                                    item.created_at,
                                )}
                            </Text>
                        </View>

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


                    {/* Contenu */}
                    {item.caption ? (
                        <Text
                            style={
                                styles.caption
                            }
                        >
                            {item.caption}
                        </Text>
                    ) : null}


                    {/* Footer */}
                    <View
                        style={
                            styles.cardFooter
                        }
                    >
                        <View
                            style={
                                styles.interactionContainer
                            }
                        >
                            {/* Like */}
                            <Pressable
                                style={
                                    styles.likeContainer
                                }
                                onPress={(event) => {
                                    event.stopPropagation();
                                    onLike(item);
                                }}
                                hitSlop={8}
                            >
                                <Ionicons
                                    name={
                                        item.is_liked
                                            ? "heart"
                                            : "heart-outline"
                                    }
                                    size={19}
                                    color={
                                        item.is_liked
                                            ? "#E88A9A"
                                            : "#888"
                                    }
                                />

                                <Text
                                    style={
                                        styles.likeText
                                    }
                                >
                                    {item.like_count}
                                </Text>
                            </Pressable>


                            {/* Commentaires */}
                            <View
                                style={
                                    styles.commentContainer
                                }
                            >
                                <Ionicons
                                    name="chatbubble-outline"
                                    size={17}
                                    color="#888"
                                />

                                <Text
                                    style={
                                        styles.commentText
                                    }
                                >
                                    {item.comments_enabled
                                        ? "Commentaires"
                                        : "Commentaires désactivés"}
                                </Text>
                            </View>
                        </View>


                        {/* Détail */}
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#AAA"
                        />
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

        date: {
            fontSize: 12,
            color: "#888",
            marginTop: 3,
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
            marginBottom: 16,
        },

        /*
         * Footer
         */
        cardFooter: {
            flexDirection:
                "row",
            alignItems:
                "center",
            justifyContent:
                "space-between",
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#F0F0F0",
        },

        interactionContainer: {
            flexDirection:
                "row",
            alignItems:
                "center",
            gap: 18,
        },

        likeContainer: {
            flexDirection:
                "row",
            alignItems:
                "center",
        },

        likeText: {
            fontSize: 12,
            color: "#888",
            marginLeft: 6,
        },

        commentContainer: {
            flexDirection:
                "row",
            alignItems:
                "center",
        },

        commentText: {
            fontSize: 12,
            color: "#888",
            marginLeft: 6,
        },
    });