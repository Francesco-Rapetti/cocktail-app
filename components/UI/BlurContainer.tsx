import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";

const BlurContainer = ({
	children,
	style,
}: {
	children: React.ReactNode;
	style?: object;
}) => {
	const theme = useColorScheme() ?? "light";
	return (
		<View style={[style]}>
			<BlurView
				intensity={50}
				experimentalBlurMethod="dimezisBlurView"
				style={StyleSheet.absoluteFill}
			/>
			<View
				style={[
					styles.overlay,
					{
						backgroundColor: Colors[theme].surface,
						opacity:
							Platform.OS === "ios" || theme === "dark"
								? 0.7
								: 0.5,
					},
				]}
			/>
			{children}
		</View>
	);
};

export default BlurContainer;

const styles = StyleSheet.create({
	overlay: {
		padding: 12,
		flex: 1,
		justifyContent: "center",
		position: "absolute",
		width: "100%",
		height: "100%",
	},
});
