import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/src/components/ui/Button";
import { colors } from "@/src/theme";

interface Props {
    onGoHome?: () => void;
}

export const AccessDeniedScreen = ({
                                       onGoHome,
                                   }: Props) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>
                    🚫
                </Text>

                <Text style={styles.title}>
                    Accès refusé
                </Text>

                <Text style={styles.subtitle}>
                    Vous ne disposez pas des permissions
                    nécessaires pour accéder à cette page.
                </Text>

                {onGoHome && (
                    <Button
                        text="Retour"
                        onPress={onGoHome}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },

    icon: {
        fontSize: 64,
        marginBottom: 24,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 12,
    },

    subtitle: {
        textAlign: "center",
        color: colors.textSecondary,
        lineHeight: 22,
        marginBottom: 32,
    },
});