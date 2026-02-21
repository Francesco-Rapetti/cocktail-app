import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

const SkeletonText = ({
	colorOuter,
	colorInner,
	width = "60%",
	height = 14,
	styles,
}: {
	colorOuter: string;
	colorInner: string;
	width?: string | number;
	height?: string | number;
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
		<View
			style={[
				stylesCustom.skeletonOuter,
				{
					backgroundColor: colorOuter,
					height: height,
					width: width,
				},
				styles,
			]}>
			<Animated.View
				style={[
					gradientAnimatedStyle,
					stylesCustom.skeletonInner,
					{
						backgroundColor: colorInner,
					},
				]}
			/>
		</View>
	);
};

export default SkeletonText;

const stylesCustom = StyleSheet.create({
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
