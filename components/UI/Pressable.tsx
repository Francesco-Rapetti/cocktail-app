import React from "react";
import {
	Pressable as reactPressable,
	StyleProp,
	ViewStyle,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

interface PressableProps {
	children: React.ReactNode;
	onPress?: () => void;
	isLoading?: boolean;
	disabled?: boolean;
	backgroundColor?: string;
	borderRadius?: number;
	style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(reactPressable);

const Pressable: React.FC<PressableProps> = ({
	children,
	onPress,
	disabled = false,
	borderRadius = 12,
	style,
}) => {
	const scale = useSharedValue(1);

	const handlePressIn = () => {
		if (!disabled) {
			scale.value = withSpring(0.98, {
				damping: 30,
				stiffness: 500,
				mass: 1,
			});
		}
	};

	const handlePressOut = () => {
		if (!disabled) {
			scale.value = withSpring(1, {
				damping: 30,
				stiffness: 500,
				mass: 1,
			});
		}
	};

	const rButtonStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
			borderRadius: borderRadius,
		};
	});

	return (
		<AnimatedPressable
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled}
			style={[rButtonStyle, style]}>
			{children}
		</AnimatedPressable>
	);
};

export default Pressable;
