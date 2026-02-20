import Colors from "@/constants/Colors";
import React, { useMemo } from "react";
import { Animated, StyleSheet, useColorScheme, View } from "react-native";

interface PaginationDotsProps {
	data: any[];
	scrollX: Animated.Value;
	screenWidth: number;
}

const dotSize = 6;
const gap = 4;

export const PaginationDots = ({
	data,
	scrollX,
	screenWidth,
}: PaginationDotsProps) => {
	const theme = useColorScheme() ?? "light";

	const { translateX, indicatorWidth } = useMemo(() => {
		if (!data || data.length === 0 || screenWidth <= 0) {
			return {
				translateX: new Animated.Value(0),
				indicatorWidth: new Animated.Value(dotSize),
			};
		}

		const translateInputRange = data.map((_, i) => i * screenWidth);
		const translateOutputRange = data.map((_, i) => i * (dotSize + gap));

		const widthInputRange: number[] = [];
		const widthOutputRange: number[] = [];

		data.forEach((_, i) => {
			widthInputRange.push(i * screenWidth);
			widthOutputRange.push(dotSize);

			if (i < data.length - 1) {
				widthInputRange.push(i * screenWidth + screenWidth / 2);
				widthOutputRange.push(dotSize * 2);
			}
		});

		return {
			translateX: scrollX.interpolate({
				inputRange: translateInputRange,
				outputRange: translateOutputRange,
				extrapolate: "clamp",
			}),
			indicatorWidth: scrollX.interpolate({
				inputRange: widthInputRange,
				outputRange: widthOutputRange,
				extrapolate: "clamp",
			}),
		};
	}, [data, screenWidth, scrollX]);

	if (!data || data.length === 0) return null;

	return (
		<View style={styles.PaginationDotsContainer}>
			{data.map((_, index) => (
				<View
					key={index}
					style={[
						styles.staticDot,
						{ backgroundColor: Colors[theme].inactiveIndicator },
					]}
				/>
			))}

			<Animated.View
				style={[
					styles.activeDot,
					{
						width: indicatorWidth,
						transform: [{ translateX }],
						backgroundColor: Colors[theme].activeIndicator,
					},
				]}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	PaginationDotsContainer: {
		flexDirection: "row",
		alignSelf: "center",
		alignItems: "center",
		gap: gap,
		marginTop: 10,
		height: 20,
	},
	staticDot: {
		width: dotSize,
		height: dotSize,
		borderRadius: 4,
	},
	activeDot: {
		position: "absolute",
		left: 0,
		height: dotSize,
		borderRadius: 4,
	},
});
