import React, {
    useCallback,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/src/theme";
import { Button } from "@/src/components/ui/Button";

import { Publication } from "@niyya/types";

import {
    getMyPublication,
    deletePublication,
} from "@niyya/api";

import { useAuthStore } from "@/src/store/authStore";


const getPublicationById = async (
    id: string,
    accessToken: string,
): Promise<Publication> => {
    return getMyPublication(
        accessToken,
        Number(id),
    );
};


const deletePublicationById = async (
    id: number,
    accessToken: string,
): Promise<void> => {
    await deletePublication(
        accessToken,
        id,
    );
};


export const PublicationDetailScreen = () => {
    const { id } =
        useLocalSearchParams<{
            id: string;
        }>();

    const accessToken =
        useAuthStore(
            (state) =>
                state.accessToken,
        );

    const [
        publication,
        setPublication,
    ] = useState<
        Publication | null
    >(null);

    const [
        loading,
        setLoading,
    ] = useState(true);


    useFocusEffect(
        useCallback(() => {
            const loadPublication =
                async () => {
                    if (
                        !id ||
                        !accessToken
                    ) {
                        setLoading(false);
                        return;
                    }

                    try {
                        setLoading(true);

                        const data =
                            await getPublicationById(
                                id,
                                accessToken,
                            );

                        setPublication(
                            data,
                        );
                    } catch (error) {
                        console.error(
                            "Erreur lors du chargement de la publication :",
                            error,
                        );
                    } finally {
                        setLoading(false);
                    }
                };

            loadPublication();
        }, [
            id,
            accessToken,
        ]),
    );


    const handleDelete = () => {
        if (
            !publication ||
            !accessToken
        ) {
            return;
        }

        Alert.alert(
            "Supprimer la publication",
            "Voulez-vous vraiment supprimer cette publication ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deletePublicationById(
                                publication.id,
                                accessToken,
                            );

                            router.back();
                        } catch (error) {
                            console.error(
                                "Erreur lors de la suppression de la publication :",
                                error,
                            );

                            Alert.alert(
                                "Erreur",
                                "Impossible de supprimer cette publication.",
                            );
                        }
                    },
                },
            ],
        );
    };


    const handleEdit = () => {
        if (!publication) {
            return;
        }

        router.push(
            `/publications/${publication.id}/edit`,
);
};


if (loading) {
    return (
        <SafeAreaView
            style={
                styles.container
            }
        >
            <View
                style={
                    styles.loading
                }
            >
                <ActivityIndicator
                    size="large"
                    color={
                        colors.primary
                    }
                />
            </View>
        </SafeAreaView>
    );
}


if (!publication) {
    return (
        <SafeAreaView
            style={
                styles.container
            }
        >
            <View
                style={
                    styles.loading
                }
            >
                <Text>
                    Publication
                    introuvable.
                </Text>
            </View>
        </SafeAreaView>
    );
}


return (
    <SafeAreaView
        style={
            styles.container
        }
    >

        {/* Header */}
        <View
            style={
                styles.header
            }
        >

            <TouchableOpacity
                style={
                    styles.headerButton
                }
                onPress={() =>
                    router.back()
                }
                activeOpacity={0.7}
            >
                <Ionicons
                    name="arrow-back"
                    size={26}
                    color={
                        colors.black
                    }
                />
            </TouchableOpacity>


            <TouchableOpacity
                style={
                    styles.headerButton
                }
                onPress={
                    handleDelete
                }
                activeOpacity={0.7}
            >
                <Ionicons
                    name="trash-outline"
                    size={24}
                    color="#D9534F"
                />
            </TouchableOpacity>

        </View>


        {/* Content */}
        <ScrollView
            contentContainerStyle={
                styles.content
            }
            showsVerticalScrollIndicator={
                false
            }
        >
            <Text
                style={
                    styles.username
                }
            >
                {
                    publication
                        .author
                        .username
                }
            </Text>


            {publication.caption ? (
                <Text
                    style={
                        styles.caption
                    }
                >
                    {
                        publication
                            .caption
                    }
                </Text>
            ) : null}


            {publication.is_edited && (
                <Text
                    style={
                        styles.edited
                    }
                >
                    Publication modifiée
                </Text>
            )}


            <Text
                style={
                    styles.date
                }
            >
                {formatDate(
                    publication.created_at,
                )}
            </Text>


            <Text
                style={
                    styles.comments
                }
            >
                {publication
                    .comments_enabled
                    ? "Commentaires activés"
                    : "Commentaires désactivés"}
            </Text>

        </ScrollView>


        {/* Bottom action */}
        <View
            style={
                styles.bottom
            }
        >
            <Button
                text="Modifier"
                onPress={
                    handleEdit
                }
            />
        </View>

    </SafeAreaView>
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
            flex: 1,
            backgroundColor:
            colors.white,
        },

        header: {
            flexDirection:
                "row",
            justifyContent:
                "space-between",
            alignItems:
                "center",
            paddingHorizontal: 20,
            paddingTop: 8,
        },

        headerButton: {
            width: 44,
            height: 44,
            alignItems:
                "center",
            justifyContent:
                "center",
        },

        content: {
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 32,
        },

        username: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 16,
        },

        caption: {
            fontSize: 18,
            lineHeight: 26,
            color: colors.black,
            marginBottom: 16,
        },

        edited: {
            fontSize: 13,
            fontWeight: "600",
            color: colors.primary,
            marginBottom: 8,
        },

        date: {
            fontSize: 13,
            color: "#888",
            marginBottom: 8,
        },

        comments: {
            fontSize: 13,
            color: "#888",
        },

        bottom: {
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: "#ECECEC",
            backgroundColor:
            colors.white,
        },

        loading: {
            flex: 1,
            alignItems:
                "center",
            justifyContent:
                "center",
        },
    });
