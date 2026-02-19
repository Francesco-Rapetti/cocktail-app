import React from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleProp,
	StyleSheet,
	ViewStyle,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";

interface IconButtonProps {
	icon: React.ReactNode;
	onPress?: () => void;
	isLoading?: boolean;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const IconButton: React.FC<IconButtonProps> = ({
	icon,
	onPress,
	isLoading = false,
	disabled = false,
	style,
}) => {
	const scale = useSharedValue(1);
	const pressOpacity = useSharedValue(1);

	const handlePressIn = () => {
		if (!isLoading && !disabled) {
			scale.value = withSpring(0.9, {
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

	const rButtonStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
			opacity: disabled ? 0.5 : pressOpacity.value,
		};
	});

	return (
		<AnimatedPressable
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled || isLoading}
			hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
			style={[styles.container, rButtonStyle, style]}>
			{isLoading ? <ActivityIndicator size="small" color="#000" /> : icon}
		</AnimatedPressable>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
});

export default IconButton;
