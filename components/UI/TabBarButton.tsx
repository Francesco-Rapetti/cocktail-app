import Colors from "@/constants/Colors";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import Animated, {
	interpolate,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

export default function TabBarButton({
	onPress,
	onLongPress,
	routeName,
	isFocused,
	label,
	icons,
}: {
	onPress: any;
	onLongPress: any;
	routeName: string;
	isFocused: boolean;
	label: string;
	icons: any;
}) {
	const theme = useColorScheme() ?? "light";
	const scale = useSharedValue(0);

	useEffect(() => {
		scale.value = withSpring(
			typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
			{ duration: 350 },
		);
	}, [scale, isFocused]);

	const animatedTextStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scale.value, [0, 1], [1, 0]);

		return { opacity };
	});

	const animatedIconStyle = useAnimatedStyle(() => {
		const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
		const top = interpolate(scale.value, [0, 1], [0, 8]);
		const color = interpolateColor(
			scale.value,
			[0, 1],
			[Colors[theme].text, Colors[theme].surface],
		);

		return {
			color,
			transform: [
				{
					scale: scaleValue,
				},
			],
			top,
		};
	});

	return (
		<Pressable
			onPress={onPress}
			onLongPress={onLongPress}
			style={styles.tabbarItem}
			hitSlop={15}>
			<Animated.Text style={[animatedIconStyle]}>
				{icons[routeName]({
					isFocused: isFocused,
					size: 25,
					color: animatedIconStyle.color,
				})}
			</Animated.Text>
			<Animated.Text
				maxFontSizeMultiplier={1}
				numberOfLines={1}
				style={[
					animatedTextStyle,
					styles.tabbarText,
					{
						color: Colors[theme].text,
					},
				]}>
				{label}
			</Animated.Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	tabbarItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		paddingVertical: 14,
	},
	tabbarText: {
		fontSize: 12,
		fontWeight: 700,
	},
});
