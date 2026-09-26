import React from "react";

import {Pressable, StyleSheet, Text, View,} from "react-native";

import {Ionicons} from "@expo/vector-icons";

import {Publication,} from "@niyya/types";
import {colors} from "@/src/theme";


/*
 * Formatage de la date
 */
const formatDate = (
    date: string,
): string => {
    return new Date(date).toLocaleDateString(
        "fr-FR",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        },
    );
};

/*
 * Carte publication
 */
interface PublicationCardProps {
    publication: Publication;
    onPress: () => void;
    onLike: () => void;
}



export const PublicationCard = ({
                             publication,
                             onPress,
                             onLike,
                         }: PublicationCardProps) => {

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            {/* Auteur */}
            <View style={styles.cardHeader}>
                <View style={styles.authorContainer}>
                    <View style={styles.authorCircle}>
                        <Text
                            style={
                                styles.authorInitial
                            }
                        >
                            {publication.author.username
                                ?.charAt(0)
                                .toUpperCase()}
                        </Text>
                    </View>

                    <View>
                        <Text
                            style={
                                styles.username
                            }
                        >
                            {publication.author.username}
                        </Text>

                        <Text
                            style={
                                styles.date
                            }
                        >
                            {formatDate(
                                publication.created_at,
                            )}
                        </Text>
                    </View>
                </View>

                <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color="#999"
                />
            </View>


            {/* Contenu */}
            {publication.caption ? (
                <Text style={styles.caption}>
                    {publication.caption}
                </Text>
            ) : null}


            {/* Footer */}
            <View style={styles.cardFooter}>
                <View style={styles.interactionContainer}>
                    <Pressable
                        style={styles.likeContainer}
                        onPress={onLike}
                        hitSlop={8}
                    >
                        <Ionicons
                            name={
                                publication.is_liked
                                    ? "heart"
                                    : "heart-outline"
                            }
                            size={19}
                            color={
                                publication.is_liked
                                    ? "#E88A9A"
                                    : "#888"
                            }
                        />

                        <Text style={styles.likeText}>
                            {publication.like_count}
                        </Text>
                    </Pressable>

                    <View style={styles.commentContainer}>
                        <Ionicons
                            name="chatbubble-outline"
                            size={17}
                            color="#888"
                        />

                        <Text style={styles.commentText}>
                            {publication.comments_enabled
                                ? "Commentaires"
                                : "Commentaires désactivés"}
                        </Text>
                    </View>
                </View>

                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#AAA"
                />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    /*
     * Header
     */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 8,
    },

    logo: {
        fontSize: 27,
        fontWeight: "800",
        color: colors.primary,
        letterSpacing: 0.5,
    },

    notificationButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    notificationBadge: {
        position: "absolute",
        top: 9,
        right: 9,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#D9534F",
    },

    interactionContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },

    likeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    likeText: {
        fontSize: 12,
        color: "#888",
        marginLeft: 6,
    },

    /*
     * Titre
     */
    titleContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 12,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: colors.black,
    },

    subtitle: {
        fontSize: 14,
        color: "#888",
        marginTop: 5,
    },

    /*
     * Liste
     */
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 110,
    },

    emptyList: {
        flexGrow: 1,
    },

    /*
     * Publication
     */
    card: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: "#ECECEC",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
    },

    cardPressed: {
        opacity: 0.7,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    authorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    authorCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#F5E9C8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },

    authorInitial: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.primary,
    },

    username: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.black,
    },

    date: {
        fontSize: 12,
        color: "#999",
        marginTop: 3,
    },

    caption: {
        fontSize: 16,
        lineHeight: 25,
        color: colors.black,
        marginTop: 16,
        marginBottom: 16,
    },

    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },

    commentContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    commentText: {
        fontSize: 12,
        color: "#888",
        marginLeft: 6,
    },

    /*
     * Empty state
     */
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },

    emptyIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#FAF4E5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.black,
        textAlign: "center",
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 21,
        color: "#888",
        textAlign: "center",
        marginTop: 8,
    },

    /*
     * Bouton flottant
     */
    floatingButton: {
        position: "absolute",
        right: 24,
        bottom: 24,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",

        elevation: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },

    floatingButtonPressed: {
        opacity: 0.75,
    },

    /*
     * Loading
     */
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});