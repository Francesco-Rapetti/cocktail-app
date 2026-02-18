import Colors from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

const SkeletonCard = ({ height = 250 }: { height?: number }) => {
	const theme = useColorScheme() ?? "light";

	const linearPosition = useSharedValue(0.2);

	const gradientAnimatedStyle = useAnimatedStyle(() => ({
		opacity: linearPosition.value,
	}));

	useEffect(() => {
		linearPosition.value = withRepeat(
			withTiming(0.8, {
				duration: 800,
				easing: Easing.linear,
			}),
			0,
			true,
		);
	}, []);

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: Colors[theme].surface, height: height },
			]}>
			<View style={styles.iconContainer}>
				<Animated.View
					style={[
						gradientAnimatedStyle,
						{
							borderRadius: 9999,
							padding: 24,
						},
					]}>
					<FontAwesome5
						name="cocktail"
						size={48}
						color={Colors[theme].primaryText}
					/>
				</Animated.View>
			</View>
			<View style={styles.textContainer}>
				<View
					style={[
						styles.skeletonOuter,
						{
							backgroundColor: Colors[theme].surface,
							width: "80%",
						},
					]}>
					<Animated.View
						style={[
							gradientAnimatedStyle,
							styles.skeletonInner,
							{
								backgroundColor: Colors[theme].primaryText,
							},
						]}
					/>
				</View>

				<View
					style={[
						styles.skeletonOuter,
						{
							backgroundColor: Colors[theme].surface,
						},
					]}>
					<Animated.View
						style={[
							gradientAnimatedStyle,
							styles.skeletonInner,
							{
								backgroundColor: Colors[theme].primaryText,
							},
						]}
					/>
				</View>
			</View>
		</View>
	);
};

export default SkeletonCard;

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		boxShadow: `0 4px 6px rgba(0,0,0,0.1)`,
		overflow: "hidden",
	},
	skeletonContainer: {
		position: "absolute",
		bottom: 0,
		width: "100%",
	},
	textContainer: {
		justifyContent: "flex-end",
		gap: 12,
		padding: 16,
	},
	iconContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	skeletonOuter: {
		height: 14,
		width: "60%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 50,
		overflow: "hidden",
	},
	skeletonInner: {
		position: "absolute",
		width: "100%",
		height: "100%",
		left: 0,
	},
});
