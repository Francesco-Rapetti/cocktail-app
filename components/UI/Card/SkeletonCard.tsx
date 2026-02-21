import Colors from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import SkeletonIcon from "../SkeletonLoading/SkeletonIcon";
import SkeletonText from "../SkeletonLoading/SkeletonText";

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
				<SkeletonIcon
					icon={
						<FontAwesome5
							name="cocktail"
							size={48}
							color={Colors[theme].primaryText}
						/>
					}
				/>
			</View>
			<View style={styles.textContainer}>
				<SkeletonText
					colorInner={Colors[theme].primaryText}
					colorOuter={Colors[theme].surface}
					width="80%"
					height={16}
				/>
				<SkeletonText
					colorInner={Colors[theme].primaryText}
					colorOuter={Colors[theme].surface}
					width="60%"
					height={14}
				/>
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
});
