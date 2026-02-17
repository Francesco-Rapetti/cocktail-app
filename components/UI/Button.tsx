import React, { useEffect } from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps {
	label: string;
	onPress: () => void;
	mode?: "square" | "circle";
	isLoading?: boolean;
	backgroundColor: string;
	labelColor: string;
	IconLeft?: React.ElementType;
	IconRight?: React.ElementType;
	style?: StyleProp<ViewStyle>;
	labelStyle?: StyleProp<TextStyle>;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	label,
	onPress,
	mode = "circle",
	isLoading = false,
	backgroundColor,
	labelColor,
	IconLeft,
	IconRight,
	style,
	labelStyle,
	disabled = false,
}) => {
	const scale = useSharedValue(1);
	const loadingOpacity = useSharedValue(isLoading ? 1 : 0);
	const pressOpacity = useSharedValue(1);

	useEffect(() => {
		loadingOpacity.value = withTiming(isLoading ? 1 : 0, { duration: 150 });
	}, [isLoading]);

	const handlePressIn = () => {
		if (!isLoading && !disabled) {
			scale.value = withSpring(0.95, {
				damping: 30,
				stiffness: 500,
				mass: 1,
			});
			pressOpacity.value = withTiming(0.6, { duration: 150 });
		}
	};

	const handlePressOut = () => {
		if (!isLoading && !disabled) {
			scale.value = withSpring(1, {
				damping: 30,
				stiffness: 500,
				mass: 1,
			});
			pressOpacity.value = withTiming(1, { duration: 150 });
		}
	};

	const borderRadius = mode === "circle" ? 9999 : 12;

	const rButtonStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
			backgroundColor: disabled ? "#A0A0A0" : backgroundColor,
			borderRadius: borderRadius,
		};
	});

	const rContentStyle = useAnimatedStyle(() => {
		const loadingAlpha = interpolate(
			loadingOpacity.value,
			[0, 1],
			[1, 0],
			Extrapolation.CLAMP,
		);

		return {
			opacity: loadingAlpha * pressOpacity.value,
		};
	});

	const rSpinnerStyle = useAnimatedStyle(() => {
		return {
			opacity: loadingOpacity.value,
			transform: [
				{
					scale: interpolate(loadingOpacity.value, [0, 1], [0.5, 1]),
				},
			],
		};
	});

	return (
		<AnimatedPressable
			onPress={isLoading || disabled ? undefined : onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			style={[styles.container, { borderRadius }, style, rButtonStyle]}
			disabled={isLoading || disabled}>
			<Animated.View style={[styles.contentContainer, rContentStyle]}>
				{IconLeft && (
					<View style={styles.iconLeft}>
						<IconLeft color={labelColor} size={20} />
					</View>
				)}

				<Text style={[styles.label, { color: labelColor }, labelStyle]}>
					{label}
				</Text>

				{IconRight && (
					<View style={styles.iconRight}>
						<IconRight color={labelColor} size={20} />
					</View>
				)}
			</Animated.View>

			<Animated.View style={[styles.spinnerContainer, rSpinnerStyle]}>
				<ActivityIndicator color={labelColor} size="small" />
			</Animated.View>
		</AnimatedPressable>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		paddingVertical: 10,
		paddingHorizontal: 16,
	},
	contentContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		textAlign: "center",
	},
	iconLeft: {
		marginRight: 8,
	},
	iconRight: {
		marginLeft: 8,
	},
	spinnerContainer: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Button;
