import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

const SkeletonIcon = ({
	icon,
	styles,
}: {
	icon?: React.ReactNode;
	styles?: any;
}) => {
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
		<View style={[stylesCustom.iconContainer, styles]}>
			<Animated.View
				style={[
					gradientAnimatedStyle,
					{
						borderRadius: 9999,
						padding: 24,
					},
				]}>
				{icon}
			</Animated.View>
		</View>
	);
};

export default SkeletonIcon;

const stylesCustom = StyleSheet.create({
	iconContainer: {
		height: "100%",
		aspectRatio: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
