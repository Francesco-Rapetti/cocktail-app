import Colors from "@/constants/Colors";
import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
	LayoutChangeEvent,
	Platform,
	StyleSheet,
	useColorScheme,
	View,
} from "react-native";
import Animated, {
	Easing,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBarButton from "./TabBarButton";

export default function TabBar({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) {
	const theme = useColorScheme() ?? "light";
	const insets = useSafeAreaInsets();

	const [containerSize, setContainerSize] = useState({
		width: 0,
		height: 84,
	});
	const INDICATOR_MARGIN = 6;
	const indicatorSize = Math.max(
		50,
		containerSize.height - INDICATOR_MARGIN * 2,
	);

	const positions = useRef<number[]>([]);
	const widths = useRef<number[]>([]);

	const [maxItemWidth, setMaxItemWidth] = useState<number | null>(null);

	const tabPositionX = useSharedValue(0);
	const scaleValue = useSharedValue(0);
	const bottomValue = useSharedValue(0);
	const borderRadiusValue = useSharedValue(0);

	const animatedIndicatorStyle = useAnimatedStyle(() => {
		const scaleX = interpolate(scaleValue.value, [0, 1], [1, 0]);
		return {
			transform: [{ translateX: tabPositionX.value }, { scaleX }],
		};
	});

	const animatedBottomStyle = useAnimatedStyle(() => {
		const startBottom = Platform.OS === "ios" ? 0 : -15;
		const translateY = interpolate(
			bottomValue.value,
			[0, 1],
			[startBottom, containerSize.height],
		);
		return { transform: [{ translateY }] };
	});

	useEffect(() => {
		scaleValue.value = withTiming(
			-0.4,
			{ duration: 140, easing: Easing.out(Easing.quad) },
			() => {
				scaleValue.value = withTiming(0, {
					duration: 180,
					easing: Easing.out(Easing.cubic),
				});
			},
		);

		borderRadiusValue.value = withTiming(
			1,
			{ duration: 150, easing: Easing.out(Easing.quad) },
			() => {
				borderRadiusValue.value = withTiming(0, {
					duration: 200,
					easing: Easing.out(Easing.cubic),
				});
			},
		);
	}, [borderRadiusValue, scaleValue, state.index]);

	useEffect(() => {
		if (
			positions.current[state.index] == null ||
			(maxItemWidth == null && widths.current[state.index] == null)
		)
			return;

		const w = maxItemWidth ?? widths.current[state.index];
		const buttonCenter = positions.current[state.index] + w / 2;
		const xCenter = buttonCenter - indicatorSize / 2;

		tabPositionX.value = withSpring(xCenter, {
			stiffness: 120,
			damping: 12,
			mass: 0.6,
			overshootClamping: false,
		});
	}, [state.index, indicatorSize, tabPositionX, maxItemWidth]);

	const icons = {
		index: (props: any) => <Octicons name="home" size={24} {...props} />,
		search: (props: any) => (
			<FontAwesome6 name="magnifying-glass" size={24} {...props} />
		),
		favourites: (props: any) => (
			<FontAwesome6 name="heart" size={24} {...props} />
		),
	};

	const onTabbarLayout = (e: LayoutChangeEvent) => {
		setContainerSize({
			width: e.nativeEvent.layout.width,
			height: e.nativeEvent.layout.height,
		});
	};

	const makeHandleButtonLayout =
		(index: number) => (e: LayoutChangeEvent) => {
			const w = e.nativeEvent.layout.width;
			const x = e.nativeEvent.layout.x;

			positions.current[index] = x;
			widths.current[index] = w;

			// aggiorna la max width (prima passata: larghezze naturali)
			setMaxItemWidth((prev) => (prev == null || w > prev ? w : prev));
		};

	return (
		<>
			<View style={{ flex: 0 }} pointerEvents="box-none">
				<Animated.View
					style={[
						animatedBottomStyle,
						{
							position: "absolute",
							alignSelf: "center",
							bottom: Math.max(10, insets.bottom + 8),
						},
					]}
					pointerEvents="box-none">
					<View pointerEvents="box-none">
						<View style={styles.tabbarContainer}>
							<BlurView
								intensity={180}
								experimentalBlurMethod="dimezisBlurView"
								tint={theme === "dark" ? "dark" : "light"}
								style={styles.blur}>
								{/* layer di colore per uniformare la sfocatura */}
								<View
									pointerEvents="none"
									style={[
										StyleSheet.absoluteFillObject,
										{
											backgroundColor:
												Colors[theme].surface,
											opacity: 0.5,
										},
									]}
								/>

								<View
									onLayout={onTabbarLayout}
									style={[
										styles.tabbar,
										{ flexDirection: "row" },
									]}>
									{/* Indicatore */}
									<Animated.View
										pointerEvents="none"
										style={[
											{
												position: "absolute",
												backgroundColor:
													Colors[theme].tint,
												borderRadius: 999,
												width: indicatorSize,
												height: indicatorSize,
											},
											animatedIndicatorStyle,
										]}
									/>

									{/* Pulsanti */}
									{state.routes.map((route, index) => {
										const { options } =
											descriptors[route.key];
										const label =
											options.tabBarLabel ??
											options.title ??
											route.name;
										const isFocused = state.index === index;

										const onPress = () => {
											const event = navigation.emit({
												type: "tabPress",
												target: route.key,
												canPreventDefault: true,
											});
											if (
												!isFocused &&
												!event.defaultPrevented
											)
												navigation.navigate(route.name);
										};

										const onLongPress = () => {
											navigation.emit({
												type: "tabLongPress",
												target: route.key,
											});
										};

										return (
											<View
												key={route.name}
												onLayout={makeHandleButtonLayout(
													index,
												)}
												style={{
													marginHorizontal: 10,
													width:
														maxItemWidth ??
														undefined,
												}}>
												<TabBarButton
													onPress={onPress}
													onLongPress={onLongPress}
													isFocused={isFocused}
													routeName={route.name}
													label={String(label)}
													icons={icons}
												/>
											</View>
										);
									})}
								</View>
							</BlurView>
						</View>
					</View>
				</Animated.View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	tabbarContainer: {
		borderRadius: 50,
		overflow: "hidden",
		alignSelf: "center",
		boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.25)",
	},
	blur: {
		paddingVertical: 3,
		paddingHorizontal: 6,
	},
	tabbar: {
		alignItems: "center",
		paddingHorizontal: 2,
		gap: 8,
	},
});
