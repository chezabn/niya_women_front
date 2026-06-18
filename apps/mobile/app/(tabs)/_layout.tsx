import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/src/theme";
import {AuthGuard} from "@/src/components/auth/AuthGuard";

export default function TabsLayout() {
    return (
        <AuthGuard>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,

                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: "#999",

                    tabBarStyle: {
                        height: 70,
                        paddingTop: 8,
                        paddingBottom: 8,
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Accueil",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="home-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="new-publication"
                    options={{
                        title: "Publier",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="add-circle-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profil",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="person-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </AuthGuard>
    );
}