import React, {
    useState,
} from "react";

import {
    Alert,
    ScrollView,
    StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    createPublication,
} from "@niyya/api";

import {
    PublicationEditor,
} from "@/src/components/publication/PublicationEditor";

import {
    PublicationMediaPreview,
} from "@/src/components/publication/PublicationMediaPreview";

import {
    PublicationCommentsSwitch,
} from "@/src/components/publication/PublicationCommentsSwitch";

import {
    PublicationMediaPicker,
} from "@/src/components/publication/PublicationMediaPicker";

import { Button } from "@/src/components/ui/Button";

import { useAuthStore } from "@/src/store/authStore";

import { colors } from "@/src/theme";

export const CreatePublicationScreen = () => {
    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const [caption, setCaption] = useState("");

    const [commentsEnabled, setCommentsEnabled] =
        useState(true);

    const [files, setFiles] = useState<any[]>([]);

    const handlePickMedia = async () => {
        /**
         * Ici tu brancheras
         * expo-image-picker
         */
    };

    const handlePublish = async () => {
        try {
            if (!accessToken) {
                return;
            }

            await createPublication(
                {
                    caption,
                    comments_enabled:
                    commentsEnabled,
                    files,
                },
                accessToken,
            );

            Alert.alert(
                "Publication créée",
            );

            setCaption("");
            setFiles([]);

        } catch (error) {
            console.error(error);

            Alert.alert(
                "Erreur",
                "Impossible de publier.",
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={
                    styles.content
                }
            >
                <PublicationEditor
                    value={caption}
                    onChange={setCaption}
                />

                <PublicationMediaPicker
                    onPick={handlePickMedia}
                />

                <PublicationMediaPreview
                    medias={files.map(
                        (f) => f.uri,
                    )}
                />

                <PublicationCommentsSwitch
                    value={commentsEnabled}
                    onChange={
                        setCommentsEnabled
                    }
                />

                <Button
                    text="Publier"
                    onPress={handlePublish}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    content: {
        padding: 24,
    },
});