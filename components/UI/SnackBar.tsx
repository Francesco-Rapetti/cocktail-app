import { Text } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";
import { useAppStore } from "@/stores/AppStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Snackbar() {
	const snackbar = useAppStore((state) => state.snackbar);
	const hideSnackbar = useAppStore((state) => state.hideSnackbar);
	const insets = useSafeAreaInsets();
	const theme = useColorScheme() ?? "light";

	useEffect(() => {
		if (snackbar) {
			const timer = setTimeout(() => {
				hideSnackbar();
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [snackbar, hideSnackbar]);

	const { backgroundColor, iconName } = useMemo(() => {
		if (!snackbar)
			return {
				backgroundColor: Colors[theme].tint,
				iconName: "alert-circle" as const,
			};

		switch (snackbar.type) {
			case "success":
				return {
					backgroundColor: "#4CAF50",
					iconName: "checkmark-circle" as const,
				};
			case "info":
				return {
					backgroundColor: "#2196F3",
					iconName: "information-circle" as const,
				};
			case "error":
			default:
				return {
					backgroundColor: "#F44336",
					iconName: "alert-circle" as const,
				};
		}
	}, [snackbar, theme]);

	if (!snackbar) return null;

	return (
		<Animated.View
			key={snackbar.message}
			entering={FadeInUp.duration(300).springify()}
			exiting={FadeOutUp.duration(300)}
			style={[
				styles.container,
				{
					top: insets.top + 10,
					backgroundColor: backgroundColor,
				},
			]}>
			<Ionicons name={iconName} size={24} color="#FFFFFF" />
			<Text style={[styles.message, { color: "#FFFFFF" }]}>
				{snackbar.message}
			</Text>
			<TouchableOpacity onPress={hideSnackbar} style={styles.closeButton}>
				<Ionicons name="close" size={20} color="#FFFFFF" />
			</TouchableOpacity>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		left: 16,
		right: 16,
		zIndex: 9999,
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 6,
	},
	message: {
		flex: 1,
		marginLeft: 12,
		fontSize: 16,
		fontWeight: "600",
	},
	closeButton: {
		padding: 4,
	},
});
